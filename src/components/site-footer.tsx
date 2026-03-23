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
    </footer>
  );
}
