"use client";

import { useMemo, useState } from "react";
import { Loader2, Play, TerminalSquare } from "lucide-react";
import { CliTerminalOutput } from "@/components/cli-terminal-output";
import { CodeSyntaxEditor } from "@/components/code-syntax-editor";
import { InteractiveButton } from "@/components/interactive-button";
import { SarvamAssistPanel } from "@/components/sarvam-assist-panel";
import { workbenchCommands, type CommandInput, type PresetId } from "@/lib/workbench-commands";

type RunResponse = {
  command: string;
  preset: PresetId;
  durationMs: number;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  error?: string;
};

const sampleContract = `# @version ^0.3.10

owner: public(address)
balances: HashMap[address, uint256]

@external
def __init__():
    self.owner = msg.sender

@external
@payable
def deposit():
    self.balances[msg.sender] += msg.value

@external
def withdraw(amount: uint256):
    assert self.balances[msg.sender] >= amount, "insufficient"
    self.balances[msg.sender] -= amount
    send(msg.sender, amount)`;

function countMatches(text: string, regex: RegExp) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

type SeverityCounts = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
};

function parseSeverityCounts(text: string) {
  const patterns: Array<[keyof SeverityCounts, RegExp]> = [
    ["critical", /CRITICAL\s+(\d+)/i],
    ["high", /HIGH\s+(\d+)/i],
    ["medium", /MEDIUM\s+(\d+)/i],
    ["low", /LOW\s+(\d+)/i],
    ["info", /INFO\s+(\d+)/i],
  ];

  const counts: SeverityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  let matchedAny = false;

  for (const [key, regex] of patterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      const value = Number(match[1]);
      if (!Number.isNaN(value)) {
        counts[key] = value;
        matchedAny = true;
      }
    }
  }

  return matchedAny ? counts : null;
}

