"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { exampleScanResults } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const data = exampleScanResults.map((result) => ({
  name: result.name,
  score: result.score,
  grade: result.grade,
  CRITICAL: result.CRITICAL,
  HIGH: result.HIGH,
  MEDIUM: result.MEDIUM,
  LOW: result.LOW,
  INFO: result.INFO,
}));

export function ExampleScanOutcomesChart() {
  return (
    <ChartFrame className="h-96 w-full min-w-0" minHeight={260}>
      {({ width, height }) => (
        <ComposedChart width={width} height={height} data={data} margin={{ left: 6, right: 6, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="name" tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis yAxisId="findings" allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis yAxisId="score" orientation="right" domain={[0, 100]} tick={{ fill: "#334155", fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "score") return [`${value} / 100`, "Security score"];
              return [`${value}`, String(name)];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(255,255,255,0.97)",
            }}
          />
          <Legend verticalAlign="top" height={28} iconType="circle" />

          <Bar yAxisId="findings" dataKey="CRITICAL" stackId="findings" fill="#ef4444" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="findings" dataKey="HIGH" stackId="findings" fill="#f97316" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="findings" dataKey="MEDIUM" stackId="findings" fill="#f59e0b" radius={[0, 0, 0, 0]} />
          <Bar yAxisId="findings" dataKey="LOW" stackId="findings" fill="#22c55e" radius={[6, 6, 0, 0]} />

          <Line
            yAxisId="score"
            type="monotone"
            dataKey="score"
            stroke="#0f172a"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0f172a" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      )}
    </ChartFrame>
  );
}
