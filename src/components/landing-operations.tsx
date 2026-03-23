"use client";

import { motion } from "framer-motion";
import { ActivitySquare, Bot, Compass, GitBranchPlus, ShieldCheck, Wrench } from "lucide-react";
import { severityCounts } from "@/lib/vyper-data";

const phases = [
  {
    step: "Phase 01",
    title: "Source Risk Profiling",
    icon: Compass,
    detail: "Contract source is profiled with deterministic detector and semantic passes.",
  },
  {
    step: "Phase 02",
    title: "AI Contextualization",
    icon: Bot,
    detail: "Findings are ranked with exploitability context and reviewer-oriented narratives.",
  },
  {
    step: "Phase 03",
    title: "Remediation Planning",
    icon: Wrench,
    detail: "Fix plans are generated under tier constraints with dry-run-safe controls.",
  },
  {
    step: "Phase 04",
    title: "CI Policy Enforcement",
    icon: GitBranchPlus,
    detail: "Outputs are exported for severity gate checks and release-readiness decisions.",
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
    <section className="mx-auto mt-14 w-full max-w-7xl px-6 lg:px-10">
      <div className="rounded-3xl border border-white/75 bg-white/60 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operational Surface</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Audit lifecycle board</h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 sm:inline-flex">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            production controls
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {phases.map((phase, index) => (
            <motion.article
              key={phase.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-slate-50/80 p-4"
            >
              <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-2 text-cyan-200">
                <phase.icon className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{phase.step}</p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{phase.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{phase.detail}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
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
      </div>
    </section>
  );
}
