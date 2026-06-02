import { TerminalFrame } from "@/components/terminal-frame";
import { DocsAppendixActions, DocsExploreActions, DocsPrimaryActions } from "@/components/docs-action-clusters";
import {
  commands,
  detectorCapabilitySummary,
  detectors,
  exampleScanProvenance,
  exampleScanResults,
  failedDetectorPenalty,
  gradeScale,
  projectFacts,
  severityPenalty,
} from "@/lib/vyper-data";

const docsNav = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "analysis-pipeline", label: "Analysis Pipeline" },
  { id: "metrics-provenance", label: "Metrics Provenance" },
  { id: "command-reference", label: "Command Reference" },
  { id: "sarvam-assist", label: "Sarvam Assist" },
  { id: "ai-triage", label: "AI Triage" },
  { id: "remediation", label: "Remediation" },
  { id: "explorer", label: "Explorer + Address Analysis" },
  { id: "agent", label: "Agent Mode" },
  { id: "monitoring", label: "Monitoring + Baseline" },
  { id: "detectors", label: "Detector Catalog" },
  { id: "scoring", label: "Scoring + Grades" },
  { id: "limits", label: "Known Limits" },
  { id: "configuration", label: "Configuration" },
  { id: "exit-codes", label: "Exit Codes" },
  { id: "ci-cd", label: "CI/CD" },
  { id: "checklist", label: "Security Checklist" },
  { id: "security-notice", label: "Security Notice" },
  { id: "appendix", label: "Appendix" },
];

const sectionClass =
  "docs-section rounded-3xl border border-white/80 bg-gradient-to-b from-white/85 to-white/65 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:p-7";

