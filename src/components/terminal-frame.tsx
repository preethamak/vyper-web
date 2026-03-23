type Props = {
  title?: string;
  children: string;
  className?: string;
};

export function TerminalFrame({ title = "terminal", children, className = "mt-4" }: Props) {
  const lines = children.split("\n");

  return (
    <div className={`${className} overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-950 shadow-[0_16px_40px_rgba(2,6,23,0.35)]`}>
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">{title}</p>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-sm">
        {lines.map((line, index) => {
          const isEmpty = line.trim().length === 0;
          const isComment = line.trim().startsWith("#");
          const prompt = !isEmpty && !isComment;

          return (
            <div key={`${line}-${index}`} className="min-w-max whitespace-pre">
              {prompt ? <span className="mr-2 text-emerald-400">$</span> : <span className="mr-2 text-slate-600"> </span>}
              <span className={isComment ? "text-slate-400" : isEmpty ? "text-transparent" : "text-cyan-200"}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
