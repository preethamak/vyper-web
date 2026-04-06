import { documentationSections } from "@/lib/vyper-data";

export function DocumentationPanels() {
  return (
    <section className="font-alt mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Documentation Surface</p>
          <h2 className="section-title mt-2 text-3xl">How teams actually use Vyper Guard</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Practical usage patterns from first local scan to CI gating, fix reviews, and post-deploy checks.
          </p>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 lg:grid-cols-2">
        {documentationSections.map((section, index) => (
          <article
            id={section.id}
            key={section.id}
            className="surface-card flex h-full flex-col rounded-[1.2rem] p-5 sm:p-6"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-white px-2 text-[11px] font-bold text-slate-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{section.id}</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">{section.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">{section.content}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-600 sm:text-[15px]">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-600" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
