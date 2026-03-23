"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, ExternalLink, GitFork, Package, ShieldCheck, Sparkles } from "lucide-react";
import { navLinks, projectFacts } from "@/lib/vyper-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
        <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 font-semibold text-white">v{projectFacts.pypiVersion}</span>
            <span className="hidden rounded-full border border-slate-300 bg-white px-2 py-0.5 md:inline-flex">Python {projectFacts.python}</span>
            <span className="hidden rounded-full border border-slate-300 bg-white px-2 py-0.5 md:inline-flex">{projectFacts.license}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={projectFacts.repository}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              aria-label="GitHub"
            >
              <GitFork className="h-4 w-4" />
            </a>
            <a
              href={projectFacts.docs}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              aria-label="DeepWiki"
            >
              <BookMarked className="h-4 w-4" />
            </a>
            <a
              href={projectFacts.pypi}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              aria-label="PyPI"
            >
              <Package className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-6 -top-6 h-10 rounded-full bg-gradient-to-r from-teal-300/35 via-cyan-300/35 to-amber-300/35 blur-xl" />
          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
            <Link href="/" className="group flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl border border-white/40 bg-gradient-to-br from-teal-300/70 via-cyan-200/70 to-amber-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition group-hover:rotate-3">
                <ShieldCheck className="h-5 w-5 text-slate-800" />
              </div>
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-slate-500">Vyper-native security</p>
                <p className="font-display text-xl leading-none text-slate-900">Vyper Guard</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1 md:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-white hover:text-slate-900",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/docs#quick-start"
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Sparkles className="h-4 w-4" />
                Launch Docs
              </Link>
              <a
                href={projectFacts.docs}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 lg:inline-flex"
              >
                API
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-teal-400 via-cyan-500 to-amber-400"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
