"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked, ExternalLink, GitFork, LayoutDashboard, Search, ShieldCheck, TerminalSquare } from "lucide-react";
import { projectFacts } from "@/lib/vyper-data";

type Action = {
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const actions = useMemo<Action[]>(
    () => [
      {
        label: "Open Experience",
        hint: "Home",
        keywords: "home experience landing",
        run: () => router.push("/"),
      },
      {
        label: "Open Documentation",
        hint: "Docs",
        keywords: "docs documentation guide",
        run: () => router.push("/docs"),
      },
      {
        label: "Open Detectors",
        hint: "Catalog",
        keywords: "detectors vulnerabilities security",
        run: () => router.push("/detectors"),
      },
      {
        label: "Open Live Metrics",
        hint: "Dashboard",
        keywords: "dashboard metrics charts",
        run: () => router.push("/dashboard"),
      },
      {
        label: "Open GitHub Repository",
        hint: "Source",
        keywords: "github repo source code",
        run: () => window.open(projectFacts.repository, "_blank", "noopener,noreferrer"),
      },
      {
        label: "Open DeepWiki Documentation",
        hint: "DeepWiki",
        keywords: "deepwiki docs wiki",
        run: () => window.open(projectFacts.docs, "_blank", "noopener,noreferrer"),
      },
      {
        label: "Open PyPI Package",
        hint: "PyPI",
        keywords: "pypi package install",
        run: () => window.open(projectFacts.pypi, "_blank", "noopener,noreferrer"),
      },
    ],
    [router],
  );

  const filtered = actions.filter((action) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      action.label.toLowerCase().includes(q) ||
      action.hint.toLowerCase().includes(q) ||
      action.keywords.includes(q)
    );
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCmdK) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const runAction = (action: Action) => {
    action.run();
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-800 shadow-[0_10px_25px_rgba(15,23,42,0.15)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        Quick Jump
        <span className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-start bg-slate-900/35 p-4 pt-24 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-white/70 bg-white p-3 shadow-[0_30px_80px_rgba(2,6,23,0.25)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Jump to docs, detectors, dashboard, github..."
              />
            </div>

            <div className="mt-3 max-h-80 space-y-1 overflow-y-auto pr-1">
              {filtered.map((action) => {
                const icon =
                  action.hint === "Home" ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : action.hint === "Docs" || action.hint === "DeepWiki" ? (
                    <BookMarked className="h-4 w-4" />
                  ) : action.hint === "Catalog" ? (
                    <TerminalSquare className="h-4 w-4" />
                  ) : action.hint === "Dashboard" ? (
                    <LayoutDashboard className="h-4 w-4" />
                  ) : action.hint === "Source" ? (
                    <GitFork className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  );

                return (
                  <button
                    type="button"
                    key={action.label}
                    onClick={() => runAction(action)}
                    className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-800">
                      {icon}
                      {action.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {action.hint}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-sm text-slate-500">No matches for “{query}”.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
