/** Extrait un message lisible depuis la réponse d'erreur de l'API chat */
export function parseChatError(raw?: string, status?: number): string {
  if (!raw?.trim()) {
    if (status === 401) return "Clé OpenRouter invalide. Mettez votre vraie clé dans src/.env";
    if (status === 503) return "Clé API manquante ou invalide dans src/.env";
    if (status === 502) return "Modèle indisponible. Réessayez dans un instant.";
    return "Erreur serveur. Lancez npm run dev:all (front + API).";
  }

  try {
    const body = JSON.parse(raw) as { error?: string; detail?: string };
    const main = body.detail ? `${body.error ?? "Erreur"} — ${body.detail}` : body.error;
    if (main) {
      try {
        const nested = JSON.parse(main) as { error?: { message?: string } };
        if (nested.error?.message) return nested.error.message;
      } catch {
        /* texte simple */
      }
      return main;
    }
  } catch {
    /* corps non JSON */
  }

  return raw.length > 220 ? `${raw.slice(0, 220)}…` : raw;
}
