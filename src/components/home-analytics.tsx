"use client";

import { ChartNoAxesCombined } from "lucide-react";
import dynamic from "next/dynamic";

const DetectorSeverityChart = dynamic(
  () => import("@/components/charts/detector-severity-chart").then((m) => m.DetectorSeverityChart),
  { ssr: false, loading: () => <div className="skeleton-brutal h-72" /> },
);

const ScoringModelChart = dynamic(
  () => import("@/components/charts/scoring-model-chart").then((m) => m.ScoringModelChart),
  { ssr: false, loading: () => <div className="skeleton-brutal h-80" /> },
);

const DetectorCategoryChart = dynamic(
  () => import("@/components/charts/detector-category-chart").then((m) => m.DetectorCategoryChart),
  { ssr: false, loading: () => <div className="skeleton-brutal h-72" /> },
);

const DetectorCapabilityChart = dynamic(
  () => import("@/components/charts/detector-capability-chart").then((m) => m.DetectorCapabilityChart),
  { ssr: false, loading: () => <div className="skeleton-brutal h-80" /> },
);

const ExampleScanOutcomesChart = dynamic(
  () => import("@/components/charts/example-scan-outcomes-chart").then((m) => m.ExampleScanOutcomesChart),
  { ssr: false, loading: () => <div className="skeleton-brutal h-96" /> },
);

export function HomeAnalytics() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="surface-card brutal-card-hover rounded-xl p-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">Detector severity mix</p>
          <DetectorSeverityChart />
        </article>

        <article className="surface-card brutal-card-hover rounded-xl p-5 lg:col-span-2">
          <p className="mb-2 text-sm font-semibold text-slate-700">Penalty and cap policy per severity tier</p>
          <p className="mb-2 text-xs text-slate-500">Includes capped deductions; trust penalties apply separately when detector execution fails.</p>
          <ScoringModelChart />
        </article>
      </div>

      <article className="surface-card brutal-card-hover mt-4 rounded-xl p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ChartNoAxesCombined className="h-4 w-4" />
          Detector risk-domain groups
        </div>
        <DetectorCategoryChart />
      </article>

      <article className="surface-card brutal-card-hover mt-4 rounded-xl p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ChartNoAxesCombined className="h-4 w-4" />
          Detector capability coverage
        </div>
        <DetectorCapabilityChart />
      </article>

      <article className="surface-card brutal-card-hover mt-4 rounded-xl p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ChartNoAxesCombined className="h-4 w-4" />
          Example scan outcomes (actual runs)
        </div>
        <ExampleScanOutcomesChart />
      </article>
    </>
  );
}
