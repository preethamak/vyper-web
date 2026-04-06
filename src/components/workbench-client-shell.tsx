"use client";

import dynamic from "next/dynamic";

const InteractiveTerminalWorkbench = dynamic(
  () => import("@/components/interactive-terminal-workbench").then((m) => m.InteractiveTerminalWorkbench),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <div className="surface-shell rounded-[1.8rem] p-5 sm:p-7">
          <p className="section-kicker">Web CLI Workbench</p>
          <h1 className="section-title mt-2 text-3xl sm:text-4xl">Loading workbench...</h1>
          <div className="mt-6 h-64 animate-pulse rounded-2xl border-2 border-slate-900 bg-slate-100" />
        </div>
      </section>
    ),
  },
);

export function WorkbenchClientShell() {
  return <InteractiveTerminalWorkbench />;
}
