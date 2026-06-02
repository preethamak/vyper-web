"use client";

import { motion } from "framer-motion";
import { ActivitySquare, Compass, GitBranchPlus, ShieldCheck, TerminalSquare, Wrench } from "lucide-react";
import { severityCounts } from "@/lib/vyper-data";

const phases = [
  {
    step: "Phase 01",
    title: "Source Risk Profiling",
    icon: Compass,
    detail: "A single .vy contract is parsed, checked, and scored through deterministic detector and semantic passes.",
  },
  {
    step: "Phase 02",
    title: "Signal Prioritization (Optional AI)",
    icon: TerminalSquare,
    detail: "Findings are ranked by severity, with optional advisory AI triage metadata that never overrides verdicts.",
  },
  {
    step: "Phase 03",
    title: "Remediation Planning",
    icon: Wrench,
    detail: "Fix plans run under tier constraints with dry-run mode, explicit write prompts, and report artifacts.",
  },
  {
    step: "Phase 04",
    title: "CI + Runtime Operations",
    icon: GitBranchPlus,
    detail: "JSON/Markdown artifacts drive CI policy gates, while explorer/address and monitor flows support deployed contracts.",
  },
];

const severityRows = [
  { label: "Critical", value: severityCounts.CRITICAL, color: "bg-red-500" },
  { label: "High", value: severityCounts.HIGH, color: "bg-orange-500" },
  { label: "Medium", value: severityCounts.MEDIUM, color: "bg-amber-500" },
  { label: "Low", value: severityCounts.LOW, color: "bg-emerald-500" },
];

const maxSeverity = Math.max(...severityRows.map((item) => item.value), 1);

export function LandingOperations() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="grid gap-4 lg:grid-cols-[0.38fr_0.62fr]">
        <aside className="surface-card brutal-card-hover rounded-[1.6rem] p-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-[2px_2px_0_#1f2937]">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
            operational surface
          </div>

          <h2 className="section-title mt-4 text-3xl">Audit lifecycle board</h2>
          <p className="mt-3 text-slate-600">
            A structured release path from first scan to CI policy checks, designed for predictable team adoption.
          </p>

          <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#1f2937]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <ActivitySquare className="h-4 w-4 text-cyan-700" />
              Severity posture snapshot
            </div>
            <div className="space-y-3">
              {severityRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200/80">
                    <div
                      className={`h-2 rounded-full ${row.color}`}
                      style={{ width: `${Math.max(8, (row.value / maxSeverity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="surface-shell rounded-[1.6rem] p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workflow timeline</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">From scan to release gate</h3>
            </div>
          </div>

          <div className="space-y-3">
            {phases.map((phase, index) => (
              <motion.article
                key={phase.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                className="surface-card brutal-card-hover rounded-[1.2rem] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{phase.step}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{phase.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{phase.detail}</p>
                  </div>
                  <div className="inline-flex rounded-xl border-2 border-slate-900 bg-white p-2 text-slate-800">
                    <phase.icon className="h-4 w-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
