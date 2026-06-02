import { detectorCapabilitySummary, detectors, severityCounts } from "@/lib/vyper-data";

const severityClass: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INFO: "bg-sky-100 text-sky-700 border-sky-200",
};

export default function DetectorsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <section className="surface-card rounded-xl p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Detector Intelligence</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Vyper Guard detector catalog</h1>
        <p className="mt-4 max-w-4xl text-slate-700">
          Detector definitions are aligned to the current upstream references and implementation.
          Some checks use context-aware severity (for example, access-control-aware downgrades).
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="surface-card-subtle brutal-card-hover rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Critical</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{severityCounts.CRITICAL}</p>
          </article>
          <article className="surface-card-subtle brutal-card-hover rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">High</p>
            <p className="mt-1 text-2xl font-bold text-orange-600">{severityCounts.HIGH}</p>
          </article>
          <article className="surface-card-subtle brutal-card-hover rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Medium</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{severityCounts.MEDIUM}</p>
          </article>
          <article className="surface-card-subtle brutal-card-hover rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Low</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{severityCounts.LOW}</p>
          </article>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {detectors.map((detector) => (
          <article key={detector.key} className="surface-card brutal-card-hover rounded-xl p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-slate-500">{detector.key}</span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClass[detector.severity]}`}>
                {detector.severity}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{detector.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{detector.description}</p>
            <p className="mt-4 inline-flex rounded-full bg-slate-900/90 px-3 py-1 text-xs text-cyan-100">
              {detector.category}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-white/80 bg-white/70 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-slate-900">Detector capability matrix</h2>
        <p className="mt-2 text-sm text-slate-700">
          Confidence, suppression, and remediation metadata mirror upstream detector documentation and implementation behavior.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="surface-card-subtle rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Smart Suppression</p>
            <p className="mt-1 text-xl font-bold text-cyan-700">
              {detectorCapabilitySummary.smartSuppression}/{detectorCapabilitySummary.total}
            </p>
          </article>
          <article className="surface-card-subtle rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Dynamic Severity</p>
            <p className="mt-1 text-xl font-bold text-indigo-700">
              {detectorCapabilitySummary.dynamicSeverity}/{detectorCapabilitySummary.total}
            </p>
          </article>
          <article className="surface-card-subtle rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Auto-Fix Full</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              {detectorCapabilitySummary.autoFixFull}/{detectorCapabilitySummary.total}
            </p>
          </article>
          <article className="surface-card-subtle rounded-lg p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Advisory/Partial</p>
            <p className="mt-1 text-xl font-bold text-amber-700">
              {detectorCapabilitySummary.autoFixAdvisory + detectorCapabilitySummary.autoFixPartial}/
              {detectorCapabilitySummary.total}
            </p>
          </article>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-slate-700">
              <tr>
                <th className="px-4 py-3">Detector</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Smart Suppression</th>
                <th className="px-4 py-3">Dynamic Severity</th>
                <th className="px-4 py-3">Auto-Fix Profile</th>
              </tr>
            </thead>
            <tbody>
              {detectors.map((detector) => (
                <tr key={`${detector.key}-matrix`} className="border-t border-slate-200/80">
                  <td className="px-4 py-3 font-mono text-xs text-slate-900 sm:text-sm">{detector.key}</td>
                  <td className="px-4 py-3 text-slate-700">{detector.confidence}</td>
                  <td className="px-4 py-3 text-slate-600">{detector.smartSuppression ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-slate-600">{detector.dynamicSeverity ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-slate-600">{detector.autoFix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
