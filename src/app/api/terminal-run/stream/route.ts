import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import type { PresetId } from "@/lib/workbench-commands";

export const runtime = "nodejs";

type Body = {
  preset?: PresetId;
  source?: string;
  address?: string;
  filename?: string;
};

type InputKind = "source" | "address";

const MAX_SOURCE_BYTES = 300_000;
const MAX_OUTPUT_BYTES = 220_000;
const TIMEOUT_MS = 25_000;

const presetMap: Record<PresetId, { args: string[]; input: InputKind }> = {
  analyze: { args: ["analyze"], input: "source" },
  "analyze-ai": { args: ["analyze", "--ai"], input: "source" },
  "ast-json": { args: ["ast", "--format", "json"], input: "source" },
  "flow-mermaid": { args: ["flow", "--format", "mermaid"], input: "source" },
  "fix-dry-run": { args: ["fix", "--fix-dry-run", "--max-auto-fix-tier", "B"], input: "source" },
  "stats-graph": { args: ["stats", "--graph"], input: "source" },
  "analyze-address": { args: ["analyze-address", "--format", "json"], input: "address" },
  explorer: { args: ["explorer", "--format", "json"], input: "address" },
};

function validAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function safeFilename(value?: string) {
  const fallback = "contract.vy";
  if (!value) return fallback;

  const cleaned = path.basename(value).replace(/[^a-zA-Z0-9._-]/g, "");
  if (!cleaned || !cleaned.endsWith(".vy")) return fallback;
  return cleaned;
}

async function parseBody(request: Request) {
  try {
    return (await request.json()) as Body;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const preset = body.preset;
  if (!preset || !(preset in presetMap)) {
    return NextResponse.json({ error: "Unsupported command preset." }, { status: 400 });
  }

  const selected = presetMap[preset];
  const sessionDir = path.join(os.tmpdir(), "vyper-guard-web", randomUUID());
  const filename = safeFilename(body.filename);
  const contractPath = path.join(sessionDir, filename);

  let target: string;

  if (selected.input === "source") {
    const source = (body.source ?? "").trim();
    if (!source) {
      return NextResponse.json({ error: "Vyper source is required for this command." }, { status: 400 });
    }

    if (Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES) {
      return NextResponse.json(
        { error: `Source is too large. Limit is ${MAX_SOURCE_BYTES} bytes.` },
        { status: 413 },
      );
    }

    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(contractPath, source, "utf8");
    target = contractPath;
  } else {
    const address = (body.address ?? "").trim();
    if (!address) {
      return NextResponse.json({ error: "Address is required for this command." }, { status: 400 });
    }
    if (!validAddress(address)) {
      return NextResponse.json({ error: "Address must be a valid 20-byte hex value (0x...)." }, { status: 400 });
    }

    await fs.mkdir(sessionDir, { recursive: true });
    target = address;
  }

  const args = [...selected.args, target];
  const bin = process.env.VYPER_GUARD_BIN || "vyper-guard";
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      let stdoutBytes = 0;
      let stderrBytes = 0;
      let timedOut = false;
      const startedAt = Date.now();

      write({ type: "meta", command: `${bin} ${args.join(" ")}` });

      const child = spawn(bin, args, {
        cwd: sessionDir,
        env: process.env,
        shell: false,
      });

      const killTimer = setTimeout(() => {
        timedOut = true;
        child.kill("SIGKILL");
      }, TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => {
        const text = chunk.toString("utf8");
        stdoutBytes += Buffer.byteLength(text, "utf8");

        if (stdoutBytes > MAX_OUTPUT_BYTES) {
          write({ type: "stdout", chunk: "\n...[stdout truncated]" });
          child.kill("SIGKILL");
          return;
        }

        write({ type: "stdout", chunk: text });
      });

      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString("utf8");
        stderrBytes += Buffer.byteLength(text, "utf8");

        if (stderrBytes > MAX_OUTPUT_BYTES) {
          write({ type: "stderr", chunk: "\n...[stderr truncated]" });
          child.kill("SIGKILL");
          return;
        }

        write({ type: "stderr", chunk: text });
      });

      child.on("error", async () => {
        clearTimeout(killTimer);
        write({ type: "error", message: "Unable to execute vyper-guard in server runtime." });
        write({
          type: "done",
          exitCode: null,
          timedOut,
          durationMs: Date.now() - startedAt,
        });

        await fs.rm(sessionDir, { recursive: true, force: true });
        controller.close();
      });

      child.on("close", async (code) => {
        clearTimeout(killTimer);
        write({
          type: "done",
          exitCode: code,
          timedOut,
          durationMs: Date.now() - startedAt,
        });

        await fs.rm(sessionDir, { recursive: true, force: true });
        controller.close();
      });
    },
    async cancel() {
      await fs.rm(sessionDir, { recursive: true, force: true });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
