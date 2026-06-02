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

type CliCandidate = {
  bin: string;
  prefixArgs: string[];
  env?: NodeJS.ProcessEnv;
};

const presetMap: Record<PresetId, { args: string[]; input: InputKind }> = {
  analyze: { args: ["analyze"], input: "source" },
  "analyze-ai": { args: ["analyze", "--ai-triage", "--ai-triage-mode", "llm", "--allow-ai-fallback"], input: "source" },
  "ast-json": { args: ["ast", "--format", "json"], input: "source" },
  "flow-mermaid": { args: ["flow", "--format", "mermaid"], input: "source" },
  "fix-dry-run": { args: ["analyze", "--fix-dry-run", "--max-auto-fix-tier", "B"], input: "source" },
  "stats-graph": { args: ["stats", "--graph"], input: "source" },
  "analyze-address": { args: ["analyze-address", "--format", "json"], input: "address" },
  explorer: { args: ["explorer", "--format", "json"], input: "address" },
};

function validAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function getCliCandidates() {
  const envBin = process.env.VYPER_GUARD_BIN?.trim();
  const candidates: CliCandidate[] = [];

  if (envBin) {
    candidates.push({ bin: envBin, prefixArgs: [] });
  }

  candidates.push({ bin: "vyper-guard", prefixArgs: [] });

  return candidates.filter((candidate, index, all) => {
    return all.findIndex((item) => item.bin === candidate.bin && item.prefixArgs.join("|") === candidate.prefixArgs.join("|")) === index;
  });
}

async function runSetupCommand(
  bin: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
  timeoutMs: number,
) {
  return await new Promise<{
    exitCode: number | null;
    stdout: string;
    stderr: string;
    errorCode?: string;
    errorMessage?: string;
  }>((resolve) => {
    let stdout = "";
    let stderr = "";

    const child = spawn(bin, args, {
      cwd,
      env,
      shell: false,
    });

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      resolve({
        exitCode: null,
        stdout,
        stderr,
        errorCode: error.code,
        errorMessage: error.message,
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ exitCode: code, stdout, stderr });
    });
  });
}

async function bootstrapVyperGuard(write?: (payload: Record<string, unknown>) => void) {
  if (process.env.VYPER_GUARD_DISABLE_BOOTSTRAP === "1") return null;

  const cacheDir = path.join(os.tmpdir(), "vyper-guard-runtime");
  const sitePackages = path.join(cacheDir, "site-packages");
  const pythonBins = ["python3", "python"];

  await fs.mkdir(sitePackages, { recursive: true });

  for (const pythonBin of pythonBins) {
    const importGlobal = await runSetupCommand(
      pythonBin,
      ["-c", "import vyper_guard"],
      cacheDir,
      process.env,
      8_000,
    );

    if (importGlobal.exitCode === 0) {
      write?.({ type: "meta", command: `${pythonBin} -m vyper_guard` });
      return { bin: pythonBin, prefixArgs: ["-m", "vyper_guard"] } satisfies CliCandidate;
    }

    const pythonPath = `${sitePackages}${path.delimiter}${process.env.PYTHONPATH ?? ""}`;
    const importCached = await runSetupCommand(
      pythonBin,
      ["-c", "import vyper_guard"],
      cacheDir,
      { ...process.env, PYTHONPATH: pythonPath },
      8_000,
    );

    if (importCached.exitCode === 0) {
      write?.({ type: "meta", command: `${pythonBin} -m vyper_guard (cached)` });
      return {
        bin: pythonBin,
        prefixArgs: ["-m", "vyper_guard"],
        env: { ...process.env, PYTHONPATH: pythonPath },
      } satisfies CliCandidate;
    }

    write?.({ type: "stderr", chunk: `\n[bootstrap] Installing vyper-guard with ${pythonBin}...\n` });

    const install = await runSetupCommand(
      pythonBin,
      [
        "-m",
        "pip",
        "install",
        "--disable-pip-version-check",
        "--no-input",
        "--target",
        sitePackages,
        "vyper-guard",
      ],
      cacheDir,
      process.env,
      180_000,
    );

    if (install.stdout) write?.({ type: "stdout", chunk: install.stdout });
    if (install.stderr) write?.({ type: "stderr", chunk: install.stderr });

    if (install.exitCode !== 0) {
      continue;
    }

    const verify = await runSetupCommand(
      pythonBin,
      ["-c", "import vyper_guard"],
      cacheDir,
      { ...process.env, PYTHONPATH: pythonPath },
      8_000,
    );

    if (verify.exitCode === 0) {
      write?.({ type: "meta", command: `${pythonBin} -m vyper_guard (bootstrapped)` });
      return {
        bin: pythonBin,
        prefixArgs: ["-m", "vyper_guard"],
        env: { ...process.env, PYTHONPATH: pythonPath },
      } satisfies CliCandidate;
    }
  }

  return null;
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
  const candidates = getCliCandidates();
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

      const attemptedBins: string[] = [];
      let bootstrapTried = false;

      const launch = async (index: number) => {
        if (index >= candidates.length) {
          if (!bootstrapTried) {
            bootstrapTried = true;
            const bootstrapped = await bootstrapVyperGuard(write);
            if (bootstrapped) {
              candidates.push(bootstrapped);
              await launch(index);
              return;
            }
          }

          write({
            type: "error",
            message: `Unable to execute vyper-guard in server runtime. Tried: ${attemptedBins.join(", ")}. Set VYPER_GUARD_BIN to an absolute executable path.`,
          });
          write({
            type: "done",
            exitCode: null,
            timedOut,
            durationMs: Date.now() - startedAt,
          });
          fs.rm(sessionDir, { recursive: true, force: true }).finally(() => controller.close());
          return;
        }

        const candidate = candidates[index];
        const commandArgs = [...candidate.prefixArgs, ...args];
        attemptedBins.push(candidate.bin);

        write({ type: "meta", command: `${candidate.bin} ${commandArgs.join(" ")}` });

        const child = spawn(candidate.bin, commandArgs, {
          cwd: sessionDir,
          env: candidate.env ?? process.env,
          shell: false,
        });
        let ignoreClose = false;

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

        child.on("error", (error: NodeJS.ErrnoException) => {
          clearTimeout(killTimer);

          if (error.code === "ENOENT") {
            ignoreClose = true;
            void launch(index + 1);
            return;
          }

          write({
            type: "error",
            message: `Unable to execute vyper-guard in server runtime (${error.message}).`,
          });
          write({
            type: "done",
            exitCode: null,
            timedOut,
            durationMs: Date.now() - startedAt,
          });

          fs.rm(sessionDir, { recursive: true, force: true }).finally(() => controller.close());
        });

        child.on("close", (code) => {
          if (ignoreClose) return;
          clearTimeout(killTimer);
          write({
            type: "done",
            exitCode: code,
            timedOut,
            durationMs: Date.now() - startedAt,
          });

          fs.rm(sessionDir, { recursive: true, force: true }).finally(() => controller.close());
        });
      };

      void launch(0);
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
