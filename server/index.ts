import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { ChatHttpError, handleChat, hasOpenRouterKey } from "../lib/chatHandler.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, "src", ".env") });

const PORT = Number(process.env.PORT) || 8080;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasKey: hasOpenRouterKey() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body as { messages?: { role: string; content: string }[] };
    const result = await handleChat(messages ?? []);
    return res.json(result);
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
});

app.listen(PORT, () => {
  console.log(`Assistant API → http://localhost:${PORT}`);
  if (!hasOpenRouterKey()) {
    console.warn("⚠ Ajoutez OPENROUTER_API_KEY dans src/.env");
  }
});
