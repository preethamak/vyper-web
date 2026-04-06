"use client";

import { InteractiveButton } from "@/components/interactive-button";
import { useToast } from "@/components/toast-provider";
import { resolveToast } from "@/lib/toast-rules";

export function DashboardActionButtons() {
  const { showToast } = useToast();
  const scoringToast = resolveToast("dashboard", "open_scoring");
  const detectorsToast = resolveToast("dashboard", "open_detectors");

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <InteractiveButton
        href="/docs#scoring"
        tone="light"
        size="md"
        className="text-sm"
        onClick={() => showToast(scoringToast.message, scoringToast.tone)}
      >
        Scoring policy
      </InteractiveButton>
      <InteractiveButton
        href="/detectors"
        tone="light"
        size="md"
        className="text-sm"
        onClick={() => showToast(detectorsToast.message, detectorsToast.tone)}
      >
        Detector catalog
      </InteractiveButton>
      <span className="brutal-pill px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
        telemetry live
      </span>
    </div>
  );
}
