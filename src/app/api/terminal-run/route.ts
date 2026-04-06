import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
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

async function runCli(
  bin: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
) {
  const startedAt = Date.now();

  return await new Promise<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
    timedOut: boolean;
    durationMs: number;
  }>((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const child = spawn(bin, args, {
      cwd,
      env: process.env,
      shell: false,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
      if (Buffer.byteLength(stdout, "utf8") > MAX_OUTPUT_BYTES) {
        stdout = `${stdout.slice(0, MAX_OUTPUT_BYTES)}\n...[output truncated]`;
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
      if (Buffer.byteLength(stderr, "utf8") > MAX_OUTPUT_BYTES) {
        stderr = `${stderr.slice(0, MAX_OUTPUT_BYTES)}\n...[output truncated]`;
      }
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exitCode: code,
        timedOut,
        durationMs: Date.now() - startedAt,
      });
    });

    child.on("error", () => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: `${stderr}\nUnable to execute vyper-guard. Ensure the CLI is installed and available to the server runtime.`.trim(),
        exitCode: null,
        timedOut,
        durationMs: Date.now() - startedAt,
      });
    });
  });
}

export async function GET() {
  return NextResponse.json({
    timeoutMs: TIMEOUT_MS,
    maxSourceBytes: MAX_SOURCE_BYTES,
    maxOutputBytes: MAX_OUTPUT_BYTES,
  });
}

export async function POST(request: Request) {
  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
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

  try {
    await fs.mkdir(sessionDir, { recursive: true });

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
      target = address;
    }

    const args = [...selected.args, target];
    const bin = process.env.VYPER_GUARD_BIN || "vyper-guard";
    const result = await runCli(bin, args, sessionDir, TIMEOUT_MS);

    return NextResponse.json({
      preset,
      command: `${bin} ${args.join(" ")}`,
      ...result,
      error: result.timedOut ? "Command timed out." : undefined,
    });
  } finally {
    await fs.rm(sessionDir, { recursive: true, force: true });
  }
}
