"use client";

import dynamic from "next/dynamic";

const DetectorSeverityChart = dynamic(
  () => import("@/components/charts/detector-severity-chart").then((m) => m.DetectorSeverityChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-2xl bg-slate-200/60" /> },
);

const ScoringModelChart = dynamic(
  () => import("@/components/charts/scoring-model-chart").then((m) => m.ScoringModelChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl bg-slate-200/60" /> },
);

const DetectorCategoryChart = dynamic(
  () => import("@/components/charts/detector-category-chart").then((m) => m.DetectorCategoryChart),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-2xl bg-slate-200/60" /> },
);

export function DashboardCharts() {
  return (
    <>
      <section className="mx-auto mt-6 grid w-full max-w-7xl gap-4 px-6 lg:grid-cols-3 lg:px-10">
        <article className="rounded-3xl border border-white/70 bg-white/65 p-5">
          <p className="text-sm font-semibold text-slate-700">Severity distribution</p>
          <DetectorSeverityChart />
        </article>

        <article className="rounded-3xl border border-white/70 bg-white/65 p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Scoring penalty policy</p>
          <ScoringModelChart />
        </article>
      </section>

      <section className="mx-auto mt-4 w-full max-w-7xl px-6 lg:px-10">
        <article className="rounded-3xl border border-white/70 bg-white/65 p-5">
          <p className="text-sm font-semibold text-slate-700">Detector categories</p>
          <DetectorCategoryChart />
        </article>
      </section>
    </>
  );
}
