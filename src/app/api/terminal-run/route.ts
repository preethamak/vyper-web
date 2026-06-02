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

async function bootstrapVyperGuard() {
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
      return {
        bin: pythonBin,
        prefixArgs: ["-m", "vyper_guard"],
        env: { ...process.env, PYTHONPATH: pythonPath },
      } satisfies CliCandidate;
    }

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

    if (install.exitCode !== 0) continue;

    const verify = await runSetupCommand(
      pythonBin,
      ["-c", "import vyper_guard"],
      cacheDir,
      { ...process.env, PYTHONPATH: pythonPath },
      8_000,
    );

    if (verify.exitCode === 0) {
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

async function runCli(
  candidates: CliCandidate[],
  args: string[],
  cwd: string,
  timeoutMs: number,
) {
  const startedAt = Date.now();
  const attemptedBins: string[] = [];

  return await new Promise<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
    timedOut: boolean;
    durationMs: number;
    command: string;
  }>((resolve) => {
    let bootstrapTried = false;

    const launch = async (index: number) => {
      if (index >= candidates.length) {
        if (!bootstrapTried) {
          bootstrapTried = true;
          const bootstrapped = await bootstrapVyperGuard();
          if (bootstrapped) {
            candidates.push(bootstrapped);
            await launch(index);
            return;
          }
        }

        resolve({
          stdout: "",
          stderr: `Unable to execute vyper-guard. Tried: ${attemptedBins.join(", ")}. Set VYPER_GUARD_BIN to an absolute executable path.`,
          exitCode: null,
          timedOut: false,
          durationMs: Date.now() - startedAt,
          command: "",
        });
        return;
      }

      const candidate = candidates[index];
      const commandArgs = [...candidate.prefixArgs, ...args];
      attemptedBins.push(candidate.bin);

      let stdout = "";
      let stderr = "";
      let timedOut = false;
      let ignoreClose = false;

      const child = spawn(candidate.bin, commandArgs, {
        cwd,
        env: candidate.env ?? process.env,
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
        if (ignoreClose) return;
        clearTimeout(timer);
        resolve({
          stdout,
          stderr,
          exitCode: code,
          timedOut,
          durationMs: Date.now() - startedAt,
          command: `${candidate.bin} ${commandArgs.join(" ")}`,
        });
      });

      child.on("error", (error: NodeJS.ErrnoException) => {
        clearTimeout(timer);

        if (error.code === "ENOENT") {
          ignoreClose = true;
          void launch(index + 1);
          return;
        }

        resolve({
          stdout,
          stderr: `${stderr}\nUnable to execute vyper-guard (${error.message}).`.trim(),
          exitCode: null,
          timedOut,
          durationMs: Date.now() - startedAt,
          command: `${candidate.bin} ${commandArgs.join(" ")}`,
        });
      });
    };

    void launch(0);
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
    const result = await runCli(getCliCandidates(), args, sessionDir, TIMEOUT_MS);

    return NextResponse.json({
      preset,
      ...result,
      error: result.timedOut ? "Command timed out." : undefined,
    });
  } finally {
    await fs.rm(sessionDir, { recursive: true, force: true });
  }
}
