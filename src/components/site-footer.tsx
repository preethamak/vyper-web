import Link from "next/link";
import { projectFacts } from "@/lib/vyper-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-slate-900 bg-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-3 lg:px-10">
        <div className="surface-card rounded-xl p-5">
          <p className="font-display text-lg text-slate-900">Vyper Guard</p>
          <p className="mt-2">Real-time vulnerability monitoring and static security analysis for Vyper contracts.</p>
        </div>

        <div className="surface-card rounded-xl p-5">
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

        <div className="surface-card rounded-xl p-5">
          <p className="font-semibold text-slate-800">Sources</p>
          <ul className="mt-2 space-y-1">
            <li><a className="hover:text-slate-900" href={projectFacts.repository} target="_blank" rel="noreferrer">GitHub Repository</a></li>
            <li><a className="hover:text-slate-900" href={projectFacts.docs} target="_blank" rel="noreferrer">DeepWiki Docs</a></li>
            <li><a className="hover:text-slate-900" href={projectFacts.pypi} target="_blank" rel="noreferrer">PyPI Package</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-slate-900 bg-slate-200/60">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-10">
          <p className="text-sm font-medium text-slate-700">
            Made with <span aria-hidden="true" className="text-rose-500">❤</span> by <span className="font-semibold text-slate-900">AK</span>
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <div className="surface-card-subtle rounded-xl p-4">
            <div className="grid gap-3 lg:grid-cols-3">
              <a
                href="https://github.com/preethamak"
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border-2 border-slate-900 bg-white p-5 text-left shadow-[3px_3px_0_#1f2937] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-700">GitHub</p>
                <p className="mt-2 text-base font-semibold text-slate-900">@preethamak</p>
                <p className="mt-1 text-sm text-slate-700">Code, releases, and project updates</p>
              </a>

              <a
                href="https://www.linkedin.com/in/preetham-ak/"
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border-2 border-slate-900 bg-white p-5 text-left shadow-[3px_3px_0_#1f2937] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-700">LinkedIn</p>
                <p className="mt-2 text-base font-semibold text-slate-900">Preetham AK</p>
                <p className="mt-1 text-sm text-slate-700">Professional profile and experience</p>
              </a>

              <a
                href="https://x.com/preethamak17159"
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border-2 border-slate-900 bg-white p-5 text-left shadow-[3px_3px_0_#1f2937] transition hover:-translate-y-0.5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-700">X</p>
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
