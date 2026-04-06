"use client";

import { useMemo, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: "vyper" | "bash" | "json";
  className?: string;
};

const vyperKeywords = new Set([
  "def",
  "event",
  "struct",
  "interface",
  "implements",
  "for",
  "in",
  "if",
  "elif",
  "else",
  "assert",
  "return",
  "pass",
  "break",
  "continue",
  "send",
  "raw_call",
  "selfdestruct",
  "True",
  "False",
]);

const vyperDecorators = new Set(["@external", "@internal", "@view", "@payable", "@nonpayable", "@nonreentrant", "@pure"]);

function tokenizeLine(line: string, language: Props["language"]) {
  if (language === "json") {
    return line.split(/("(?:[^"\\]|\\.)*"|\b\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b|[{}\[\]:,])/g).filter(Boolean);
  }

  if (language === "bash") {
    return line.split(/(\$\s+|--?[a-zA-Z0-9-]+|\bvyper-guard\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g).filter(Boolean);
  }

  return line
    .split(/(@[a-zA-Z_][a-zA-Z0-9_]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|[():,=+\-*/<>]|\s+)/g)
    .filter((token) => token.length > 0);
}

function tokenClass(token: string, language: Props["language"]) {
  if (/^\s+$/.test(token)) return "text-slate-200";

  if (language === "json") {
    if (/^"(?:[^"\\]|\\.)*"$/.test(token)) return "text-emerald-300";
    if (/^\d+(?:\.\d+)?$/.test(token)) return "text-amber-300";
    if (/^(true|false|null)$/.test(token)) return "text-fuchsia-300";
    if (/^[{}\[\]:,]$/.test(token)) return "text-cyan-300";
    return "text-slate-100";
  }

  if (language === "bash") {
    if (token === "vyper-guard") return "text-cyan-300";
    if (/^--?[a-zA-Z0-9-]+$/.test(token)) return "text-amber-300";
    if (/^\$\s*$/.test(token)) return "text-emerald-300";
    if (/^"(?:[^"\\]|\\.)*"$/.test(token) || /^'(?:[^'\\]|\\.)*'$/.test(token)) return "text-emerald-300";
    return "text-slate-100";
  }

  if (token.startsWith("#")) return "text-slate-400";
  if (vyperDecorators.has(token)) return "text-violet-300";
  if (vyperKeywords.has(token)) return "text-cyan-300";
  if (/^\d+(?:\.\d+)?$/.test(token)) return "text-amber-300";
  if (/^"(?:[^"\\]|\\.)*"$/.test(token) || /^'(?:[^'\\]|\\.)*'$/.test(token)) return "text-emerald-300";
  if (/^[():,=+\-*/<>]$/.test(token)) return "text-fuchsia-300";
  return "text-slate-100";
}

export function CodeSyntaxEditor({ value, onChange, language, className = "" }: Props) {
  const highlightRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => value.split("\n"), [value]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950 shadow-[3px_3px_0_#0f172a] ${className}`}>
      <div className="grid h-full grid-cols-[3.2rem_1fr]">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="overflow-hidden border-r border-slate-800 bg-[#120b22] px-2 py-4 font-mono text-xs leading-relaxed text-slate-500"
        >
          {lines.map((_, index) => (
            <div key={`line-${index}`} className="text-right">
              {String(index + 1).padStart(2, "0")}
            </div>
          ))}
        </div>

        <div className="relative h-full min-w-0">
          <div
            ref={highlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-auto p-4 font-mono text-xs leading-relaxed"
          >
            {lines.map((line, lineIndex) => {
              const commentOnly = line.trimStart().startsWith("#") && language === "vyper";
              return (
                <div key={`${lineIndex}-${line}`} className="whitespace-pre-wrap break-all">
                  {commentOnly
                    ? line
                    : tokenizeLine(line, language).map((token, idx) => (
                        <span key={`${lineIndex}-${idx}-${token}`} className={tokenClass(token, language)}>
                          {token}
                        </span>
                      ))}
                  {line.length === 0 ? " " : ""}
                </div>
              );
            })}
          </div>

          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            onScroll={(event) => {
              if (highlightRef.current) {
                highlightRef.current.scrollTop = event.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }
              if (gutterRef.current) {
                gutterRef.current.scrollTop = event.currentTarget.scrollTop;
              }
            }}
            className="relative z-10 h-full w-full resize-none overflow-auto bg-transparent p-4 font-mono text-xs leading-relaxed text-transparent caret-cyan-200 outline-none selection:bg-cyan-500/25"
          />
        </div>
      </div>
    </div>
  );
}
