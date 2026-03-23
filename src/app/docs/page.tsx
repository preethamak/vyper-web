import Link from "next/link";
import { commands, detectors, gradeScale, projectFacts, severityPenalty } from "@/lib/vyper-data";

const docsNav = [
  { id: "quick-start", label: "Quick Start" },
  { id: "analysis-lifecycle", label: "Analysis Lifecycle" },
  { id: "command-reference", label: "Command Reference" },
  { id: "ai-assisted", label: "AI-Assisted Audit" },
  { id: "remediation", label: "Remediation / Fix" },
  { id: "explorer", label: "Explorer + Address Analysis" },
  { id: "scoring", label: "Scoring & Grades" },
  { id: "ci-cd", label: "CI/CD" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 lg:px-10">
      <section className="rounded-3xl border border-white/75 bg-white/70 p-8 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Documentation • Vyper Guard</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Technical documentation and operational usage</h1>
        <p className="mt-4 max-w-4xl text-slate-700">
          Vyper Guard is a Vyper-native security CLI combining deterministic static analysis,
          semantic context, AI-assisted explanations, safe remediation workflows, and deployed
          contract intelligence.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={projectFacts.repository} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">GitHub Repository</a>
          <a href={projectFacts.docs} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">DeepWiki Documentation</a>
          <a href={projectFacts.pypi} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">PyPI Package</a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="rounded-2xl border border-white/70 bg-white/65 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">On this page</p>
          <ul className="mt-3 space-y-2 text-sm">
            {docsNav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-slate-700 hover:text-slate-900 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <p className="font-semibold text-slate-900">Project facts</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>Version: {projectFacts.pypiVersion}</li>
              <li>Released: {new Date(projectFacts.releaseDate).toDateString()}</li>
              <li>Python: {projectFacts.python}</li>
              <li>License: {projectFacts.license}</li>
              <li>Detectors: {detectors.length}</li>
            </ul>
          </div>
        </aside>

        <div className="space-y-4">
          <article id="quick-start" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Quick Start</h2>
            <p className="mt-2 text-sm text-slate-700">Minimal path to first scan, AI triage, flow view, and graph exports.</p>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-cyan-100 sm:text-sm"><code>{`pip install vyper-guard
vyper-guard analyze contracts/Vault.vy
vyper-guard analyze contracts/Vault.vy --ai
vyper-guard ast contracts/Vault.vy --format json
vyper-guard flow contracts/Vault.vy --format mermaid
vyper-guard stats contracts/Vault.vy --graph`}</code></pre>
          </article>

          <article id="analysis-lifecycle" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Analysis lifecycle</h2>
            <ol className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">1) Input validation:</span> verifies source exists and rejects empty/comment-only files.</li>
              <li><span className="font-semibold text-slate-900">2) Deterministic analysis:</span> detector patterns + AST/semantic contextual checks.</li>
              <li><span className="font-semibold text-slate-900">3) Risk synthesis:</span> severity distribution, score, and deploy recommendation.</li>
              <li><span className="font-semibold text-slate-900">4) Report rendering:</span> CLI / JSON / Markdown outputs for local and CI usage.</li>
            </ol>
          </article>

          <article id="command-reference" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Command reference</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Command</th>
                    <th className="px-4 py-3">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {commands.map((entry) => (
                    <tr key={entry.command} className="border-t border-slate-200/80">
                      <td className="px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{entry.command}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="ai-assisted" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">AI-Assisted audit</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-cyan-100 sm:text-sm"><code>{`vyper-guard analyze contracts/Vault.vy --ai

vyper-guard ai config set provider openai
vyper-guard ai config set model gpt-5.3-codex
vyper-guard ai config set api-key
vyper-guard ai config show`}</code></pre>
          </article>

          <article id="remediation" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Remediation workflow (`fix`)</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-cyan-100 sm:text-sm"><code>{`vyper-guard fix contracts/Vault.vy \\
  --fix-dry-run \\
  --max-auto-fix-tier B \\
  --fix-report reports/fix-plan.json`}</code></pre>
            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Tier A:</span> low-risk candidates.</li>
              <li><span className="font-semibold text-slate-900">Tier B:</span> medium-risk, review-required.</li>
              <li><span className="font-semibold text-slate-900">Tier C:</span> high-risk/architectural, mostly advisory.</li>
            </ul>
          </article>

          <article id="explorer" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Explorer + address analysis</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-cyan-100 sm:text-sm"><code>{`vyper-guard explorer 0xYourAddress --format json
vyper-guard analyze-address 0xYourAddress --format json

vyper-guard explorer config set provider auto
vyper-guard explorer config set api-key
vyper-guard explorer config show`}</code></pre>
          </article>

          <article id="scoring" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Scoring & grade policy</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Penalty model</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {Object.entries(severityPenalty).map(([severity, model]) => (
                    <li key={severity}><span className="font-semibold">{severity}</span>: {model.penalty} per finding (cap {model.cap})</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Grade bands</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {gradeScale.map((band) => (
                    <li key={band.grade}><span className="font-semibold">{band.grade}</span> ({band.min}-{band.max}): {band.recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article id="ci-cd" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">CI/CD</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-cyan-100 sm:text-sm"><code>{`vyper-guard analyze contracts/Vault.vy --format json --output report.json
vyper-guard analyze contracts/Vault.vy --ci --severity-threshold HIGH
python -m pytest -q`}</code></pre>
          </article>

          <article id="troubleshooting" className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Troubleshooting</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Command not found:</span> activate virtual environment and verify path.</li>
              <li><span className="font-semibold text-slate-900">AI not running:</span> confirm API key/provider in `vyper-guard ai config show`.</li>
              <li><span className="font-semibold text-slate-900">Explorer fails:</span> verify address and provider/API key config.</li>
              <li><span className="font-semibold text-slate-900">Empty source rejected:</span> expected for empty/comment-only files.</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/65 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Continue exploring</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/detectors" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">Open detector catalog</Link>
              <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">Open live metrics</Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
