"use client";

import { InteractiveButton } from "@/components/interactive-button";
import { useToast } from "@/components/toast-provider";
import { resolveToast } from "@/lib/toast-rules";
import { projectFacts } from "@/lib/vyper-data";

export function DocsPrimaryActions() {
  const { showToast } = useToast();
  const repoToast = resolveToast("docs", "open_repository");
  const docsToast = resolveToast("docs", "open_docs");
  const pypiToast = resolveToast("docs", "open_pypi");

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <InteractiveButton
        href={projectFacts.repository}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="md"
        onClick={() => showToast(repoToast.message, repoToast.tone)}
      >
        GitHub Repository
      </InteractiveButton>
      <InteractiveButton
        href={projectFacts.docs}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="md"
        onClick={() => showToast(docsToast.message, docsToast.tone)}
      >
        DeepWiki Documentation
      </InteractiveButton>
      <InteractiveButton
        href={projectFacts.pypi}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="md"
        onClick={() => showToast(pypiToast.message, pypiToast.tone)}
      >
        PyPI Package
      </InteractiveButton>
    </div>
  );
}

export function DocsAppendixActions() {
  const { showToast } = useToast();
  const repoToast = resolveToast("docs", "open_repository");
  const docsToast = resolveToast("docs", "open_docs");
  const pypiToast = resolveToast("docs", "open_pypi");

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <InteractiveButton
        href={projectFacts.repository}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="sm"
        className="text-[11px] uppercase tracking-[0.14em]"
        onClick={() => showToast(repoToast.message, repoToast.tone)}
      >
        Repository
      </InteractiveButton>
      <InteractiveButton
        href={projectFacts.docs}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="sm"
        className="text-[11px] uppercase tracking-[0.14em]"
        onClick={() => showToast(docsToast.message, docsToast.tone)}
      >
        DeepWiki
      </InteractiveButton>
      <InteractiveButton
        href={projectFacts.pypi}
        target="_blank"
        rel="noreferrer"
        tone="light"
        size="sm"
        className="text-[11px] uppercase tracking-[0.14em]"
        onClick={() => showToast(pypiToast.message, pypiToast.tone)}
      >
        PyPI
      </InteractiveButton>
    </div>
  );
}

export function DocsExploreActions() {
  const { showToast } = useToast();
  const detectorsToast = resolveToast("docs", "open_detectors");
  const dashboardToast = resolveToast("docs", "open_dashboard");

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <InteractiveButton
        href="/detectors"
        tone="light"
        size="md"
        onClick={() => showToast(detectorsToast.message, detectorsToast.tone)}
      >
        Open detector catalog
      </InteractiveButton>
      <InteractiveButton
        href="/dashboard"
        tone="light"
        size="md"
        onClick={() => showToast(dashboardToast.message, dashboardToast.tone)}
      >
        Open live metrics
      </InteractiveButton>
    </div>
  );
}
