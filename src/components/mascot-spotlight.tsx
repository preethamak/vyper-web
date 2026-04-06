"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { InteractiveButton } from "@/components/interactive-button";

export function MascotSpotlight() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="surface-shell overflow-hidden rounded-[2rem] p-6 lg:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="section-kicker">Brand mascot</p>
            <h2 className="section-title mt-3 text-2xl">Vyper mascot is now wired and ready.</h2>
            <p className="mt-3 max-w-xl text-slate-700">
              The mascot and logo now load from the branding folder. You can replace them anytime without touching code.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <InteractiveButton href="/branding/vyper-mascot.png" target="_blank" rel="noreferrer" tone="light" size="sm">
                Open mascot asset
              </InteractiveButton>
              <InteractiveButton href="/branding/vyper-logo.svg" target="_blank" rel="noreferrer" tone="light" size="sm">
                Open logo asset
              </InteractiveButton>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <motion.img
              src={imageFailed ? "/branding/vyper-mascot.svg" : "/branding/vyper-mascot.png"}
              alt="Vyper Guard mascot"
              onError={() => setImageFailed(true)}
              className="w-full rounded-2xl border-2 border-slate-900 bg-white shadow-[8px_8px_0_#0f172a]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
