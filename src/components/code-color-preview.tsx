type Props = {
  code: string;
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

export function CodeColorPreview({ code, language, className = "" }: Props) {
  const lines = code.split("\n");

  return (
    <div className={`overflow-auto rounded-2xl border-2 border-slate-900 bg-slate-950 p-4 font-mono text-xs shadow-[3px_3px_0_#0f172a] ${className}`}>
      {lines.map((line, lineIndex) => {
        const commentOnly = line.trimStart().startsWith("#") && language === "vyper";

        return (
          <div key={`${lineIndex}-${line}`} className="flex min-w-0 gap-3">
            <span className="select-none text-[10px] text-slate-500">{String(lineIndex + 1).padStart(2, "0")}</span>
            <span className="whitespace-pre-wrap break-all">
              {commentOnly
                ? line
                : tokenizeLine(line, language).map((token, idx) => (
                    <span key={`${lineIndex}-${idx}-${token}`} className={tokenClass(token, language)}>
                      {token}
                    </span>
                  ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
