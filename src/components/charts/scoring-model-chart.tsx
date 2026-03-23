"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { severityPenalty } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const data = Object.entries(severityPenalty).map(([severity, info]) => ({
  severity,
  penalty: Math.abs(info.penalty),
  cap: Math.abs(info.cap),
}));

export function ScoringModelChart() {
  return (
    <ChartFrame className="h-80 w-full min-w-0" minHeight={240}>
      {({ width, height }) => (
        <BarChart width={width} height={height} data={data} barGap={18}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="severity" tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis tick={{ fill: "#334155", fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => {
              const numeric = typeof value === "number" ? value : Number(value ?? 0);
              const label = name === "penalty" ? "Per finding" : "Cap";
              return [`${numeric} points`, label];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(255,255,255,0.95)",
            }}
          />
          <Bar dataKey="penalty" fill="#0f766e" radius={[8, 8, 0, 0]}>
            <LabelList position="top" fill="#0f172a" fontSize={12} />
          </Bar>
          <Bar dataKey="cap" fill="#f59e0b" radius={[8, 8, 0, 0]}>
            <LabelList position="top" fill="#0f172a" fontSize={12} />
          </Bar>
        </BarChart>
      )}
    </ChartFrame>
  );
}
