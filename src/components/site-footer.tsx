import Link from "next/link";
import { projectFacts } from "@/lib/vyper-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 text-sm text-slate-600 md:grid-cols-3 lg:px-10">
        <div>
          <p className="font-display text-lg text-slate-900">Vyper Guard</p>
          <p className="mt-2">Real-time vulnerability monitoring and static security analysis for Vyper contracts.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-800">Project</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/docs" className="hover:text-slate-900">Documentation</Link>
            </li>
            <li>
              <Link href="/detectors" className="hover:text-slate-900">Detectors</Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-slate-900">Metrics</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-800">Sources</p>
          <ul className="mt-2 space-y-1">
            <li><a className="hover:text-slate-900" href={projectFacts.repository} target="_blank" rel="noreferrer">GitHub Repository</a></li>
            <li><a className="hover:text-slate-900" href={projectFacts.docs} target="_blank" rel="noreferrer">DeepWiki Docs</a></li>
            <li><a className="hover:text-slate-900" href={projectFacts.pypi} target="_blank" rel="noreferrer">PyPI Package</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-gradient-to-b from-white/80 to-white/65">
        <div className="mx-auto w-full max-w-7xl px-6 py-5 text-center lg:px-10">
          <p className="text-sm font-medium text-slate-700">
            Made with <span aria-hidden="true" className="text-rose-500">❤</span> by <span className="font-semibold text-slate-900">AK</span>
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 pb-10 lg:px-10">
          <div className="rounded-3xl border border-white/80 bg-gradient-to-br from-teal-50/80 via-cyan-50/70 to-amber-50/75 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.1)]">
            <div className="grid gap-3 lg:grid-cols-3">
              <a
                href="https://github.com/preethamak"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-teal-300/80 bg-gradient-to-br from-teal-100 to-cyan-100 p-5 text-left shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-teal-800">GitHub</p>
                <p className="mt-2 text-base font-semibold text-slate-900">@preethamak</p>
                <p className="mt-1 text-sm text-slate-700">Code, releases, and project updates</p>
              </a>

              <a
                href="https://www.linkedin.com/in/preetham-ak/"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-cyan-300/80 bg-gradient-to-br from-cyan-100 to-sky-100 p-5 text-left shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-800">LinkedIn</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Preetham AK</p>
                <p className="mt-1 text-sm text-slate-700">Professional profile and experience</p>
              </a>

              <a
                href="https://x.com/preethamak17159"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-100 to-yellow-100 p-5 text-left shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-amber-800">X</p>
                <p className="mt-2 text-base font-semibold text-slate-900">@preethamak17159</p>
                <p className="mt-1 text-sm text-slate-700">Security notes and ecosystem updates</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
