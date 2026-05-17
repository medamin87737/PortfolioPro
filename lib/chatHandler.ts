import { ASSISTANT_SYSTEM_PROMPT } from "../src/data/assistantContext.ts";

const KEY_PLACEHOLDER = /votre-cle|your[_-]?key|xxx|changeme/i;

const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-1.2b-instruct:free";

const FALLBACK_MODELS = [
  PRIMARY_MODEL,
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
].filter((m, i, arr) => arr.indexOf(m) === i);

export class ChatHttpError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function siteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:5173";
}

function parseOpenRouterError(raw: string): string {
  try {
    const body = JSON.parse(raw) as { error?: { message?: string } | string };
    if (typeof body.error === "object" && body.error?.message) return body.error.message;
    if (typeof body.error === "string") {
      try {
        const nested = JSON.parse(body.error) as { error?: { message?: string } };
        if (nested.error?.message) return nested.error.message;
      } catch {
        return body.error;
      }
    }
  } catch {
    /* texte brut */
  }
  return raw.length > 180 ? `${raw.slice(0, 180)}…` : raw;
}

export function hasOpenRouterKey(): boolean {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  return Boolean(key && !KEY_PLACEHOLDER.test(key));
}

export async function handleChat(
  messages: { role: string; content: string }[],
): Promise<{ reply: string; model: string }> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();

  if (!OPENROUTER_API_KEY) {
    throw new ChatHttpError(
      503,
      "Clé API manquante. Ajoutez OPENROUTER_API_KEY dans les variables Vercel.",
    );
  }

  if (KEY_PLACEHOLDER.test(OPENROUTER_API_KEY)) {
    throw new ChatHttpError(503, "Clé API invalide (valeur d'exemple).");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ChatHttpError(400, "messages requis");
  }

  const apiMessages = [
    { role: "system" as const, content: ASSISTANT_SYSTEM_PROMPT },
    ...messages
      .filter((m) => m?.role && m?.content)
      .slice(-12)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: String(m.content).slice(0, 4000),
      })),
  ];

  const SITE_URL = siteUrl();
  let lastError: unknown = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": SITE_URL,
          "X-Title": "Med Amin Chniti Portfolio",
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          max_tokens: 512,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        const message = parseOpenRouterError(errText);
        lastError = `${model}: ${response.status} — ${message}`;

        if (response.status === 401) {
          throw new ChatHttpError(
            401,
            "Clé OpenRouter refusée. Vérifiez OPENROUTER_API_KEY sur Vercel.",
            message,
          );
        }

        if (response.status === 404 || response.status === 429) continue;

        throw new ChatHttpError(
          response.status,
          message || `Erreur OpenRouter (${response.status})`,
        );
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        lastError = `${model}: réponse vide`;
        continue;
      }

      return { reply, model };
    } catch (err) {
      if (err instanceof ChatHttpError) throw err;
      lastError = err;
      continue;
    }
  }

  console.error("OpenRouter échec:", lastError);
  throw new ChatHttpError(502, "Modèle indisponible. Réessayez plus tard.");
}
