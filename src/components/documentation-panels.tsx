import { documentationSections } from "@/lib/vyper-data";

export function DocumentationPanels() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-6 lg:px-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Documentation Surface</p>
          <h2 className="section-title mt-2 text-3xl">Learn in product-shaped blocks</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {documentationSections.map((section, index) => (
          <article
            id={section.id}
            key={section.id}
            className={`surface-card rounded-[1.2rem] p-6 ${index === 0 ? "xl:col-span-2" : ""}`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{section.id}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{section.title}</h3>
            <p className="mt-3 leading-relaxed text-slate-700">{section.content}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
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
