export type ProjectLink = { label: "GitHub" | "Live Demo"; href: string };

export type Project = {
  slug: string;
  name: string;
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  links: ProjectLink[];
  caseStudyLinks?: ProjectLink[];
  verificationNote?: string;
};

export const projects: Project[] = [
  {
    slug: "pulseops",
    name: "PulseOps",
    title: "PulseOps — Transaction Processing Platform",
    description: "A full-stack transaction processing platform designed around REST APIs, asynchronous event processing, transaction lifecycle management, and reliable backend workflows.",
    technologies: ["Java 21", "Spring Boot", "Apache Kafka", "PostgreSQL", "Redis", "Docker", "React", "TypeScript"],
    highlights: ["Spring Boot microservices architecture.", "Kafka-based transaction events.", "PostgreSQL persistence.", "Redis-backed idempotency and rate limiting.", "JWT-secured API access.", "Automated backend testing."],
    links: [],
    caseStudyLinks: [{ label: "GitHub", href: "https://github.com/sahithicheruku/pulseops" }],
    verificationNote: "Detailed case-study content and public links will be added when verified project materials are available.",
  },
  {
    slug: "jobsync",
    name: "JobSync",
    title: "JobSync — AI-Powered Job Tracker",
    description: "An AI-assisted job tracking application combining resume analysis, job matching, and application management.",
    technologies: ["Next.js", "React", "TypeScript", "Python", "FastAPI", "spaCy", "Sentence Transformers", "PostgreSQL / SQLite"],
    highlights: ["Resume and job-description analysis.", "Semantic matching using NLP embeddings.", "ATS compatibility scoring.", "Skill gap identification.", "Application tracking dashboard.", "AI-generated improvement suggestions."],
    links: [],
    verificationNote: "Repository-specific implementation details and public links are pending verification.",
  },
  {
    slug: "lendloop",
    name: "LendLoop",
    title: "LendLoop — Community Item Lending Platform",
    description: "A community lending platform that enables users to list items, discover shared inventory, request borrowing, and manage approvals and returns.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS"],
    highlights: ["Google authentication.", "Shared inventory browsing.", "Item creation and management.", "Borrowing request workflows.", "Approval and return lifecycle.", "PostgreSQL and Prisma persistence."],
    links: [
      { label: "Live Demo", href: "https://lend-loop-bay.vercel.app/" },
      { label: "GitHub", href: "https://github.com/sahithicheruku/LendLoop" },
    ],
  },
];
