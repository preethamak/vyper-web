import { ArrowRight } from "lucide-react";
import { HeroExperience } from "@/components/hero-experience";
import { LandingOperations } from "@/components/landing-operations";
import { DocumentationPanels } from "@/components/documentation-panels";
import { HomeAnalytics } from "@/components/home-analytics";
import { HomeCommandStudio } from "@/components/home-command-studio";
import { InteractiveButton } from "@/components/interactive-button";

export default function Home() {
  return (
    <>
      <HeroExperience />

      <LandingOperations />
      <HomeCommandStudio />
      <DocumentationPanels />

      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title text-2xl">Security analytics model</h2>
          <InteractiveButton
            href="/dashboard"
            className="text-slate-800"
            tone="light"
            size="md"
          >
            Open Live Metrics
            <ArrowRight className="h-4 w-4" />
          </InteractiveButton>
        </div>

        <HomeAnalytics />
      </section>
    </>
  );
}
