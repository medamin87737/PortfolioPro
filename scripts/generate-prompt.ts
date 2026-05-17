import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ASSISTANT_SYSTEM_PROMPT } from "../src/data/assistantContext.ts";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "systemPrompt.json");
writeFileSync(out, JSON.stringify({ prompt: ASSISTANT_SYSTEM_PROMPT }), "utf8");
console.log("✓ lib/systemPrompt.json généré");
