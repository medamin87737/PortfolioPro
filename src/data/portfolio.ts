export const ASSETS = {
  video: "/assets/Face_Swap_A_person_with_dark_hair_and_a_light_complexion_7iTHO-AE.mp4",
  cv: "/assets/Med%20Amin%20Chniti%20-%20cv%20(1).pdf",
  models: {
    hackerRoom: "/assets/isometric_hacker_room.glb",
    hack: "/assets/hack.glb",
    icon: "/assets/icon_for_the_web_on_white_background.glb",
    programmer: "/assets/lost_programmer.glb",
    laptop: "/assets/gaming_laptop.glb",
  },
} as const;

/** Une section = un modèle 3D + une caméra dédiée */
export const SCROLL_SECTIONS = [
  {
    id: "home",
    label: "Accueil",
    modelKey: "programmer" as const,
    scale: 2.8,
    position: [0, 0, 0] as const,
    camera: { position: [0, 4, 12] as const, target: [0, 0.5, 0] as const, fov: 42 },
  },
  {
    id: "about",
    label: "Hack Terminal",
    modelKey: "hack" as const,
    scale: 2.8,
    position: [0, 0, 0] as const,
    camera: { position: [6, 4, 8] as const, target: [0, 0.5, 0] as const, fov: 40 },
  },
  {
    id: "skills",
    label: "Compétences",
    modelKey: "icon" as const,
    scale: 3.5,
    position: [0, 0, 0] as const,
    camera: { position: [0, 5, 10] as const, target: [0, 0, 0] as const, fov: 45 },
  },
  {
    id: "projects",
    label: "Hacker Room",
    modelKey: "hackerRoom" as const,
    scale: 2.4,
    position: [0, -0.4, 0] as const,
    camera: { position: [-6, 5.5, 8.5] as const, target: [0, 0.5, 0] as const, fov: 38 },
  },
  {
    id: "experience",
    label: "Parcours",
    modelKey: "hackerRoom" as const,
    scale: 2.4,
    position: [0, -0.4, 0] as const,
    camera: { position: [0, 3, 10] as const, target: [0, 0.5, 0] as const, fov: 42 },
  },
  {
    id: "contact",
    label: "Contact",
    modelKey: "laptop" as const,
    scale: 0.22,
    position: [0, -0.5, 0] as const,
    camera: { position: [4, 3, 9] as const, target: [0, 0.5, 0] as const, fov: 40 },
  },
] as const;

export const PROFILE = {
  name: "Med Amin Chniti",
  title: "Ingénieur Logiciel",
  subtitle: "Full Stack • DevOps • IA",
  tagline:
    "Transformer la complexité technique en systèmes simples, robustes et maîtrisés.",
  heroTagline: "Systèmes full stack, cloud-native & IA.",
  heroStack: ["Java", "React", "NestJS", "Docker", "K8s", "IA"],
  bio: `Étudiant ingénieur en informatique spécialisé en Full Stack, microservices et DevOps. Je combine curiosité technique, rapidité d'apprentissage et capacité d'adaptation pour contribuer à des projets ambitieux.`,
  location: "Tunis, Tunisie",
  email: "Medamin.Chniti@esprit.tn",
  emailPersonal: "med.amin.chniti@gmail.com",
  phone: "+216 54559210",
};

export const SOCIAL_LINKS = [
  {
    id: "gmail",
    href: "mailto:med.amin.chniti@gmail.com",
    icon: "fa-brands fa-google",
    label: "Gmail",
    external: false,
  },
  {
    id: "outlook",
    href: "mailto:Medamin.Chniti@esprit.tn",
    icon: "fa-brands fa-microsoft",
    label: "Outlook",
    external: false,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/med-amin-chniti-08a3562a2/",
    icon: "fa-brands fa-linkedin-in",
    label: "LinkedIn",
    external: true,
  },
  {
    id: "github",
    href: "https://github.com/medamin87737",
    icon: "fa-brands fa-github",
    label: "GitHub",
    external: true,
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/amin.ch.73744?locale=fr_FR",
    icon: "fa-brands fa-facebook-f",
    label: "Facebook",
    external: true,
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/amiin_ch_/",
    icon: "fa-brands fa-instagram",
    label: "Instagram",
    external: true,
  },
  {
    id: "whatsapp",
    href: "https://wa.me/21654559210",
    icon: "fa-brands fa-whatsapp",
    label: "WhatsApp",
    external: true,
  },
] as const;

