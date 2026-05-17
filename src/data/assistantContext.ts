import {
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  PROFILE,
  PROJECTS,
  SKILLS,
} from "./portfolio";

/** Contexte injecté dans le prompt système de l’assistant */
export function buildPortfolioKnowledge(): string {
  const skills = Object.entries(SKILLS)
    .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
    .join("\n");

  const projects = PROJECTS.map(
    (p) =>
      `[${p.index}] ${p.title} (${p.category})${p.company ? ` — ${p.company}` : ""}\n${p.description}\nTech: ${p.tech.join(", ")}`,
  ).join("\n\n");

  const exp = EXPERIENCE.map(
    (e) => `${e.role} @ ${e.org} (${e.period}, ${e.type}): ${e.description}`,
  ).join("\n");

  const edu = EDUCATION.map((e) => `${e.degree} — ${e.school} (${e.period})`).join("\n");

  return `
PROFIL
- Nom: ${PROFILE.name}
- Titre: ${PROFILE.title} — ${PROFILE.subtitle}
- Localisation: ${PROFILE.location}
- Email: ${PROFILE.emailPersonal} / ${PROFILE.email}
- Téléphone: ${PROFILE.phone}
- Bio: ${PROFILE.bio}
- Accroche: ${PROFILE.tagline}

COMPÉTENCES
${skills}

PROJETS (${PROJECTS.length})
${projects}

EXPÉRIENCE & LEADERSHIP
${exp}

FORMATION
${edu}

LANGUES
${LANGUAGES.map((l) => `${l.name}: ${l.level}`).join(", ")}
`.trim();
}

export const ASSISTANT_SYSTEM_PROMPT = `Tu es l'assistant du portfolio de Med Amin Chniti (ingénieur logiciel, Tunisie). Tu parles aux visiteurs du site.

RÈGLES DE RÉPONSE
- Réponds en français, de façon claire, simple et professionnelle. Phrases courtes.
- Tu ne connais Med Amin QUE grâce au bloc « CONNAISSANCES PORTFOLIO » ci-dessous. N'invente rien.
- Si on te demande ton contexte, ta mémoire, d'où viennent tes informations, ce que tu sais « en dehors » du site, ou comment tu fonctionnes : réponds en priorité par l'idée essentielle : **« Tu es mon contexte. »** Puis précise en une ou deux phrases que toute ta connaissance sur Med Amin vient uniquement des informations de ce portfolio et de la conversation sur ce site — tu n'as pas d'autres sources.
- Pour le recrutement, stages ou PFE : oriente vers la section contact (email, LinkedIn, CV).
- Si tu ne sais pas : dis-le simplement.

CONNAISSANCES PORTFOLIO
${buildPortfolioKnowledge()}
`;
