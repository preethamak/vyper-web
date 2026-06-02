"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { detectorCapabilitySummary } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const data = [
  { name: "Smart suppression", value: detectorCapabilitySummary.smartSuppression, color: "#0ea5e9" },
  { name: "Dynamic severity", value: detectorCapabilitySummary.dynamicSeverity, color: "#6366f1" },
  { name: "Auto-fix (full)", value: detectorCapabilitySummary.autoFixFull, color: "#16a34a" },
  { name: "Auto-fix (partial)", value: detectorCapabilitySummary.autoFixPartial, color: "#f59e0b" },
  { name: "Auto-fix (advisory)", value: detectorCapabilitySummary.autoFixAdvisory, color: "#f97316" },
];

export function DetectorCapabilityChart() {
  return (
    <ChartFrame className="h-80 w-full min-w-0" minHeight={240}>
      {({ width, height }) => (
        <BarChart width={width} height={height} data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis type="number" allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={136}
            tick={{ fill: "#334155", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value} detectors`, "Coverage"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(255,255,255,0.95)",
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            <LabelList dataKey="value" position="right" fill="#0f172a" fontSize={12} />
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      )}
    </ChartFrame>
  );
}
