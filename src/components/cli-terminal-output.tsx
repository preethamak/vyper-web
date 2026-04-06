"use client";

type Props = {
  command?: string;
  stdout: string;
  stderr: string;
  className?: string;
};

type StyleState = {
  bold: boolean;
  fg: string;
};

type Segment = {
  text: string;
  className: string;
};

function classForStyle(state: StyleState) {
  const weight = state.bold ? "font-semibold" : "font-normal";
  return `${state.fg} ${weight}`;
}

function applyCode(state: StyleState, code: number, defaultColor: string): StyleState {
  if (code === 0) return { bold: false, fg: defaultColor };
  if (code === 1) return { ...state, bold: true };
  if (code === 22) return { ...state, bold: false };

  const fgMap: Record<number, string> = {
    30: "text-slate-900",
    31: "text-red-300",
    32: "text-emerald-300",
    33: "text-amber-300",
    34: "text-sky-300",
    35: "text-fuchsia-300",
    36: "text-cyan-300",
    37: "text-slate-100",
    90: "text-slate-400",
    91: "text-red-200",
    92: "text-emerald-200",
    93: "text-amber-200",
    94: "text-sky-200",
    95: "text-fuchsia-200",
    96: "text-cyan-200",
    97: "text-white",
  };

  if (fgMap[code]) {
    return { ...state, fg: fgMap[code] };
  }

  return state;
}

function ansiToSegments(text: string, defaultColor: string) {
  const segments: Segment[] = [];
  const regex = /\x1b\[([0-9;]*)m/g;
  let cursor = 0;
  let style: StyleState = { bold: false, fg: defaultColor };

  for (;;) {
    const match = regex.exec(text);
    if (!match) break;

    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), className: classForStyle(style) });
    }

    const codes = (match[1] || "0")
      .split(";")
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value));

    for (const code of codes) {
      style = applyCode(style, code, defaultColor);
    }

    cursor = regex.lastIndex;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), className: classForStyle(style) });
  }

  return segments;
}

function renderStream(stream: string, defaultColor: string) {
  const segments = ansiToSegments(stream, defaultColor);
  return segments.length ? segments : [{ text: "(empty)", className: "text-slate-500" }];
}

export function CliTerminalOutput({ command, stdout, stderr, className = "" }: Props) {
  const hasAnyOutput = stdout.trim().length > 0 || stderr.trim().length > 0;

  return (
    <div className={`overflow-hidden rounded-xl border-2 border-[#24153f] bg-[#130b23] shadow-[4px_4px_0_#0f172a] ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-[#3b2463] bg-[#1b1230] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-200">cli-output</p>
      </div>

      <div className="h-[420px] overflow-auto p-4 font-mono text-xs leading-relaxed sm:h-[460px] sm:text-sm">
        {command ? <p className="whitespace-pre-wrap break-words text-violet-200">$ {command}</p> : null}
        {!hasAnyOutput ? <p className="mt-2 text-violet-200/60">No execution yet. Run a command to view real CLI output.</p> : null}

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/70">stdout</p>
        <pre className="mt-1 whitespace-pre-wrap break-words">
          {renderStream(stdout, "text-violet-100").map((segment, idx) => (
            <span key={`out-${idx}`} className={segment.className}>
              {segment.text}
            </span>
          ))}
        </pre>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-200/70">stderr</p>
        <pre className="mt-1 whitespace-pre-wrap break-words">
          {renderStream(stderr, "text-rose-300").map((segment, idx) => (
            <span key={`err-${idx}`} className={segment.className}>
              {segment.text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
