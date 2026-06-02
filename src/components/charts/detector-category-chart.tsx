"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { detectors } from "@/lib/vyper-data";
import { ChartFrame } from "@/components/charts/chart-frame";

const groupMap = detectors.reduce<Record<string, number>>((acc, detector) => {
  const group =
    detector.key === "missing_nonreentrant" ||
    detector.key === "cei_violation" ||
    detector.key === "unsafe_raw_call" ||
    detector.key === "dangerous_delegatecall" ||
    detector.key === "send_in_loop"
      ? "Reentrancy & Call Safety"
      : detector.key === "unprotected_state_change" ||
          detector.key === "unprotected_selfdestruct" ||
          detector.key === "unchecked_subtraction"
        ? "Access & State Integrity"
        : "Quality & Compiler Safety";

  acc[group] = (acc[group] ?? 0) + 1;
  return acc;
}, {});

const data = Object.entries(groupMap).map(([group, count]) => ({ group, count }));

export function DetectorCategoryChart() {
  return (
    <ChartFrame className="h-72 w-full min-w-0" minHeight={220}>
      {({ width, height }) => (
        <BarChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="group" tick={{ fill: "#334155", fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: "#334155", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(255,255,255,0.95)",
            }}
          />
          <Bar dataKey="count" fill="#0284c7" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="count" position="top" fill="#0f172a" fontSize={12} />
          </Bar>
        </BarChart>
      )}
    </ChartFrame>
  );
}