export const SKILLS = {
  languages: ["Java", "TypeScript", "Python", "C", "JavaScript", "HTML", "CSS"],
  frameworks: ["Spring Boot", "REST APIs", "React.js", "Angular", "NestJS"],
  databases: ["MySQL", "MongoDB", "H2"],
  devops: ["Docker", "Kubernetes", "CI/CD", "Nginx", "Git", "SonarQube", "Monitoring"],
  ai: ["LLM Integration", "NLP", "Machine Learning", "XGBoost", "Scikit-learn"],
  security: ["Spring Security", "OAuth2/Keycloak", "JWT"],
  methodologies: [
    "Architecture Microservices",
    "Clean Code",
    "Agile",
    "Git Workflow",
    "API Design",
  ],
  soft: [
    "Résolution de problèmes",
    "Travail en équipe",
    "Communication",
    "Gestion du temps",
    "Adaptabilité",
  ],
};

export type Project = {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  tech: string[];
  cta: string;
  accent?: string;
  featured?: boolean;
  company?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "parking-c",
    index: "01",
    category: "Desktop · Langage C",
    title: "Gestion de parking (console / desktop)",
    description:
      "Logiciel de gestion de parc de stationnement développé en C : modélisation des places, flux véhicules, calcul des durées et des montants, persistance structurée et interface utilisateur sobre orientée efficacité.",
    tech: ["C", "Structures", "Fichiers", "Algorithmes"],
    cta: "Application Desktop",
    accent: "var(--accent)",
  },
  {
    id: "events-javafx",
    index: "02",
    category: "Event Management",
    title: "Gestion des Événements",
    description:
      "Plateforme JavaFX d'organisation d'événements. Planification, gestion des participants, notifications automatiques et tableau de bord analytique.",
    tech: ["JavaFX", "Java", "Event Driven", "Scheduler"],
    cta: "Application Desktop",
    accent: "var(--accent-2)",
  },
  {
    id: "ml-models",
    index: "03",
    category: "Machine Learning",
    title: "Modèles ML Prédictifs",
    description:
      "3 modèles Machine Learning : XGBoost (classification), DBSCAN (clustering non-supervisé), Régression Linéaire (prédiction). Visualisations interactives des résultats.",
    tech: ["Python", "XGBoost", "DBSCAN", "Scikit-learn", "Pandas"],
    cta: "Data Science",
    accent: "var(--accent-3)",
  },
  {
    id: "fullstack-web",
    index: "04",
    category: "Full Stack Web",
    title: "Application Web Full Stack",
    description:
      "Application web hébergée avec frontend React JSX et backend Python. API RESTful robuste, auth sécurisée et déploiement cloud avec CI/CD automatisé.",
    tech: ["React JSX", "Python", "REST API", "Docker", "Hébergé"],
    cta: "Web App",
    accent: "var(--accent-2)",
  },
  {
    id: "edu-microservices",
    index: "05",
    category: "Architecture microservices · Éducation",
    title: "Plateforme éducative microservices",
    description:
      "Écosystème découpé en services : Spring Cloud Netflix Eureka pour le registre, passerelle API (API Gateway), Keycloak pour l'identité (OIDC/OAuth2), Config Server pour centraliser la configuration, backends Spring Boot et NestJS, front React, données relationnelles sous H2/SQL et documents sous MongoDB — pensé comme un socle pédagogique complet pour le cloud-native.",
    tech: ["Eureka", "API GW", "Keycloak", "Config", "Spring Boot", "NestJS", "React", "H2", "MongoDB"],
    cta: "Microservices",
    accent: "var(--accent)",
  },
  {
    id: "ecommerce",
    index: "06",
    category: "E-commerce Full Stack",
    title: "Plateforme e-commerce (React · Spring Boot · MongoDB)",
    description:
      "Application e-commerce complète avec catalogue produits, panier, gestion des commandes et authentification. Frontend React, API Spring Boot et persistance NoSQL MongoDB pour un flux transactionnel fluide.",
    tech: ["React", "Spring Boot", "MongoDB", "REST API", "JWT"],
    cta: "E-commerce App",
    accent: "var(--accent-2)",
  },
  {
    id: "job-platform",
    index: "07",
    category: "Emploi Microservices",
    title: "Plateforme de recherche d'emploi microservices",
    description:
      "Solution de recrutement complète front et back, organisée en microservices. Gestion des offres, candidatures, profils et notifications, avec architecture distribuée et APIs sécurisées.",
    tech: ["Spring Boot", "Angular", "SQL", "Microservices", "API Gateway"],
    cta: "Job Platform",
    accent: "var(--accent)",
  },
  {
    id: "events-web",
    index: "08",
    category: "Event Management Web",
    title: "Application d'événements (Angular · Spring Boot · SQL)",
    description:
      "Application web de gestion d'événements : création, planification, inscriptions et suivi. Architecture full stack avec frontend Angular, backend Spring Boot et base relationnelle SQL.",
    tech: ["Angular", "Spring Boot", "SQL", "REST"],
    cta: "Event App",
    accent: "var(--accent-2)",
  },
  {
    id: "cafe-backend",
    index: "09",
    category: "Cafe Management Backend",
    title: "Backend de gestion de cafe (Spring Boot · SQL)",
    description:
      "API backend pour un système de gestion de café : menu, commandes, stock et suivi des ventes. Conception orientée services avec persistance SQL et endpoints REST.",
    tech: ["Spring Boot", "SQL", "REST API", "JPA"],
    cta: "Backend API",
    accent: "var(--accent)",
  },
  {
    id: "maghrebia",
    index: "10",
    category: "⭐ Projet phare · IA + DevOps enterprise",
    title: "Maghrebia Assurance — recommandation IA des collaborateurs",
    company: "Maghrebia Assurance",
    description:
      "Solution métier hébergée pour Maghrebia Assurance : moteur de recommandation de profils avec modèles IA (LLM, NLP) et orchestration d'APIs d'inférence tierces. Chaîne DevOps bout-en-bout — CI/CD, webhooks, cluster Kubernetes (dont deux worker nodes), observabilité Grafana / Prometheus / Alertmanager, qualité SonarQube, Vitest sur le front, Nginx en frontal. Interface React (TSX) + Vite, API NestJS, MongoDB Compass en local et Atlas en production, microservice Python dédié au scoring de recommandation.",
    tech: [
      "React TSX",
      "Vite",
      "NestJS",
      "MongoDB Atlas",
      "Python",
      "LLM+NLP",
      "APIs inférence",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "Grafana",
      "Prometheus",
      "Nginx",
      "SonarQube",
      "Webhooks",
    ],
    cta: "Enterprise App",
    accent: "var(--accent-3)",
    featured: true,
  },
];

