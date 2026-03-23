import { documentationSections } from "@/lib/vyper-data";

export function DocumentationPanels() {
  return (
    <section className="mx-auto mt-14 w-full max-w-7xl px-6 lg:px-10">
      <div className="grid gap-4 lg:grid-cols-2">
        {documentationSections.map((section) => (
          <article
            id={section.id}
            key={section.id}
            className="rounded-3xl border border-white/75 bg-white/60 p-7 shadow-[0_12px_35px_rgba(15,23,42,0.11)] backdrop-blur-xl"
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
