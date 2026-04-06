"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileCode2, ShieldAlert, Sparkles, TerminalSquare } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { TerminalFrame } from "@/components/terminal-frame";
import { projectFacts, severityCounts } from "@/lib/vyper-data";

const cards = [
  {
    icon: ShieldAlert,
    title: "Deterministic risk detection",
    desc: "Vyper-specific detector coverage with predictable severity outputs.",
  },
  {
    icon: TerminalSquare,
    title: "CLI-native workflows",
    desc: "From local scan to CI gate using stable command contracts.",
  },
  {
    icon: FileCode2,
    title: "Controlled fix operations",
    desc: "Tier-gated remediation workflow with dry-run safety and exportable fix plans.",
  },
];

export function HeroExperience() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-10 lg:px-10 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="surface-shell relative overflow-hidden rounded-[2rem] p-7 lg:p-9"
        >
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-cyan-400/12 via-transparent to-amber-400/12" />

          <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="section-kicker">Vyper Guard Platform</p>
              <h1 className="section-title mt-4 text-4xl leading-[0.95] lg:text-7xl">
                Contract security that feels operational.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 lg:text-lg">
                Analyze, triage, and remediate Vyper contracts with a workflow that remains transparent from local
                development to release governance.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-slate-700">Version {projectFacts.pypiVersion}</span>
                <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-slate-700">Python {projectFacts.python}</span>
                <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-slate-700">{projectFacts.license}</span>
                <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-slate-700">CLI / JSON / Markdown</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <InteractiveButton
                  href="/docs#quick-start"
                  tone="accent"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Quick start
                  <Sparkles className="h-4 w-4" />
                </InteractiveButton>
                <InteractiveButton
                  href="/dashboard"
                  tone="dark"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Open dashboard
                  <ArrowUpRight className="h-4 w-4" />
                </InteractiveButton>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {cards.map(({ icon: Icon, title, desc }, idx) => (
                  <motion.article
                    key={title}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                    className="surface-card brutal-card-hover rounded-[1.2rem] p-4"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-2 text-cyan-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <article className="surface-card brutal-card-hover rounded-[1.4rem] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Live workflow preview</p>
                  <span className="rounded-full border-2 border-slate-900 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    command mode
                  </span>
                </div>
                <TerminalFrame title="vault-audit" className="mt-0">
                  {`vyper-guard analyze contracts/Vault.vy\ndetectors: 12 loaded\ncritical: ${severityCounts.CRITICAL}\nhigh: ${severityCounts.HIGH}\nscore: 74 / 100\nrecommendation: Review required\n\nvyper-guard fix contracts/Vault.vy --fix-dry-run --max-auto-fix-tier B\nproposed edits: 3\nwrite operations: 0`}
                </TerminalFrame>
              </article>

              <article className="surface-card brutal-card-hover rounded-[1.4rem] p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <p className="font-semibold text-slate-900">Detector coverage snapshot</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">current dataset</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl border border-red-200 bg-white p-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-red-500">Critical</p>
                    <p className="text-lg font-bold text-slate-900">{severityCounts.CRITICAL}</p>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-white p-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-orange-500">High</p>
                    <p className="text-lg font-bold text-slate-900">{severityCounts.HIGH}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-white p-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-amber-600">Medium</p>
                    <p className="text-lg font-bold text-slate-900">{severityCounts.MEDIUM}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-2">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-600">Low</p>
                    <p className="text-lg font-bold text-slate-900">{severityCounts.LOW}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
