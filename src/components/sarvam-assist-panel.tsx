"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare, Sparkles, Volume2 } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";

const languageOptions = [
  { code: "hi-IN", label: "Hindi (hi-IN)" },
  { code: "bn-IN", label: "Bengali (bn-IN)" },
  { code: "ta-IN", label: "Tamil (ta-IN)" },
  { code: "te-IN", label: "Telugu (te-IN)" },
  { code: "kn-IN", label: "Kannada (kn-IN)" },
  { code: "ml-IN", label: "Malayalam (ml-IN)" },
  { code: "gu-IN", label: "Gujarati (gu-IN)" },
  { code: "mr-IN", label: "Marathi (mr-IN)" },
  { code: "pa-IN", label: "Punjabi (pa-IN)" },
];

const speakerOptions = [
  { value: "", label: "Auto" },
  { value: "shubh", label: "shubh" },
  { value: "anushka", label: "anushka" },
  { value: "abhilash", label: "abhilash" },
  { value: "manisha", label: "manisha" },
  { value: "vidya", label: "vidya" },
  { value: "arya", label: "arya" },
  { value: "karun", label: "karun" },
  { value: "hitesh", label: "hitesh" },
];

type RiskItem = {
  title?: string;
  severity?: string;
  evidence?: string;
};

type FixItem = {
  title?: string;
  rationale?: string;
};

type SummaryParsed = {
  summary?: string;
  top_risks?: RiskItem[];
  suggested_fixes?: FixItem[];
  confidence?: string;
  notes?: string;
};

type AnalysisSnapshot = {
  command?: string;
  preset?: string;
  durationMs?: number;
  exitCode?: number | null;
  timedOut?: boolean;
  severityCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  outputExcerpt?: string;
};

type Props = {
  analysis: AnalysisSnapshot | null;
  analysisText: string;
};

