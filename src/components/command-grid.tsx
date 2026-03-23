import { TerminalSquare } from "lucide-react";
import { commands } from "@/lib/vyper-data";

export function CommandGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">High-utility command paths</h2>
        <span className="rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
          CLI workflows
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {commands.map((item) => (
          <article
            key={item.command}
            className="rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <div className="mb-3 inline-flex rounded-lg bg-slate-900 p-2 text-cyan-200">
              <TerminalSquare className="h-4 w-4" />
            </div>
            <p className="font-mono text-xs text-slate-800 sm:text-sm">$ {item.command}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
