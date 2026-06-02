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

const DetectorCapabilityChart = dynamic(
  () => import("@/components/charts/detector-capability-chart").then((m) => m.DetectorCapabilityChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl bg-slate-200/60" /> },
);

const ExampleScanOutcomesChart = dynamic(
  () => import("@/components/charts/example-scan-outcomes-chart").then((m) => m.ExampleScanOutcomesChart),
  { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-2xl bg-slate-200/60" /> },
);

export function DashboardCharts() {
  return (
    <>
      <section className="mx-auto mt-6 grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-10">
        <article className="surface-card brutal-card-hover rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-700">Severity distribution</p>
          <DetectorSeverityChart />
        </article>

        <article className="surface-card brutal-card-hover rounded-xl p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Scoring penalty policy</p>
          <p className="mt-1 text-xs text-slate-500">Severity deductions use tier caps; detector runtime failures apply extra trust penalties.</p>
          <ScoringModelChart />
        </article>
      </section>

      <section className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="surface-card brutal-card-hover rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-700">Detector risk-domain groups</p>
            <p className="mt-1 text-xs text-slate-500">Grouped from detector keys to show analysis focus areas.</p>
            <DetectorCategoryChart />
          </article>
          <article className="surface-card brutal-card-hover rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-700">Detector capability coverage</p>
            <p className="mt-1 text-xs text-slate-500">Suppression, dynamic severity, and remediation coverage.</p>
            <DetectorCapabilityChart />
          </article>
        </div>
      </section>

      <section className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <article className="surface-card brutal-card-hover rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-700">Example scan outcomes (actual runs)</p>
          <p className="mt-1 text-xs text-slate-500">
            Stacked bars show finding counts by severity; line shows final score for each upstream example contract.
          </p>
          <ExampleScanOutcomesChart />
        </article>
      </section>
    </>
  );
}
