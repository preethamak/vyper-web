"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, ExternalLink, GitFork, Menu, Package, ShieldCheck, Sparkles, X } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { navLinks, projectFacts } from "@/lib/vyper-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [mascotBadgeFailed, setMascotBadgeFailed] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="surface-shell relative overflow-hidden rounded-2xl px-4 py-3">
          <div className="pointer-events-none absolute inset-x-6 -top-6 h-10 rounded-full bg-gradient-to-r from-cyan-300/20 via-cyan-300/30 to-amber-300/20 blur-xl" />
          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
            <Link href="/" className="group flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="grid h-10 w-10 place-content-center rounded-xl border-2 border-slate-900 bg-white shadow-[3px_3px_0_#0f172a] transition group-hover:rotate-3">
                {logoFailed ? (
                  <ShieldCheck className="h-5 w-5 text-slate-900" />
                ) : (
                  <Image
                    src="/branding/vyper-logo.svg"
                    alt="Vyper Guard logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                    onError={() => setLogoFailed(true)}
                  />
                )}
              </div>
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-slate-500">Vyper-native security</p>
                <p className="font-display text-xl leading-none text-slate-900">Vyper Guard</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border-2 border-slate-900 bg-white p-1 md:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              {!mascotBadgeFailed ? (
                <span className="hidden h-9 w-9 overflow-hidden rounded-full border-2 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] sm:inline-flex">
                  <Image
                    src="/branding/vyper-mascot.png"
                    alt="Vyper mascot"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    onError={() => setMascotBadgeFailed(true)}
                  />
                </span>
              ) : null}
              <span className="hidden rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white xl:inline-flex">v{projectFacts.pypiVersion}</span>
              <a
                href={projectFacts.repository}
                target="_blank"
                rel="noreferrer"
                className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 lg:inline-flex"
                aria-label="GitHub"
              >
                <GitFork className="h-4 w-4" />
              </a>
              <a
                href={projectFacts.docs}
                target="_blank"
                rel="noreferrer"
                className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 lg:inline-flex"
                aria-label="DeepWiki"
              >
                <BookMarked className="h-4 w-4" />
              </a>
              <a
                href={projectFacts.pypi}
                target="_blank"
                rel="noreferrer"
                className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 lg:inline-flex"
                aria-label="PyPI"
              >
                <Package className="h-4 w-4" />
              </a>
              <div className="hidden sm:block">
                <InteractiveButton href="/docs#quick-start" tone="light" size="sm" className="text-sm">
                  <Sparkles className="h-4 w-4" />
                  Launch Docs
                </InteractiveButton>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-800 transition hover:bg-slate-100 md:hidden"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <a
                href={projectFacts.docs}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1 rounded-full border-2 border-slate-900 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 lg:inline-flex"
              >
                API
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-3 rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-[4px_4px_0_#0f172a] md:hidden">
            <nav className="grid gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold",
                      active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-teal-400 via-cyan-500 to-amber-400"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
