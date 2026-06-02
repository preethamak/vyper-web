"use client";

import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import { severityCounts } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const data = [
  { name: "CRITICAL", value: severityCounts.CRITICAL, color: "#ef4444" },
  { name: "HIGH", value: severityCounts.HIGH, color: "#f97316" },
  { name: "MEDIUM", value: severityCounts.MEDIUM, color: "#f59e0b" },
  { name: "LOW", value: severityCounts.LOW, color: "#22c55e" },
  { name: "INFO", value: severityCounts.INFO, color: "#0ea5e9" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export function DetectorSeverityChart() {
  return (
    <ChartFrame className="h-72 w-full min-w-0" minHeight={220}>
      {({ width, height }) => (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            innerRadius={56}
            outerRadius={88}
            dataKey="value"
            stroke="none"
            paddingAngle={4}
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
            fontSize={11}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const numeric = Number(value ?? 0);
              const share = total === 0 ? 0 : (numeric / total) * 100;
              return [`${numeric} detectors (${share.toFixed(1)}%)`, "Count"];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(15,23,42,0.92)",
              color: "#fff",
            }}
          />
          <Legend verticalAlign="bottom" height={30} iconType="circle" />
        </PieChart>
      )}
    </ChartFrame>
  );
}
