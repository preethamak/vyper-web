"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { TerminalFrame } from "@/components/terminal-frame";
import { severityCounts } from "@/lib/vyper-data";

const severityRows = [
  { label: "Critical", value: severityCounts.CRITICAL, color: "bg-red-500" },
  { label: "High", value: severityCounts.HIGH, color: "bg-orange-500" },
  { label: "Medium", value: severityCounts.MEDIUM, color: "bg-amber-500" },
  { label: "Low", value: severityCounts.LOW, color: "bg-emerald-500" },
];

const maxSeverity = Math.max(...severityRows.map((row) => row.value), 1);
const totalDetectors = severityRows.reduce((sum, row) => sum + row.value, 0);

export function HeroExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [mascotFailed, setMascotFailed] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 lg:px-10 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="surface-shell relative overflow-hidden rounded-[2rem] p-5 sm:p-7 lg:p-9"
        >
          <div className="relative grid gap-5 lg:grid-cols-[1.03fr_0.97fr] lg:gap-6">
            <div>
              <p className="section-kicker">Vyper Guard Platform</p>
              <h1 className="section-title font-hero mt-3 text-4xl leading-[0.94] sm:text-5xl lg:mt-4 lg:text-7xl">
                Contract security that feels operational.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 lg:mt-5 lg:text-lg">
                Trusted Vyper security signals from local development to production gates — fast to run,
                easy to review, and strict where it matters.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 lg:mt-6">
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

              <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:mt-6">
                <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Detectors</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{totalDetectors} active checks</p>
                </div>
                <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Highest risk</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{severityCounts.CRITICAL} critical findings</p>
                </div>
                <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Posture</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">Review required</p>
                </div>
              </div>
            </div>

            <motion.article
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="group surface-card brutal-card-hover flex items-center self-start rounded-[1.5rem] p-3 sm:p-4"
            >
              <div className="w-full overflow-hidden rounded-2xl border-2 border-slate-900 bg-white transition-transform duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1">
                <p className="border-b-2 border-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Mr. Vyper
                </p>
                <Image
                  src={mascotFailed ? "/branding/vyper-mascot.svg" : "/branding/vyper-mascot.png"}
                  alt="Vyper mascot"
                  width={900}
                  height={860}
                  priority
                  className="h-auto w-full object-contain"
                  onError={() => setMascotFailed(true)}
                />
              </div>
            </motion.article>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.06fr_0.94fr]">
            <article className="surface-card brutal-card-hover h-full rounded-[1.4rem] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Live workflow preview</p>
              </div>
              <TerminalFrame title="vault-audit" className="mt-0">
                {`vyper-guard analyze contracts/Vault.vy
# detectors loaded: 12
# critical: ${severityCounts.CRITICAL}
# high: ${severityCounts.HIGH}
# score: 74 / 100
# recommendation: Review required

vyper-guard fix contracts/Vault.vy --fix-dry-run --max-auto-fix-tier B
# proposed edits: 3
# write operations: 0`}
              </TerminalFrame>
            </article>

            <article className="surface-card brutal-card-hover flex h-full flex-col rounded-[1.4rem] p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <p className="font-semibold text-slate-900">Detector coverage snapshot</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">current dataset</p>
              </div>
              <div className="space-y-3">
                {severityRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${row.color}`}
                        style={{ width: `${Math.max(8, (row.value / maxSeverity) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t-2 border-slate-900/10 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
                    <p className="text-sm font-semibold text-slate-900">{totalDetectors} findings</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Gate</p>
                    <p className="text-sm font-semibold text-slate-900">Manual review</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
