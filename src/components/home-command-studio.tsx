"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Copy, Sparkles, TerminalSquare } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { TerminalFrame } from "@/components/terminal-frame";
import { useToast } from "@/components/toast-provider";
import { resolveToast } from "@/lib/toast-rules";

const featuredCommands = [
  {
    command: "vyper-guard analyze contracts/Vault.vy",
    title: "Baseline scan",
    description: "Run deterministic checks and grade deployment readiness.",
    output: `Analyzing Vault.vy\n12 detectors loaded\ncritical: 2\nhigh: 3\nscore: 74 / 100\nrecommendation: Review required`,
  },
  {
    command: "vyper-guard fix contracts/Vault.vy --fix-dry-run --max-auto-fix-tier B",
    title: "Dry-run remediation",
    description: "Preview safe edits before any write operation.",
    output: `Dry run only\nmax tier: B\nproposed edits: 3\nfiles changed: 1\nwrite operations: 0\nplan exported: reports/fix-plan.json`,
  },
  {
    command: "vyper-guard stats contracts/Vault.vy --graph",
    title: "Artifact generation",
    description: "Generate charts and report bundles for audit records.",
    output: `Building report artifacts\nseverity histogram: ready\ncategory spread: ready\nscore model: ready\nhtml report: reports/vault-security.html`,
  },
  {
    command: "vyper-guard analyze-address 0xYourAddress --format json",
    title: "Post-deploy review",
    description: "Check deployed contracts using explorer-backed lookup.",
    output: `Resolving verified source\nnetwork: ethereum\ncontract: Vault\nrisk score: 79 / 100\nrecommendation: minor fixes before upgrade`,
  },
] as const;

export function HomeCommandStudio() {
  const [activeCommand, setActiveCommand] = useState<(typeof featuredCommands)[number]["command"]>(
    featuredCommands[0].command,
  );
  const { showToast } = useToast();
  const copySuccessToast = resolveToast("home", "copy_command");
  const copyFailedToast = resolveToast("home", "copy_failed");
  const openDocsToast = resolveToast("home", "open_docs");

  const active = useMemo(
    () => featuredCommands.find((item) => item.command === activeCommand) ?? featuredCommands[0],
    [activeCommand],
  );

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="surface-shell relative overflow-hidden rounded-[2rem] p-6 lg:p-8">
        <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-16 left-12 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="section-kicker">Command Studio</p>
            <h2 className="section-title mt-3">Understand the workflow in under a minute.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
              Choose a command path and preview realistic output. This gives non-developers a clear view of what the
              CLI does without opening a terminal.
            </p>

            <div className="mt-6 space-y-3">
              {featuredCommands.map((item, index) => {
                const isActive = item.command === activeCommand;
                return (
                  <button
                    type="button"
                    key={item.command}
                    onClick={() => setActiveCommand(item.command)}
                    className={`w-full rounded-[1.2rem] border p-4 text-left transition ${
                      isActive
                        ? "border-2 border-cyan-600 bg-cyan-50 text-slate-900 shadow-[4px_4px_0_#0f172a]"
                        : "border-2 border-slate-900 bg-white text-slate-900 hover:border-cyan-700"
                    }`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isActive ? "text-cyan-700" : "text-slate-500"}`}>
                      Path {index + 1}
                    </p>
                    <p className={`mt-2 font-mono text-xs sm:text-sm ${isActive ? "text-slate-900" : "text-slate-800"}`}>
                      {item.command}
                    </p>
                    <p className={`mt-2 text-sm ${isActive ? "text-slate-700" : "text-slate-600"}`}>{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <article className="surface-card brutal-card-hover rounded-[1.6rem] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Selected path</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{active.title}</p>
                </div>
                <InteractiveButton
                  onClick={async () => {
                    try {
                      if (!navigator.clipboard) {
                        showToast(copyFailedToast.message, copyFailedToast.tone);
                        return;
                      }

                      await navigator.clipboard.writeText(active.command);
                      showToast(copySuccessToast.message, copySuccessToast.tone);
                    } catch {
                      showToast(copyFailedToast.message, copyFailedToast.tone);
                    }
                  }}
                  className="text-xs text-slate-700"
                  tone="light"
                  size="sm"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </InteractiveButton>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.command}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <TerminalFrame title="command-preview" className="mt-0">
                    {active.output}
                  </TerminalFrame>
                </motion.div>
              </AnimatePresence>
            </article>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="surface-card brutal-card-hover rounded-[1.1rem] p-4">
                <div className="mb-3 inline-flex rounded-lg border-2 border-slate-900 bg-white p-2 text-slate-800">
                  <TerminalSquare className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">CLI-first</p>
                <p className="mt-1 text-sm text-slate-600">Predictable command outputs for local and CI pipelines.</p>
              </article>
              <article className="surface-card brutal-card-hover rounded-[1.1rem] p-4">
                <div className="mb-3 inline-flex rounded-lg border-2 border-slate-900 bg-white p-2 text-slate-800">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Safe by default</p>
                <p className="mt-1 text-sm text-slate-600">Dry-run paths help teams control remediation risk.</p>
              </article>
              <article className="surface-card brutal-card-hover rounded-[1.1rem] p-4">
                <div className="mb-3 inline-flex rounded-lg border-2 border-slate-900 bg-white p-2 text-slate-800">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Audit ready</p>
                <p className="mt-1 text-sm text-slate-600">Exportable reports keep review trails transparent.</p>
              </article>
            </div>

            <div className="surface-card-subtle rounded-[1.2rem] px-5 py-4 text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600">Need full reference?</p>
                  <p className="mt-1 text-sm text-slate-700">Open docs and follow the install-to-ci command journey.</p>
                </div>
                <InteractiveButton
                  href="/docs#quick-start"
                  tone="light"
                  size="md"
                  onClick={() => showToast(openDocsToast.message, openDocsToast.tone)}
                >
                  Open docs
                  <ArrowUpRight className="h-4 w-4" />
                </InteractiveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
