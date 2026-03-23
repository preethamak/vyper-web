import { detectors } from "@/lib/vyper-data";

const severityClass: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INFO: "bg-sky-100 text-sky-700 border-sky-200",
};

export default function DetectorsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 lg:px-10">
      <section className="rounded-3xl border border-white/75 bg-white/70 p-8 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Detector Intelligence</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Vyper Guard detector catalog</h1>
        <p className="mt-4 max-w-4xl text-slate-700">
          These detectors are derived from the current Vyper Guard references and map directly to security,
          logic, and best-practice checks used in static analysis.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {detectors.map((detector) => (
          <article key={detector.key} className="rounded-2xl border border-white/70 bg-white/65 p-5">
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
    </main>
  );
}
