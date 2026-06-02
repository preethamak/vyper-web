import { NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

export const runtime = "nodejs";

type AssistMode = "summary" | "qa" | "translate" | "tts";

type AnalysisSnapshot = {
  command?: string;
  preset?: string;
  durationMs?: number;
  exitCode?: number | null;
  timedOut?: boolean;
  stdout?: string;
  stderr?: string;
  severityCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  outputExcerpt?: string;
};

type AssistBody = {
  mode?: AssistMode;
  analysis?: AnalysisSnapshot;
  text?: string;
  targetLanguageCode?: string;
  speaker?: string;
  speakerGender?: string;
  prompt?: string;
};

const MAX_TEXT_CHARS = 12_000;
const MAX_PROMPT_CHARS = 800;

function safeString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n...[truncated]`;
}

function normalizeLang(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

function extractJsonCandidate(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractTranslationText(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const payload = response as Record<string, unknown>;
  const candidates = [
    payload.translated_text,
    payload.translation,
    payload.output_text,
    payload.text,
    payload.output,
    payload.result,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length) {
      return candidate;
    }
  }
  return "";
}

function extractAudioBase64(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const payload = response as Record<string, unknown>;
  if (Array.isArray(payload.audios) && payload.audios.length > 0) {
    const joined = payload.audios.filter((item) => typeof item === "string").join("");
    if (joined.trim().length) return joined;
  }
  const candidates = [
    payload.audioBase64,
    payload.audio_base64,
    payload.audioContent,
    payload.audio_content,
    payload.audio,
    payload.output,
    payload.data,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length) {
      return candidate;
    }
  }
  if (payload.audio && typeof payload.audio === "object") {
    const nested = payload.audio as Record<string, unknown>;
    if (typeof nested.data === "string") return nested.data;
  }
  return "";
}

function buildSummaryPrompt(analysis: AnalysisSnapshot, prompt?: string) {
  const payload = {
    command: analysis.command ?? null,
    preset: analysis.preset ?? null,
    durationMs: analysis.durationMs ?? null,
    exitCode: analysis.exitCode ?? null,
    timedOut: analysis.timedOut ?? null,
    severityCounts: analysis.severityCounts ?? null,
    outputExcerpt: safeString(analysis.outputExcerpt ?? "", MAX_TEXT_CHARS),
  };

  const userPrompt = safeString(prompt ?? "", MAX_PROMPT_CHARS);

  return {
    system: [
      "You are a Vyper Guard triage assistant.",
      "Use only the provided analyzer output; do not invent findings.",
      "Return a JSON object only, no markdown or extra text.",
      "If the output is insufficient, say so in notes.",
    ].join(" "),
    user: [
      "Analyze the following Vyper Guard output snapshot and return JSON:",
      "{\n  summary: string,\n  top_risks: Array<{title: string, severity: string, evidence: string}>,\n  suggested_fixes: Array<{title: string, rationale: string}>,\n  confidence: \"low\"|\"medium\"|\"high\",\n  notes: string\n}",
      "Use evidence snippets from the output excerpt.",
      userPrompt ? `User focus: ${userPrompt}` : "",
      "Snapshot:",
      JSON.stringify(payload, null, 2),
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function buildQaPrompt(analysis: AnalysisSnapshot, question: string) {
  const payload = {
    command: analysis.command ?? null,
    preset: analysis.preset ?? null,
    durationMs: analysis.durationMs ?? null,
    exitCode: analysis.exitCode ?? null,
    timedOut: analysis.timedOut ?? null,
    severityCounts: analysis.severityCounts ?? null,
    outputExcerpt: safeString(analysis.outputExcerpt ?? "", MAX_TEXT_CHARS),
  };

  const userQuestion = safeString(question, MAX_PROMPT_CHARS);

  return {
    system: [
      "You are a Vyper Guard triage assistant.",
      "Answer the user using only the provided analyzer output.",
      "If the snapshot does not contain enough evidence, say so.",
      "Keep the answer concise and actionable.",
    ].join(" "),
    user: [
      `Question: ${userQuestion}`,
      "Snapshot:",
      JSON.stringify(payload, null, 2),
    ].join("\n"),
  };
}

export async function POST(request: Request) {
  let body: AssistBody | null = null;
  try {
    body = (await request.json()) as AssistBody;
  } catch {
    body = null;
  }

  if (!body?.mode) {
    return NextResponse.json({ error: "Missing assist mode." }, { status: 400 });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY is not configured." }, { status: 500 });
  }

  const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

  try {
    if (body.mode === "summary") {
      if (!body.analysis) {
        return NextResponse.json({ error: "Missing analysis snapshot." }, { status: 400 });
      }

      const prompt = buildSummaryPrompt(body.analysis, body.prompt);
      const model = process.env.SARVAM_CHAT_MODEL ?? "sarvam-105b";
      const response = await client.chat.completions({
        model: model as unknown,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
      } as any);

      const rawText = String((response as any)?.choices?.[0]?.message?.content ?? "");
      const parsed = rawText ? extractJsonCandidate(rawText) : null;

      return NextResponse.json({ mode: "summary", raw: rawText, parsed });
    }

    if (body.mode === "qa") {
      if (!body.analysis) {
        return NextResponse.json({ error: "Missing analysis snapshot." }, { status: 400 });
      }

      const question = safeString(body.prompt ?? "", MAX_PROMPT_CHARS);
      if (!question.trim()) {
        return NextResponse.json({ error: "Missing question prompt." }, { status: 400 });
      }

      const prompt = buildQaPrompt(body.analysis, question);
      const model = process.env.SARVAM_CHAT_MODEL ?? "sarvam-105b";
      const response = await client.chat.completions({
        model: model as unknown,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
      } as any);

      const rawText = String((response as any)?.choices?.[0]?.message?.content ?? "");
      return NextResponse.json({ mode: "qa", answer: rawText });
    }

    if (body.mode === "translate") {
      const text = safeString(body.text ?? "", MAX_TEXT_CHARS);
      if (!text.trim()) {
        return NextResponse.json({ error: "Missing translation input." }, { status: 400 });
      }

      const target = normalizeLang(body.targetLanguageCode, "hi-IN");
      const response = await client.text.translate({
        input: text,
        source_language_code: "auto",
        target_language_code: target as unknown,
        speaker_gender: (body.speakerGender ?? "Male") as unknown,
      } as any);

      const translatedText = extractTranslationText(response);
      return NextResponse.json({ mode: "translate", translatedText, raw: response });
    }

    if (body.mode === "tts") {
      const text = safeString(body.text ?? "", MAX_TEXT_CHARS);
      if (!text.trim()) {
        return NextResponse.json({ error: "Missing TTS input." }, { status: 400 });
      }

      const target = normalizeLang(body.targetLanguageCode, "hi-IN");
      const ttsModel = process.env.SARVAM_TTS_MODEL ?? "bulbul:v3";
      const speaker = typeof body.speaker === "string" ? body.speaker.trim() : "";
      const response = await client.textToSpeech.convert({
        model: ttsModel as unknown,
        text,
        target_language_code: target as unknown,
        ...(speaker ? { speaker: speaker as unknown } : {}),
      } as any);

      const audioBase64 = extractAudioBase64(response);
      return NextResponse.json({
        mode: "tts",
        audioBase64,
        contentType: "audio/wav",
        model: ttsModel,
        raw: response,
      });
    }

    return NextResponse.json({ error: "Unsupported assist mode." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sarvam request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
