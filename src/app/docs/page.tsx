import Link from "next/link";
import { TerminalFrame } from "@/components/terminal-frame";
import { commands, detectors, gradeScale, projectFacts, severityPenalty } from "@/lib/vyper-data";

const docsNav = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "architecture", label: "Architecture" },
  { id: "analysis-lifecycle", label: "Analysis Lifecycle" },
  { id: "command-reference", label: "Command Reference" },
  { id: "detector-taxonomy", label: "Detector Taxonomy" },
  { id: "ai-assisted", label: "AI-Assisted Audit" },
  { id: "ast-flow", label: "AST & Flow Views" },
  { id: "remediation", label: "Remediation / Fix" },
  { id: "explorer", label: "Explorer + Address Analysis" },
  { id: "outputs", label: "Output Formats" },
  { id: "configuration", label: "Configuration" },
  { id: "scoring", label: "Scoring & Grades" },
  { id: "backward-compatibility", label: "Backward Compatibility" },
  { id: "ci-cd", label: "CI/CD" },
  { id: "team-workflow", label: "Team Workflow" },
  { id: "governance", label: "Governance" },
  { id: "security-notice", label: "Security Notice" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "faq", label: "FAQ" },
  { id: "appendix", label: "Appendix" },
];

export default function DocsPage() {
  return (
    <main className="docs-page mx-auto w-full max-w-7xl px-6 pb-24 pt-10 lg:px-10">
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

      <section className="mt-8 grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
        <aside className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:sticky lg:top-24 lg:h-fit">
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

        <div className="docs-content space-y-6">
          <article id="overview" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Vyper Guard is a Vyper-focused security analysis CLI designed for developer loops, security
              review workflows, and CI policy enforcement. It combines deterministic static analysis with
              semantic context and optional AI-assisted explanation, while keeping machine-readable output
              for automation.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              The platform supports both local source-file analysis and address-based intelligence for
              deployed contracts. Outputs are available in human-friendly terminal format and structured
              report formats for integration into release gates and audit pipelines.
            </p>
          </article>

          <article id="installation" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Installation</h2>
            <p className="mt-2 text-sm text-slate-700">Install Vyper Guard from PyPI and verify the CLI in your active Python environment.</p>
            <TerminalFrame title="installation">{`pip install vyper-guard
vyper-guard --version
vyper-guard --help`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Python requirement:</span> {projectFacts.python}</li>
              <li><span className="font-semibold text-slate-900">Package license:</span> {projectFacts.license}</li>
              <li><span className="font-semibold text-slate-900">Recommended setup:</span> isolated virtual environment per repository.</li>
            </ul>
          </article>

          <article id="quick-start" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Quick Start</h2>
            <p className="mt-2 text-sm text-slate-700">Minimal path to first scan, AI triage, flow view, and graph exports.</p>
            <TerminalFrame title="quick start">{`pip install vyper-guard
vyper-guard analyze contracts/Vault.vy
vyper-guard analyze contracts/Vault.vy --ai
vyper-guard ast contracts/Vault.vy --format json
vyper-guard flow contracts/Vault.vy --format mermaid
vyper-guard stats contracts/Vault.vy --graph`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              For folder-level analysis, point to a directory path. The scanner recursively evaluates Vyper
              contracts and aggregates findings per file and per severity class.
            </p>
          </article>

          <article id="architecture" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Architecture</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              The execution model is intentionally layered: input normalization, deterministic detector pass,
              semantic verification, optional AI interpretation, and report synthesis. This keeps core findings
              reproducible while allowing richer human-readable audit context.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Deterministic core</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>Regex/pattern detector pass</li>
                  <li>Semantic checks and contextual validation</li>
                  <li>Scoring and severity normalization</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Advisory/augmentation layer</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>AI prioritization of deterministic findings</li>
                  <li>Remediation narrative generation</li>
                  <li>Operational report exports</li>
                </ul>
              </div>
            </div>
          </article>

          <article id="analysis-lifecycle" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Analysis lifecycle</h2>
            <ol className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">1) Input validation:</span> verifies source exists and rejects empty/comment-only files.</li>
              <li><span className="font-semibold text-slate-900">2) Deterministic analysis:</span> detector patterns + AST/semantic contextual checks.</li>
              <li><span className="font-semibold text-slate-900">3) Risk synthesis:</span> severity distribution, score, and deploy recommendation.</li>
              <li><span className="font-semibold text-slate-900">4) Report rendering:</span> CLI / JSON / Markdown outputs for local and CI usage.</li>
            </ol>
            <p className="mt-4 text-sm text-slate-700">
              This staged model ensures the same source yields stable baseline findings while still allowing
              optional augmentation layers to improve reviewer velocity and report quality.
            </p>
          </article>

          <article id="command-reference" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Command reference</h2>
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
            <p className="mt-3 text-sm text-slate-700">
              Recommended baseline commands for teams are `analyze`, `analyze --ai`, `fix --fix-dry-run`,
              `stats --graph`, and `analyze-address` for post-deploy checks.
            </p>
          </article>

          <article id="detector-taxonomy" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Detector taxonomy</h2>
            <p className="mt-2 text-sm text-slate-700">Detector inventory grouped by category and operational intent.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Detector key</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {detectors.map((detector) => (
                    <tr key={detector.key} className="border-t border-slate-200/80">
                      <td className="px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{detector.key}</td>
                      <td className="px-4 py-3 text-slate-700">{detector.severity}</td>
                      <td className="px-4 py-3 text-slate-600">{detector.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="ai-assisted" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">AI-Assisted audit</h2>
            <p className="mt-2 text-sm text-slate-700">
              AI mode augments deterministic findings. It should be treated as a triage and explanation layer,
              not as a replacement for deterministic checks or formal audit review.
            </p>
            <TerminalFrame title="ai configuration">{`vyper-guard analyze contracts/Vault.vy --ai

vyper-guard ai config set provider openai
vyper-guard ai config set model gpt-5.3-codex
vyper-guard ai config set api-key
vyper-guard ai config show`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Use AI mode for prioritization and report readability.</li>
              <li>Keep deterministic severity thresholds as the enforcement baseline.</li>
              <li>Store AI-assisted reports for audit traceability in CI artifacts.</li>
            </ul>
          </article>

          <article id="ast-flow" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">AST and flow views</h2>
            <p className="mt-2 text-sm text-slate-700">
              Structural views improve reviewer understanding of contract layout, function interactions,
              and potential high-risk control paths.
            </p>
            <TerminalFrame title="structure views">{`vyper-guard ast contracts/Vault.vy --format json
vyper-guard flow contracts/Vault.vy --format mermaid`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              AST output is suited for machine processing and tooling integration, while flow summaries are
              suited for reviewer cognition and architecture walkthroughs.
            </p>
          </article>

          <article id="remediation" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Remediation workflow (`fix`)</h2>
            <TerminalFrame title="fix workflow">{`vyper-guard fix contracts/Vault.vy \\
  --fix-dry-run \\
  --max-auto-fix-tier B \\
  --fix-report reports/fix-plan.json`}</TerminalFrame>
            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Tier A:</span> low-risk candidates.</li>
              <li><span className="font-semibold text-slate-900">Tier B:</span> medium-risk, review-required.</li>
              <li><span className="font-semibold text-slate-900">Tier C:</span> high-risk/architectural, mostly advisory.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-700">
              Teams should require human approval for Tier B and Tier C classes and retain fix-plan artifacts
              in pull request metadata to preserve review transparency.
            </p>
          </article>

          <article id="explorer" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Explorer + address analysis</h2>
            <TerminalFrame title="explorer lookup">{`vyper-guard explorer 0xYourAddress --format json
vyper-guard analyze-address 0xYourAddress --format json

vyper-guard explorer config set provider auto
vyper-guard explorer config set api-key
vyper-guard explorer config show`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Address-based mode is intended for post-deployment visibility and incident response workflows,
              especially when source and ABI are verified through explorer providers.
            </p>
          </article>

          <article id="outputs" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Output formats</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">CLI</p>
                <p className="mt-2 text-sm text-slate-700">Human-readable local feedback with score and severity summary.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">JSON</p>
                <p className="mt-2 text-sm text-slate-700">Machine-readable artifacts for CI gates, dashboards, and archival.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Markdown</p>
                <p className="mt-2 text-sm text-slate-700">Audit and PR-ready narrative reporting format.</p>
              </div>
            </div>
            <TerminalFrame title="report output">{`vyper-guard analyze contracts/Vault.vy --format json --output report.json
vyper-guard analyze contracts/Vault.vy --format markdown --output report.md`}</TerminalFrame>
          </article>

          <article id="configuration" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Configuration</h2>
            <p className="mt-2 text-sm text-slate-700">
              Core configuration surfaces include AI provider/model settings, explorer provider credentials,
              output defaults, and CI severity thresholds.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">AI configuration</p>
                <TerminalFrame title="ai config" className="mt-3">{`vyper-guard ai config set provider openai
vyper-guard ai config set model gpt-5.3-codex
vyper-guard ai config show`}</TerminalFrame>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Explorer configuration</p>
                <TerminalFrame title="explorer config" className="mt-3">{`vyper-guard explorer config set provider auto
vyper-guard explorer config set api-key
vyper-guard explorer config show`}</TerminalFrame>
              </div>
            </div>
          </article>

          <article id="scoring" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Scoring & grade policy</h2>
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
            <p className="mt-4 text-sm text-slate-700">
              Severity caps prevent a single class from over-dominating score impact and preserve a more
              balanced security posture interpretation across multiple risk dimensions.
            </p>
          </article>

          <article id="backward-compatibility" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Backward compatibility</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Existing workflows based on <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">analyze [path]</code> remain valid. Newer features such as AI layering,
              explorer integration, and fix policy controls are additive and can be introduced incrementally.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Legacy single-file usage remains supported.</li>
              <li>Folder-level recursive analysis remains compatible.</li>
              <li>Structured output flags are optional and backwards-safe.</li>
            </ul>
          </article>

          <article id="ci-cd" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">CI/CD</h2>
            <TerminalFrame title="ci pipeline">{`vyper-guard analyze contracts/Vault.vy --format json --output report.json
vyper-guard analyze contracts/Vault.vy --ci --severity-threshold HIGH
python -m pytest -q`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Recommended CI pattern: generate machine-readable report, evaluate threshold policy, publish
              report artifact, and fail fast on disallowed severities.
            </p>
          </article>

          <article id="team-workflow" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Team workflow guide</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              A practical team pattern is to run deterministic scans at commit time, run full AI-assisted
              triage on pull requests, and enforce severity thresholds in CI before merge. This approach keeps
              developer feedback fast while preserving strict release controls for security-critical changes.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              For audit-heavy repositories, teams typically pair `analyze --format json` with markdown reports.
              JSON outputs are consumed by quality gates, while markdown artifacts are attached to pull requests
              for reviewer clarity and discussion.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Pre-commit: local deterministic scan to catch immediate issues.</li>
              <li>Pull request: AI-assisted triage and fix-plan generation.</li>
              <li>Release branch: threshold-based CI gating and archived reports.</li>
            </ul>
          </article>

          <article id="governance" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Policy and governance</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Security governance should define acceptable risk by severity and environment. A common policy is
              zero tolerated critical findings in all environments, and zero high findings for production deploys.
              Medium and low findings may be allowed with explicit waivers and remediation timelines.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Waiver records should include detector key, rationale, owner, expiry date, and mitigation status.
              This creates auditability and prevents permanent drift from baseline security posture.
            </p>
          </article>

          <article id="security-notice" className="docs-section rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/85 to-amber-50/65 p-7 shadow-[0_10px_24px_rgba(120,53,15,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Security notice</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Vyper Guard is a security analysis assistant and not a formal guarantee of exploit absence.
              All critical and high findings should be reviewed by qualified auditors before production deployment.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              AI-assisted sections are advisory. Deterministic findings and manual code review remain the
              authoritative basis for release decisions.
            </p>
          </article>

          <article id="troubleshooting" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Troubleshooting</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Command not found:</span> activate virtual environment and verify path.</li>
              <li><span className="font-semibold text-slate-900">AI not running:</span> confirm API key/provider in <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">vyper-guard ai config show</code>.</li>
              <li><span className="font-semibold text-slate-900">Explorer fails:</span> verify address and provider/API key config.</li>
              <li><span className="font-semibold text-slate-900">Empty source rejected:</span> expected for empty/comment-only files.</li>
              <li><span className="font-semibold text-slate-900">Unexpected CI pass/fail:</span> verify severity threshold values and report path handling.</li>
              <li><span className="font-semibold text-slate-900">Low signal/no findings:</span> ensure target path includes `.vy` contracts and non-empty source.</li>
            </ul>
          </article>

          <article id="faq" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Frequently asked questions</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Does AI mode change deterministic findings?</p>
                <p className="mt-1">No. AI mode augments interpretation and prioritization, but baseline findings come from deterministic analysis.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Can I use Vyper Guard only in CI?</p>
                <p className="mt-1">Yes, but local scans are recommended to reduce CI churn and speed developer feedback loops.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Should I auto-apply all fixes?</p>
                <p className="mt-1">No. Start with dry-run and tier caps. Require human review for higher-risk fix classes.</p>
              </div>
            </div>
          </article>

          <article id="appendix" className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Appendix</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              This page is a product-level operational reference derived from available Vyper Guard metadata,
              command references, and detector/scoring model representation in the project context. For upstream
              implementation details and release notes, use the linked repository and package pages.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={projectFacts.repository} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">Repository</a>
              <a href={projectFacts.docs} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">DeepWiki</a>
              <a href={projectFacts.pypi} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">PyPI</a>
            </div>
          </article>

          <article className="docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-7 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Continue exploring</h2>
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
