import { DashboardCharts } from "@/components/dashboard-charts";
import { IntelStrip } from "@/components/intel-strip";
import { fetchProjectIntel } from "@/lib/live-intel";

export default async function DashboardPage() {
  const intel = await fetchProjectIntel();

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-7xl px-6 pt-10 lg:px-10">
        <div className="rounded-3xl border border-white/75 bg-white/70 p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Metrics</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Telemetry + analysis dashboard</h1>
          <p className="mt-3 text-slate-700">
            This page combines live package/repository telemetry with real detector and scoring data from
            Vyper Guard documentation.
          </p>
          <p className="mt-2 text-xs text-slate-500">Last refresh: {new Date(intel.fetchedAt).toLocaleString()}</p>
        </div>
      </section>

      <IntelStrip intel={intel} />

      <DashboardCharts />
    </main>
  );
}
