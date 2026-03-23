import { Download, GitFork, GitGraph, Star } from "lucide-react";
import type { ProjectIntel } from "@/lib/live-intel";

type Props = {
  intel: ProjectIntel;
};

function formatNumber(value: number | null) {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function IntelStrip({ intel }: Props) {
  const cards = [
    {
      label: "PyPI last-30d downloads",
      value: formatNumber(intel.pypi.downloads30d),
      icon: Download,
    },
    { label: "GitHub stars", value: formatNumber(intel.github.stars), icon: Star },
    { label: "GitHub forks", value: formatNumber(intel.github.forks), icon: GitFork },
    {
      label: "Open issues",
      value: formatNumber(intel.github.openIssues),
      icon: GitGraph,
    },
  ];

  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-6 lg:px-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-white/65 bg-white/65 p-4 backdrop-blur-xl">
            <div className="mb-2 inline-flex rounded-lg bg-slate-900 p-2 text-cyan-100">
              <card.icon className="h-4 w-4" />
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