export default function DocsPage() {
  return (
    <main className="docs-page font-alt mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-10">
      <section className="rounded-3xl border border-white/75 bg-white/70 p-5 backdrop-blur-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Documentation • Vyper Guard</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Implementation-aligned usage reference</h1>
        <p className="mt-4 max-w-4xl text-slate-700">
          This page is synchronized to DeepWiki coverage and the upstream repository command surface. It prioritizes
          actual CLI behavior, guardrails, and known limitations over marketing copy.
        </p>

        <DocsPrimaryActions />
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <article className="surface-card brutal-card-hover rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Step 1</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Install and verify</h2>
          <p className="mt-2 text-sm text-slate-600">Install package and confirm CLI availability.</p>
          <p className="mt-3 rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
            pip install vyper-guard
          </p>
        </article>

        <article className="surface-card brutal-card-hover rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Step 2</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Run first scan</h2>
          <p className="mt-2 text-sm text-slate-600">Analyze one `.vy` contract with deterministic detectors.</p>
          <p className="mt-3 rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
            vyper-guard analyze contract.vy
          </p>
        </article>

        <article className="surface-card brutal-card-hover rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Step 3</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Export artifacts</h2>
          <p className="mt-2 text-sm text-slate-600">Generate CI-ready JSON and graph output.</p>
          <p className="mt-3 rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
            vyper-guard stats contract.vy --graph
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[0.28fr_0.72fr]">
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
          <article id="overview" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Vyper Guard is a static analyzer for Vyper contracts with optional advisory layers (AI triage, agent
              mode, explorer context, monitoring). The deterministic core remains the source of truth for verdicts and
              CI policy decisions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Single-contract static analysis via `analyze &lt;file&gt;`.</li>
              <li>12 detector checks including compiler version advisories.</li>
              <li>CLI, JSON, and Markdown outputs.</li>
              <li>Optional remediation, explorer, and runtime workflows.</li>
            </ul>
          </article>

          <article id="installation" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Installation</h2>
            <p className="mt-2 text-sm text-slate-700">Install from PyPI and validate CLI resolution in your current environment.</p>
            <TerminalFrame title="installation">{`pip install vyper-guard
vyper-guard --version
vyper-guard --help`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Python requirement:</span> {projectFacts.python}</li>
              <li>
                <span className="font-semibold text-slate-900">Optional monitor dependency:</span>{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">pip install -e &quot;.[monitor]&quot;</code>
              </li>
              <li><span className="font-semibold text-slate-900">Docker path:</span> scan mounted `.vy` files using `vyper-guard analyze`.</li>
            </ul>
          </article>

          <article id="quick-start" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Quick start</h2>
            <TerminalFrame title="quick start">{`vyper-guard analyze contract.vy
vyper-guard analyze contract.vy --format json --output report.json
vyper-guard analyze contract.vy --ci --severity-threshold HIGH
vyper-guard stats contract.vy --graph`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              The `analyze` command targets a single `.vy` file path. If you want multi-file coverage in CI, invoke
              `analyze` per file (for example via `find`/`xargs`).
            </p>
          </article>

          <article id="analysis-pipeline" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Static analysis pipeline</h2>
            <ol className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">1) Source loading:</span> load and validate non-empty `.vy` source.</li>
              <li><span className="font-semibold text-slate-900">2) AST parsing:</span> build contract/function/state metadata.</li>
              <li><span className="font-semibold text-slate-900">3) Compiler check:</span> evaluate pragma against known GHSA advisories.</li>
              <li><span className="font-semibold text-slate-900">4) Detector execution:</span> run enabled detector set with smart suppression.</li>
              <li><span className="font-semibold text-slate-900">5) Score + grade:</span> apply severity penalties, tier caps, and trust penalties.</li>
              <li><span className="font-semibold text-slate-900">6) Reporting:</span> render CLI/JSON/Markdown output.</li>
            </ol>
          </article>

          <article id="metrics-provenance" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Metrics and graph provenance</h2>
            <p className="mt-2 text-sm text-slate-700">
              The website intentionally mixes two metric classes, and each chart is tied to one class only.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Model-level charts</p>
                <ul className="mt-2 space-y-1">
                  <li>Severity distribution (detector inventory metadata).</li>
                  <li>Scoring penalty chart (configured deduction model).</li>
                  <li>Risk-domain and capability charts (detector definitions).</li>
                </ul>
                <p className="mt-3 text-xs text-slate-500">
                  These are not from a single contract run; they represent current analyzer design and policy.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Run-derived chart</p>
                <ul className="mt-2 space-y-1">
                  <li>Example scan outcomes chart uses real CLI runs on upstream example contracts.</li>
                  <li>Run command: <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{exampleScanProvenance.command}</code></li>
                  <li>Generator: {exampleScanProvenance.generatorVersion}</li>
                  <li>Generated: {exampleScanProvenance.generatedAt}</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Example</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Findings</th>
                    <th className="px-4 py-3">Severity Mix</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleScanResults.map((row) => (
                    <tr key={row.name} className="border-t border-slate-200/80">
                      <td className="px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{row.source}</td>
                      <td className="px-4 py-3 text-slate-700">{row.score}</td>
                      <td className="px-4 py-3 text-slate-700">{row.grade}</td>
                      <td className="px-4 py-3 text-slate-700">{row.findings}</td>
                      <td className="px-4 py-3 text-slate-600">
                        C:{row.CRITICAL} H:{row.HIGH} M:{row.MEDIUM} L:{row.LOW} I:{row.INFO}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="command-reference" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Command reference</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
                      <td className="break-all px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{entry.command}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="sarvam-assist" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Sarvam Assist (web)</h2>
            <p className="mt-2 text-sm text-slate-700">
              Sarvam Assist turns Vyper Guard output into structured briefs, multilingual summaries, and voice clips.
              The web UI sends a trimmed analyzer excerpt to Sarvam APIs and renders the response inline.
            </p>
            <TerminalFrame title="sarvam assist setup">{`export SARVAM_API_KEY="your_sarvam_api_key"
export SARVAM_CHAT_MODEL="sarvam-105b"
export SARVAM_TTS_MODEL="bulbul:v3"`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Run a command in the workbench to unlock Sarvam Assist.</li>
              <li>Summaries and Q&A are advisory; deterministic findings remain authoritative.</li>
              <li>Translations use Sarvam Text Translate; voice clips use Sarvam Text-to-Speech.</li>
              <li>Keep the API key in server-side environment variables only.</li>
            </ul>
          </article>

          <article id="ai-triage" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">AI-assisted triage</h2>
            <p className="mt-2 text-sm text-slate-700">
              AI triage is advisory-only. It cannot override deterministic findings. LLM mode is strict by default and
              fallback is explicit opt-in.
            </p>
            <TerminalFrame title="ai triage">{`vyper-guard analyze contract.vy --format json --ai-triage
vyper-guard analyze contract.vy --format json --ai-triage \\
  --ai-triage-mode llm --ai-llm-model gpt-5
vyper-guard analyze contract.vy --format json --ai-triage \\
  --ai-triage-mode llm --allow-ai-fallback
vyper-guard ai config set provider openai
vyper-guard ai config set model gpt-5
vyper-guard ai config show`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Use `--no-ai-triage` to disable triage explicitly.</li>
              <li>Policy metadata is included in JSON output (`ai_triage_policy`).</li>
              <li>Treat triage as prioritization support, not a release gate source of truth.</li>
            </ul>
          </article>

          <article id="remediation" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Remediation and fix controls</h2>
            <TerminalFrame title="remediation">{`vyper-guard analyze contract.vy --fix
vyper-guard analyze contract.vy --fix --max-auto-fix-tier B
vyper-guard analyze contract.vy --fix-dry-run --fix-report remediation-report.json`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li><span className="font-semibold text-slate-900">Tier A:</span> safest mechanical edits.</li>
              <li><span className="font-semibold text-slate-900">Tier B:</span> moderate-risk edits, review recommended.</li>
              <li><span className="font-semibold text-slate-900">Tier C:</span> advisory/manual refactor prompts.</li>
              <li>Dry-run and write prompts reduce accidental file mutation risk.</li>
            </ul>
          </article>

          <article id="explorer" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Explorer and address analysis</h2>
            <TerminalFrame title="explorer + address">{`vyper-guard explorer 0xYourContractAddress --provider auto --format json
vyper-guard analyze-address 0xYourContractAddress --format json
vyper-guard explorer config set provider auto
vyper-guard explorer config set network sepolia
vyper-guard explorer config set api-key
vyper-guard explorer config show`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Address analysis depends on verified explorer source. Non-Vyper or unavailable source is surfaced with
              metadata and limitations rather than misleading static verdicts.
            </p>
          </article>

          <article id="agent" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">LLM agent mode</h2>
            <TerminalFrame title="agent">{`vyper-guard agent "Top 3 security risks" --file contract.vy
vyper-guard agent "Summarize ABI attack surface" --address 0xYourContractAddress
vyper-guard agent "Validate this patch plan" \\
  --file contract.vy \\
  --memory-file .guardian_agent_memory.jsonl \\
  --sandbox-script tools/check_patch.py
vyper-guard agent-memory stats --memory-file .guardian_agent_memory.jsonl`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Agent mode is strict by default; use fallback flags only when deterministic degraded output is explicitly
              acceptable for your workflow.
            </p>
          </article>

          <article id="monitoring" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Monitoring and baseline</h2>
            <TerminalFrame title="monitoring">{`vyper-guard monitor 0xYourContractAddress --rpc https://rpc.url
vyper-guard baseline 0xYourContractAddress --rpc https://rpc.url --duration 300 --output baseline.json
vyper-guard monitor 0xYourContractAddress --rpc https://rpc.url --baseline baseline.json`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Live monitoring requires the optional monitor dependency set and is meant for runtime anomaly detection,
              not static-code replacement.
            </p>
          </article>

          <article id="detectors" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Detector catalog</h2>
            <p className="mt-2 text-sm text-slate-700">
              Detector severities can be context-aware (for example, access-control-aware downgrades). The table uses
              the primary severity for quick taxonomy.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="surface-card-subtle rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Total</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{detectorCapabilitySummary.total}</p>
              </article>
              <article className="surface-card-subtle rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Smart Suppression</p>
                <p className="mt-1 text-xl font-bold text-cyan-700">{detectorCapabilitySummary.smartSuppression}</p>
              </article>
              <article className="surface-card-subtle rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Dynamic Severity</p>
                <p className="mt-1 text-xl font-bold text-indigo-700">{detectorCapabilitySummary.dynamicSeverity}</p>
              </article>
              <article className="surface-card-subtle rounded-lg p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Auto-Fix Full</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">{detectorCapabilitySummary.autoFixFull}</p>
              </article>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Detector key</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Suppression</th>
                    <th className="px-4 py-3">Auto-Fix</th>
                    <th className="px-4 py-3">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {detectors.map((detector) => (
                    <tr key={detector.key} className="border-t border-slate-200/80">
                      <td className="break-all px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{detector.key}</td>
                      <td className="px-4 py-3 text-slate-700">{detector.severity}</td>
                      <td className="px-4 py-3 text-slate-600">{detector.confidence}</td>
                      <td className="px-4 py-3 text-slate-600">{detector.smartSuppression ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-slate-600">{detector.autoFix}</td>
                      <td className="px-4 py-3 text-slate-600">{detector.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article id="scoring" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Scoring and grade policy</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Penalty model</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {Object.entries(severityPenalty).map(([severity, model]) => (
                    <li key={severity}>
                      <span className="font-semibold">{severity}</span>: {model.penalty} per finding (cap {model.cap})
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-700">
                  Detector runtime failures apply an additional trust penalty ({failedDetectorPenalty.penalty} each,
                  capped at {failedDetectorPenalty.cap}).
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Grade bands</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {gradeScale.map((band) => (
                    <li key={band.grade}>
                      <span className="font-semibold">{band.grade}</span> ({band.min}-{band.max}): {band.recommendation}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-700">Recommended production minimum remains 80+.</p>
              </div>
            </div>
          </article>

          <article id="limits" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Known limitations</h2>
            <p className="mt-2 text-sm text-slate-700">
              DeepWiki and repository docs both emphasize that Vyper Guard is a single-layer control. It does not model
              protocol economics or cross-contract runtime behavior end-to-end.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Cross-contract protocol attacks (flash loans, oracle manipulation, governance attacks) are out of scope.</li>
              <li>Formal verification and economic review are still required for high-value deployments.</li>
              <li>Smart suppression reduces false positives but cannot eliminate all edge cases.</li>
              <li>Exit codes are binary success/failure unless you enforce severity filtering policy in command flags/config.</li>
            </ul>
          </article>

          <article id="configuration" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Configuration</h2>
            <p className="mt-2 text-sm text-slate-700">
              Configuration can be managed through `.guardianrc`, CLI config helpers, and environment overrides.
              Secure defaults are emphasized for config trust boundaries and sensitive key handling.
            </p>
            <TerminalFrame title="configuration">{`# AI + explorer config helpers
vyper-guard ai config set provider openai
vyper-guard ai config set model gpt-5
vyper-guard explorer config set provider auto
vyper-guard explorer config set network sepolia
vyper-guard explorer config set api-key

# dashboard telemetry (website runtime)
export PEPY_API_KEY="<your_pepy_api_key>"

# sarvam assist (website runtime)
export SARVAM_API_KEY="<your_sarvam_api_key>"

# trusted parent config discovery (opt-in)
export GUARDIAN_TRUST_PARENT_CONFIG=true`}</TerminalFrame>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Keep API keys in environment variables where possible.</li>
              <li>Use severity thresholds in config or CLI for deterministic CI policy.</li>
              <li>Treat config discovery outside the repo root as explicit trust opt-in.</li>
            </ul>
          </article>

          <article id="exit-codes" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Exit code semantics</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Baseline behavior</p>
                <ul className="mt-2 space-y-1">
                  <li>`0`: no findings after filters.</li>
                  <li>`1`: one or more findings (or strict-mode failures).</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Operational implication</p>
                <ul className="mt-2 space-y-1">
                  <li>Use `--severity-threshold` to shape policy boundaries.</li>
                  <li>Use JSON output for richer gate logic in CI systems.</li>
                </ul>
              </div>
            </div>
          </article>

          <article id="ci-cd" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">CI/CD integration</h2>
            <TerminalFrame title="ci pipeline">{`vyper-guard analyze contract.vy --format json --output report.json
vyper-guard analyze contract.vy --ci --severity-threshold HIGH
find contracts -name '*.vy' -print0 | xargs -0 -I{} vyper-guard analyze "{}" --ci --severity-threshold HIGH`}</TerminalFrame>
            <p className="mt-3 text-sm text-slate-700">
              Typical team flow: deterministic scan at commit time, optional AI triage on pull requests, and strict
              threshold-based gates in CI.
            </p>
          </article>

          <article id="checklist" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Production security checklist</h2>
            <p className="mt-2 text-sm text-slate-700">
              For mainnet readiness, static analysis should be combined with testing, review, and staged deployment controls.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Control</th>
                    <th className="px-4 py-3">Minimum expectation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200/80">
                    <td className="px-4 py-3 text-slate-900">Static analysis</td>
                    <td className="px-4 py-3 text-slate-600">Security score target 80+ with zero unresolved critical findings.</td>
                  </tr>
                  <tr className="border-t border-slate-200/80">
                    <td className="px-4 py-3 text-slate-900">Testing</td>
                    <td className="px-4 py-3 text-slate-600">Comprehensive unit/integration/fuzz coverage for core invariants.</td>
                  </tr>
                  <tr className="border-t border-slate-200/80">
                    <td className="px-4 py-3 text-slate-900">Manual review</td>
                    <td className="px-4 py-3 text-slate-600">Qualified reviewer sign-off on critical/high findings and waivers.</td>
                  </tr>
                  <tr className="border-t border-slate-200/80">
                    <td className="px-4 py-3 text-slate-900">Pre-mainnet rollout</td>
                    <td className="px-4 py-3 text-slate-600">Testnet soak period, monitoring alerts, staged deployment controls.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article id="security-notice" className="docs-section rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/85 to-amber-50/65 p-7 shadow-[0_10px_24px_rgba(120,53,15,0.08)]">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Security notice</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Vyper Guard is provided as a static analysis assistant, not a proof of exploit absence. Critical/high
              findings require qualified human review before production deployment.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Deterministic results and manual audit controls remain authoritative. AI and agent outputs are advisory.
            </p>
          </article>

          <article id="appendix" className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Appendix</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Primary upstream references: `README.md`, `docs/USAGE.md`, `docs/DETECTORS.md`,
              `docs/INSTALLATION.md`, and `docs/CHANGELOG.md` in the repository, plus DeepWiki generated pages for
              architecture, limitations, and operational summaries.
            </p>
            <DocsAppendixActions />
          </article>

          <article className={sectionClass}>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Continue exploring</h2>
            <DocsExploreActions />
          </article>
        </div>
      </section>
    </main>
  );
}