export function SarvamAssistPanel({ analysis, analysisText }: Props) {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryParsed, setSummaryParsed] = useState<SummaryParsed | null>(null);
  const [summaryRaw, setSummaryRaw] = useState<string>("");
  const [summaryFocus, setSummaryFocus] = useState("");

  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);

  const [translateInput, setTranslateInput] = useState("");
  const [translateOutput, setTranslateOutput] = useState("");
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [translateLang, setTranslateLang] = useState("hi-IN");

  const [ttsInput, setTtsInput] = useState("");
  const [ttsAudioSrc, setTtsAudioSrc] = useState("");
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [ttsLang, setTtsLang] = useState("hi-IN");
  const [ttsSpeaker, setTtsSpeaker] = useState("");

  const summaryText = useMemo(() => {
    if (summaryParsed?.summary) return summaryParsed.summary;
    if (summaryRaw.trim().length) return summaryRaw.trim();
    return "";
  }, [summaryParsed, summaryRaw]);

  useEffect(() => {
    if (summaryText && translateInput.trim().length === 0) {
      setTranslateInput(summaryText);
    }
    if (summaryText && ttsInput.trim().length === 0) {
      setTtsInput(summaryText);
    }
  }, [summaryText, translateInput, ttsInput]);

  const hasAnalysis = Boolean(analysis?.outputExcerpt && analysis.outputExcerpt.trim().length > 0);

  const handleSummary = async () => {
    if (!analysis) return;
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryParsed(null);
    setSummaryRaw("");

    try {
      const response = await fetch("/api/sarvam-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "summary", analysis, prompt: summaryFocus }),
      });

      const payload = (await response.json()) as { parsed?: SummaryParsed; raw?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Summary request failed.");
      }

      setSummaryParsed(payload.parsed ?? null);
      setSummaryRaw(payload.raw ?? "");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Summary request failed.";
      setSummaryError(message);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleQa = async () => {
    if (!analysis) return;
    const question = qaQuestion.trim();
    if (!question) return;

    setQaLoading(true);
    setQaError(null);
    setQaAnswer("");

    try {
      const response = await fetch("/api/sarvam-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "qa", analysis, prompt: question }),
      });

      const payload = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Q&A request failed.");
      }

      setQaAnswer(payload.answer ?? "");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Q&A request failed.";
      setQaError(message);
    } finally {
      setQaLoading(false);
    }
  };

  const handleTranslate = async () => {
    const text = translateInput.trim();
    if (!text) return;

    setTranslateLoading(true);
    setTranslateError(null);
    setTranslateOutput("");

    try {
      const response = await fetch("/api/sarvam-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "translate", text, targetLanguageCode: translateLang }),
      });

      const payload = (await response.json()) as { translatedText?: string; error?: string; raw?: unknown };
      if (!response.ok) {
        throw new Error(payload.error ?? "Translation request failed.");
      }

      if (payload.translatedText) {
        setTranslateOutput(payload.translatedText);
      } else if (payload.raw) {
        setTranslateOutput(JSON.stringify(payload.raw, null, 2));
      } else {
        setTranslateOutput("No translation returned.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation request failed.";
      setTranslateError(message);
    } finally {
      setTranslateLoading(false);
    }
  };

  const handleTts = async () => {
    const text = ttsInput.trim();
    if (!text) return;

    setTtsLoading(true);
    setTtsError(null);
    setTtsAudioSrc("");

    try {
      const response = await fetch("/api/sarvam-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "tts",
          text,
          targetLanguageCode: ttsLang,
          speaker: ttsSpeaker || undefined,
        }),
      });

      const payload = (await response.json()) as {
        audioBase64?: string;
        contentType?: string;
        error?: string;
        raw?: unknown;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "TTS request failed.");
      }

      if (payload.audioBase64) {
        const mime = payload.contentType ?? "audio/wav";
        setTtsAudioSrc(`data:${mime};base64,${payload.audioBase64}`);
      } else if (payload.raw) {
        setTtsError("Unsupported TTS response format.");
      } else {
        setTtsError("No audio returned.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "TTS request failed.";
      setTtsError(message);
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <article className="surface-card min-w-0 rounded-[1.4rem] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sarvam Assist</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Multilingual security briefs + voice output</h2>
        </div>
        <div className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
          powered by sarvam
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Generates a structured summary, answers analyst questions, and produces translation/voice output using Sarvam APIs.
        Only the analysis excerpt shown below is sent to Sarvam.
      </p>

      <div className="mt-3 rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2 text-xs text-slate-700">
        {hasAnalysis ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Command</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-800">{analysis?.command ?? "-"}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Duration</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{analysis?.durationMs ?? "-"} ms</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Exit</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{analysis?.exitCode ?? "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{analysis?.timedOut ? "Timed out" : "Done"}</p>
              </div>
            </div>
          </div>
        ) : (
          "Run a Vyper Guard command to enable Sarvam Assist."
        )}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border-2 border-slate-900 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles className="h-4 w-4" />
              Summary + Risk Brief
            </div>
            <InteractiveButton
              onClick={handleSummary}
              disabled={!hasAnalysis || summaryLoading}
              size="sm"
              tone="accent"
            >
              {summaryLoading ? "Generating..." : "Generate"}
            </InteractiveButton>
          </div>

          <label className="mt-3 block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Focus (optional)</span>
            <input
              value={summaryFocus}
              onChange={(event) => setSummaryFocus(event.target.value)}
              placeholder="e.g. prioritize critical and high risks"
              className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
            />
          </label>

          {summaryError ? (
            <p className="mt-3 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {summaryError}
            </p>
          ) : null}

          {summaryParsed || summaryRaw ? (
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              {summaryParsed?.summary ? <p className="font-semibold text-slate-900">{summaryParsed.summary}</p> : null}

              {summaryParsed?.top_risks?.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Top risks</p>
                  <ul className="mt-2 space-y-2">
                    {summaryParsed.top_risks.map((risk, index) => (
                      <li key={`risk-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {risk.title ?? "Untitled"} {risk.severity ? `(${risk.severity})` : ""}
                        </p>
                        {risk.evidence ? <p className="mt-1 text-xs text-slate-600">Evidence: {risk.evidence}</p> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {summaryParsed?.suggested_fixes?.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Suggested fixes</p>
                  <ul className="mt-2 space-y-2">
                    {summaryParsed.suggested_fixes.map((fix, index) => (
                      <li key={`fix-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <p className="text-sm font-semibold text-slate-900">{fix.title ?? "Fix"}</p>
                        {fix.rationale ? <p className="mt-1 text-xs text-slate-600">{fix.rationale}</p> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {summaryParsed?.confidence ? (
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Confidence: <span className="text-slate-800">{summaryParsed.confidence}</span>
                </p>
              ) : null}

              {summaryParsed?.notes ? <p className="text-xs text-slate-600">Notes: {summaryParsed.notes}</p> : null}

              {!summaryParsed && summaryRaw ? (
                <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  {summaryRaw}
                </pre>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Generate a brief to see structured findings.</p>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <MessageSquare className="h-4 w-4" />
                Ask a question
              </div>
              <InteractiveButton onClick={handleQa} disabled={!hasAnalysis || qaLoading} size="sm" tone="light">
                {qaLoading ? "Asking..." : "Ask"}
              </InteractiveButton>
            </div>
            <input
              value={qaQuestion}
              onChange={(event) => setQaQuestion(event.target.value)}
              placeholder="Which detector triggered the top risk?"
              className="mt-3 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
            />
            {qaError ? <p className="mt-2 text-xs text-red-600">{qaError}</p> : null}
            {qaAnswer ? <p className="mt-2 text-sm text-slate-700">{qaAnswer}</p> : null}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-2xl border-2 border-slate-900 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900">Translation</div>
              <InteractiveButton onClick={handleTranslate} disabled={translateLoading} size="sm" tone="light">
                {translateLoading ? "Translating..." : "Translate"}
              </InteractiveButton>
            </div>

            <label className="mt-3 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Target language</span>
              <select
                value={translateLang}
                onChange={(event) => setTranslateLang(event.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Text to translate</span>
              <textarea
                value={translateInput}
                onChange={(event) => setTranslateInput(event.target.value)}
                rows={5}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
              />
            </label>

            {translateError ? (
              <p className="mt-2 text-xs text-red-600">{translateError}</p>
            ) : translateOutput ? (
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                {translateOutput}
              </pre>
            ) : (
              <p className="mt-2 text-xs text-slate-500">Translate the summary or your own notes into Indic languages.</p>
            )}
          </section>

          <section className="rounded-2xl border-2 border-slate-900 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Volume2 className="h-4 w-4" />
                Voice brief
              </div>
              <InteractiveButton onClick={handleTts} disabled={ttsLoading} size="sm" tone="dark">
                {ttsLoading ? "Synthesizing..." : "Generate"}
              </InteractiveButton>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Language</span>
                <select
                  value={ttsLang}
                  onChange={(event) => setTtsLang(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
                >
                  {languageOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Speaker</span>
                <select
                  value={ttsSpeaker}
                  onChange={(event) => setTtsSpeaker(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
                >
                  {speakerOptions.map((speaker) => (
                    <option key={speaker.value || "auto"} value={speaker.value}>
                      {speaker.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-3 block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Text for voice</span>
              <textarea
                value={ttsInput}
                onChange={(event) => setTtsInput(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-300 focus:ring"
              />
            </label>

            {ttsError ? <p className="mt-2 text-xs text-red-600">{ttsError}</p> : null}
            {ttsAudioSrc ? (
              <audio className="mt-3 w-full" controls src={ttsAudioSrc} />
            ) : (
              <p className="mt-2 text-xs text-slate-500">Generate a voice clip for standups or quick reviews.</p>
            )}
          </section>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Output excerpt length: {analysisText.length.toLocaleString()} characters. Review before sharing externally.
      </div>
    </article>
  );
}