export function InteractiveTerminalWorkbench() {
  const [source, setSource] = useState(sampleContract);
  const [filename, setFilename] = useState("Vault.vy");
  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000");
  const [selectedId, setSelectedId] = useState(workbenchCommands[0]?.id ?? "analyze");
  const [result, setResult] = useState<RunResponse | null>(null);
  const [liveCommand, setLiveCommand] = useState<string | undefined>(undefined);
  const [liveStdout, setLiveStdout] = useState("");
  const [liveStderr, setLiveStderr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => workbenchCommands.find((command) => command.id === selectedId) ?? workbenchCommands[0],
    [selectedId],
  );

  const selectedInput: CommandInput = selected?.input ?? "none";
  const canRun = Boolean(selected?.runnable && selected?.preset);

  const combinedOutput = useMemo(() => {
    const stdoutText = result?.stdout ?? liveStdout;
    const stderrText = result?.stderr ?? liveStderr;
    const combined = [stdoutText, stderrText].filter(Boolean).join("\n");
    return combined.trim();
  }, [result, liveStdout, liveStderr]);

  const severityCounts = useMemo(() => {
    const parsed = parseSeverityCounts(combinedOutput);
    if (parsed) return parsed;
    const text = combinedOutput.toUpperCase();
    return {
      critical: countMatches(text, /\bCRITICAL\b/g),
      high: countMatches(text, /\bHIGH\b/g),
      medium: countMatches(text, /\bMEDIUM\b/g),
      low: countMatches(text, /\bLOW\b/g),
      info: countMatches(text, /\bINFO\b/g),
    };
  }, [combinedOutput]);

  const analysisSnapshot = useMemo(() => {
    if (!combinedOutput) return null;
    const commandText = liveCommand ?? result?.command ?? selected?.command;
    return {
      command: commandText,
      preset: result?.preset ?? selected?.preset,
      durationMs: result?.durationMs,
      exitCode: result?.exitCode ?? null,
      timedOut: result?.timedOut ?? false,
      severityCounts,
      outputExcerpt: combinedOutput.slice(0, 12_000),
    };
  }, [combinedOutput, liveCommand, result, selected, severityCounts]);

  const runDisabled =
    loading ||
    !canRun ||
    (selectedInput === "source" && source.trim().length === 0) ||
    (selectedInput === "address" && address.trim().length === 0);

  const runCommand = async () => {
    if (!selected?.preset || !selected.runnable) return;
    const selectedPreset = selected.preset as PresetId;

    setLoading(true);
    setError(null);
    setResult(null);
    setLiveCommand(undefined);
    setLiveStdout("");
    setLiveStderr("");

    try {
      const response = await fetch("/api/terminal-run/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, address, preset: selectedPreset, filename }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setResult(null);
        setError(payload.error ?? "Could not run the selected command.");
        return;
      }

      if (!response.body) {
        setError("No output stream available from execution service.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let commandText = selected.command;
      let stdoutBuffer = "";
      let stderrBuffer = "";
      let durationMs = 0;
      let exitCode: number | null = null;
      let timedOut = false;

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let event:
            | { type: "meta"; command: string }
            | { type: "stdout"; chunk: string }
            | { type: "stderr"; chunk: string }
            | { type: "done"; exitCode: number | null; timedOut: boolean; durationMs: number }
            | { type: "error"; message: string };

          try {
            event = JSON.parse(trimmed) as typeof event;
          } catch {
            continue;
          }

          if (event.type === "meta") {
            commandText = event.command;
            setLiveCommand(event.command);
          }

          if (event.type === "stdout") {
            stdoutBuffer += event.chunk;
            setLiveStdout((current) => `${current}${event.chunk}`);
          }

          if (event.type === "stderr") {
            stderrBuffer += event.chunk;
            setLiveStderr((current) => `${current}${event.chunk}`);
          }

          if (event.type === "error") {
            setError(event.message || "Execution failed.");
          }

          if (event.type === "done") {
            durationMs = event.durationMs;
            exitCode = event.exitCode;
            timedOut = event.timedOut;
          }
        }
      }

      setResult({
        command: commandText,
        preset: selectedPreset,
        durationMs,
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        exitCode,
        timedOut,
      });
    } catch {
      setResult(null);
      setError("Failed to reach execution endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-6 sm:pb-16 lg:px-10">
      <div className="surface-shell relative overflow-hidden rounded-[1.8rem] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-cyan-400/15 via-transparent to-amber-400/15" />

        <p className="section-kicker">Web CLI Workbench</p>
        <h1 className="section-title mt-2 text-3xl sm:text-4xl">Paste code, choose command, run CLI output</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
          This panel executes selected Vyper Guard commands on the server and renders CLI-style output with matching
          terminal colors.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Execution</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">Real CLI process</p>
          </div>
          <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Input modes</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">Source / Address</p>
          </div>
          <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Color parity</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">Code + terminal highlighting</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workbenchCommands.map((command) => {
            const active = command.id === selected?.id;
            return (
              <button
                type="button"
                key={command.id}
                onClick={() => setSelectedId(command.id)}
                className={`rounded-xl border-2 p-3 text-left transition ${
                  active
                    ? "border-cyan-600 bg-cyan-50 shadow-[4px_4px_0_#0f172a]"
                    : "border-slate-900 bg-white hover:border-cyan-700"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{command.label}</p>
                <p className="mt-1 break-all font-mono text-xs text-slate-800">{command.command}</p>
                <p className="mt-2 text-xs text-slate-600">{command.description}</p>
                <div className="mt-2 flex gap-1">
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {command.input}
                  </span>
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {command.runnable ? "runnable" : "reference"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <article className="surface-card min-w-0 rounded-[1.4rem] p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-900">Input</p>

          {selectedInput === "source" ? (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Filename</span>
                  <input
                    value={filename}
                    onChange={(event) => setFilename(event.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
                    placeholder="Vault.vy"
                  />
                </label>

                <InteractiveButton onClick={() => setSource(sampleContract)} tone="light" size="sm" className="h-[42px]">
                  Load sample
                </InteractiveButton>
              </div>

              <label className="mt-3 block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Vyper source editor</span>
                <CodeSyntaxEditor
                  value={source}
                  onChange={setSource}
                  language="vyper"
                  className="mt-2 h-64 sm:h-80"
                />
              </label>
            </>
          ) : selectedInput === "address" ? (
            <label className="mt-3 block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contract address</span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
                placeholder="0x..."
              />
            </label>
          ) : (
            <div className="mt-3 rounded-xl border-2 border-slate-900 bg-slate-100 px-3 py-2 text-sm text-slate-700">
              Reference command. Select a runnable command to execute.
            </div>
          )}
        </article>

        <article className="surface-card min-w-0 rounded-[1.4rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Execution</p>
            <button
              type="button"
              onClick={runCommand}
              disabled={runDisabled}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {loading ? "Running..." : canRun ? "Run command" : "Reference only"}
            </button>
          </div>

          <div className="mt-3 rounded-xl border-2 border-slate-900 bg-slate-950 px-3 py-2 font-mono text-xs text-cyan-200">
            {selected?.command}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Duration</p>
              <p className="text-sm font-semibold text-slate-800">{result ? `${result.durationMs} ms` : "-"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Exit code</p>
              <p className="text-sm font-semibold text-slate-800">{result ? String(result.exitCode) : "-"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Status</p>
              <p className="text-sm font-semibold text-slate-800">{result ? (result.timedOut ? "Timed out" : "Completed") : "Idle"}</p>
            </div>
          </div>

          {error ? (
            <p className="mt-3 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="mt-4">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <TerminalSquare className="h-3.5 w-3.5" />
              CLI terminal output
            </div>
            <CliTerminalOutput
              command={liveCommand ?? result?.command}
              stdout={loading ? liveStdout : (result?.stdout ?? liveStdout)}
              stderr={loading ? liveStderr : (result?.stderr ?? liveStderr)}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            The browser executes curated command presets only. No raw shell access is exposed.
          </p>
        </article>

        <SarvamAssistPanel analysis={analysisSnapshot} analysisText={combinedOutput} />
      </div>

      <div className="fixed inset-x-3 bottom-3 z-[55] md:hidden">
        <div className="rounded-2xl border-2 border-slate-900 bg-white/95 p-2 shadow-[4px_4px_0_#0f172a] backdrop-blur">
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{selected?.label ?? "Command"}</div>
          <button
            type="button"
            onClick={runCommand}
            disabled={runDisabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {loading ? "Running..." : canRun ? "Run command" : "Reference only"}
          </button>
        </div>
      </div>
    </section>
  );
}
