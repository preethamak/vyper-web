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
          <ScoringModelChart />
        </article>
      </div>

      <article className="surface-card brutal-card-hover mt-4 rounded-xl p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ChartNoAxesCombined className="h-4 w-4" />
          Detector category spread
        </div>
        <DetectorCategoryChart />
      </article>
    </>
  );
}