export type ExperienceItem = {
  id: string;
  role: string;
  org: string;
  period: string;
  description: string;
  type: string;
  accent?: string;
};

export type EducationItem = {
  id: string;
  degree: string;
  school: string;
  period: string;
  level: string;
  accent?: string;
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "aero-president",
    role: "Président",
    org: "Aero ESPRIT Club",
    period: "En cours",
    type: "Leadership",
    description:
      "Gestion et coordination des activités, organisation d'événements techniques et compétitions, leadership et collaboration sur projets innovants.",
    accent: "var(--accent-3)",
  },
  {
    id: "hermes-vp",
    role: "Vice-Président",
    org: "Club Hermès — ISET Sousse",
    period: "2023 — 2024",
    type: "Leadership",
    description: "Coordination d'activités étudiantes et développement du leadership.",
    accent: "var(--accent-3)",
  },
  {
    id: "tunisie-telecom",
    role: "Stagiaire",
    org: "Tunisie Telecom — Siliana",
    period: "2022 – Oct 2025",
    type: "Stage",
    description:
      "Support technique, maintenance et suivi des infrastructures télécom en environnement professionnel.",
    accent: "var(--accent)",
  },
  {
    id: "profit-bikes-pfe",
    role: "Stagiaire IoT (PFE)",
    org: "Profit Bikes — Sousse",
    period: "Fév 2024 – Juin 2024",
    type: "PFE",
    description:
      "Développement d'un système IoT de gestion des incendies et sécheresse avec drone et capteurs intelligents.",
    accent: "var(--accent-2)",
  },
  {
    id: "draexlmaier",
    role: "Stagiaire",
    org: "DRÄXLMAIER Group — Siliana",
    period: "Fév 2023",
    type: "Stage",
    description:
      "Système de détection de pannes pour machines de sertissage industrielles.",
    accent: "var(--accent)",
  },
  {
    id: "steg",
    role: "Stagiaire",
    org: "STEG — Siliana",
    period: "Fév 2023",
    type: "Stage",
    description:
      "Observation des opérations techniques sur réseaux électriques et procédures de maintenance.",
    accent: "var(--accent)",
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: "esprit-ing",
    degree: "Diplôme National d'Ingénieur en Génie Logiciel",
    school: "ESPRIT — Tunisie",
    period: "Sep 2024 — En cours",
    level: "Ingénieur",
    accent: "var(--accent)",
  },
  {
    id: "iset-licence",
    degree: "Licence en Systèmes Embarqués",
    school: "ISET Sousse — Tunisie",
    period: "Sep 2021 — Juin 2024",
    level: "Licence",
    accent: "var(--accent-2)",
  },
  {
    id: "bac-tech",
    degree: "Baccalauréat Technique",
    school: "Lycée Technique, Siliana",
    period: "2020 — 2021",
    level: "Baccalauréat",
    accent: "var(--accent-3)",
  },
];

