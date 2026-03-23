"use client";

import { Pie, PieChart, Cell, Tooltip } from "recharts";
import { severityCounts } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const data = [
  { name: "CRITICAL", value: severityCounts.CRITICAL, color: "#ef4444" },
  { name: "HIGH", value: severityCounts.HIGH, color: "#f97316" },
  { name: "MEDIUM", value: severityCounts.MEDIUM, color: "#f59e0b" },
  { name: "LOW", value: severityCounts.LOW, color: "#22c55e" },
];

export function DetectorSeverityChart() {
  return (
    <ChartFrame className="h-72 w-full min-w-0" minHeight={220}>
      {({ width, height }) => (
        <PieChart width={width} height={height}>
          <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value" stroke="none" paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(15,23,42,0.92)",
              color: "#fff",
            }}
          />
        </PieChart>
      )}
    </ChartFrame>
  );
}
