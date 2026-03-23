import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroExperience } from "@/components/hero-experience";
import { CommandGrid } from "@/components/command-grid";
import { DocumentationPanels } from "@/components/documentation-panels";
import { HomeAnalytics } from "@/components/home-analytics";

export default function Home() {
  return (
    <>
      <HeroExperience />

      <CommandGrid />
      <DocumentationPanels />

      <section className="mx-auto mt-14 w-full max-w-7xl px-6 lg:px-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Security analytics model</h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5"
          >
            Open Live Metrics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <HomeAnalytics />
      </section>
    </>
  );
}