export const LANGUAGES = [
  { name: "Arabe", level: "Natif" },
  { name: "Anglais", level: "B2" },
  { name: "Français", level: "B2" },
];

export const NAV_LINKS = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
  { id: "experience", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

/** Métadonnées UX — rôle et structure de chaque section */
export const SECTION_META: Record<
  (typeof NAV_LINKS)[number]["id"],
  { index: string; role: string; title: string; titleAccent?: string; subtitle: string }
> = {
  home: {
    index: "01",
    role: "Accueil",
    title: "Med Amin Chniti",
    subtitle: "Ingénieur logiciel — présentation et accès rapide",
  },
  about: {
    index: "02",
    role: "À propos",
    title: "Ingénieur qui",
    titleAccent: "construit",
    subtitle: "Parcours, vision et chiffres clés",
  },
  skills: {
    index: "03",
    role: "Compétences",
    title: "Stack",
    titleAccent: "technique",
    subtitle: "Langages, outils, méthodologies et soft skills",
  },
  projects: {
    index: "04",
    role: "Projets",
    title: "Réalisations",
    titleAccent: "ambitieuses",
    subtitle: "Projets académiques, PFE et solutions full stack",
  },
  experience: {
    index: "05",
    role: "Parcours",
    title: "Expérience &",
    titleAccent: "formation",
    subtitle: "Stages, leadership, diplômes et langues",
  },
  contact: {
    index: "06",
    role: "Contact",
    title: "Travaillons",
    titleAccent: "ensemble",
    subtitle: "Échange, opportunités et téléchargement du CV",
  },
};
