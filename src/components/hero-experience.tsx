"use client";

import { motion } from "framer-motion";
import { Activity, Binary, Bot, FileCode2, ShieldAlert } from "lucide-react";
import { commands } from "@/lib/vyper-data";

const cards = [
  {
    icon: ShieldAlert,
    title: "Deterministic Security Core",
    desc: "Pattern + semantic checks tuned for Vyper contract risk detection.",
  },
  {
    icon: Bot,
    title: "AI-Assisted Triage",
    desc: "Prioritized fix paths with impact-driven narratives for reviewers.",
  },
  {
    icon: FileCode2,
    title: "Fix Workflow",
    desc: "Tier-based remediation with dry-run safety controls.",
  },
  {
    icon: Activity,
    title: "Explorer Intelligence",
    desc: "Analyze deployed addresses using metadata, ABI, and verified source.",
  },
];

export function HeroExperience() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-12 lg:px-10 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-teal-300/35 to-cyan-400/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/35 to-orange-400/25 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/45 bg-white/55 p-8 shadow-[0_20px_60px_rgba(31,41,55,0.14)] backdrop-blur-xl"
        >
          <p className="font-display text-xs uppercase tracking-[0.28em] text-slate-500">Smart Contract Security Interface</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
            Vyper audits, but in a control room—not a boring landing page.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            This site is designed as an operational surface for Vyper Guard: static analysis, AI review,
            remediation planning, detector intelligence, and release telemetry.
          </p>

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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="rounded-3xl border border-slate-200/80 bg-[#0f172a] p-6 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.4)]"
        >
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
            <Binary className="h-4 w-4" />
            Command stream
          </div>

          <div className="space-y-3 font-mono text-xs leading-relaxed sm:text-sm">
            {commands.slice(0, 5).map((item) => (
              <div key={item.command} className="rounded-xl border border-cyan-100/10 bg-slate-900/70 p-3">
                <p className="text-cyan-200">$ {item.command}</p>
                <p className="mt-1 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
