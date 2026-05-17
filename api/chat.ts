import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatHttpError, handleChat } from "../lib/chatHandler";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? (JSON.parse(req.body) as { messages?: { role: string; content: string }[] })
        : (req.body as { messages?: { role: string; content: string }[] });
    const { messages } = body ?? {};
    const result = await handleChat(messages ?? []);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof ChatHttpError) {
      return res.status(err.status).json({
        error: err.message,
        ...(err.detail ? { detail: err.detail } : {}),
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
