"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Bot, FileCode2, ShieldAlert, Sparkles } from "lucide-react";
import { projectFacts, severityCounts } from "@/lib/vyper-data";

const cards = [
  {
    icon: ShieldAlert,
    title: "Deterministic risk detection",
    desc: "Vyper-specific security detectors with semantic checks and predictable outputs.",
  },
  {
    icon: Bot,
    title: "AI-assisted prioritization",
    desc: "Contextual explanation and remediation narratives layered on deterministic results.",
  },
  {
    icon: FileCode2,
    title: "Controlled fix operations",
    desc: "Tier-gated remediation workflow with dry-run safety and exportable fix plans.",
  },
];

export function HeroExperience() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-12 lg:px-10 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-teal-300/35 to-cyan-400/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/35 to-orange-400/25 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/45 bg-white/60 p-8 shadow-[0_20px_60px_rgba(31,41,55,0.14)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-[36px] bg-gradient-to-bl from-amber-300/35 to-cyan-300/20" />
          <p className="font-display text-xs uppercase tracking-[0.28em] text-slate-500">Vyper Guard Platform</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
            Production security confidence for Vyper teams.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 lg:text-lg">
            Static analysis, AI-assisted review, and controlled remediation for local and CI workflows.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            <span className="rounded-full border border-slate-300 bg-white/85 px-3 py-1">Version {projectFacts.pypiVersion}</span>
            <span className="rounded-full border border-slate-300 bg-white/85 px-3 py-1">Python {projectFacts.python}</span>
            <span className="rounded-full border border-slate-300 bg-white/85 px-3 py-1">{projectFacts.license}</span>
            <span className="rounded-full border border-slate-300 bg-white/85 px-3 py-1">CLI / JSON / Markdown</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Open Dashboard
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Read Documentation
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {cards.map(({ icon: Icon, title, desc }, idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + idx * 0.08 }}
                className="rounded-2xl border border-white/70 bg-white/60 p-4"
              >
                <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-2 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
              </motion.article>
            ))}

            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-2xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50/80 to-teal-50/60 p-4 sm:col-span-2"
            >
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold text-slate-900">Detector coverage snapshot</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">current dataset</p>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-xl border border-red-200 bg-white/80 p-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-red-500">Critical</p>
                  <p className="text-lg font-bold text-slate-900">{severityCounts.CRITICAL}</p>
                </div>
                <div className="rounded-xl border border-orange-200 bg-white/80 p-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-orange-500">High</p>
                  <p className="text-lg font-bold text-slate-900">{severityCounts.HIGH}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white/80 p-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-amber-600">Medium</p>
                  <p className="text-lg font-bold text-slate-900">{severityCounts.MEDIUM}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-white/80 p-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-600">Low</p>
                  <p className="text-lg font-bold text-slate-900">{severityCounts.LOW}</p>
                </div>
              </div>
            </motion.article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
