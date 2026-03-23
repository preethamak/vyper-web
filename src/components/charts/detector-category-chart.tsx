"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { detectors } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const categoryMap = detectors.reduce<Record<string, number>>((acc, detector) => {
  acc[detector.category] = (acc[detector.category] ?? 0) + 1;
  return acc;
}, {});

const data = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

export function DetectorCategoryChart() {
  return (
    <ChartFrame className="h-72 w-full min-w-0" minHeight={220}>
      {({ width, height }) => (
        <BarChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="category" tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(255,255,255,0.95)",
            }}
          />
          <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]} />
        </BarChart>
      )}
    </ChartFrame>
  );
}
