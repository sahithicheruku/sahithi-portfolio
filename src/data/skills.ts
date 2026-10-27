export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

// Sourced from the portfolio brief; verify against the latest resume before publishing.
export const skillCategories: SkillCategory[] = [
  { id: "backend", label: "Backend & Distributed Systems", skills: ["Java", "Spring Boot", "Microservices", "REST APIs", "Apache Kafka", "Spring Security", "Redis"] },
  { id: "frontend", label: "Frontend Development", skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"] },
  { id: "databases", label: "Databases", skills: ["PostgreSQL", "MySQL", "MongoDB", "Oracle SQL", "Prisma"] },
  { id: "cloud", label: "Cloud & DevOps", skills: ["AWS", "Microsoft Azure", "Docker", "Git", "GitHub", "CI/CD"] },
  { id: "ai", label: "AI & Machine Learning", skills: ["Python", "FastAPI", "Natural Language Processing", "Sentence Transformers", "spaCy", "LangChain", "OpenAI API"] },
];
