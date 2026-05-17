import type { VercelRequest, VercelResponse } from "@vercel/node";
import { hasOpenRouterKey } from "../lib/chatHandler";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, hasKey: hasOpenRouterKey() });
}
