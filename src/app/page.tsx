import { SiteHeader } from "@/components/site-header";
import { HeroContent } from "@/components/hero-content";
import { HeroPortrait } from "@/components/hero-portrait";
import { AboutSection } from "@/components/about-section";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ContactSection } from "@/components/contact-section";

const technologies = ["Java", "Spring Boot", "React", "TypeScript", "Next.js", "PostgreSQL", "Kafka", "Docker", "AI / ML"];
export default function Home() {
  return <>
    <SiteHeader />
    <main>
      <section id="home" className="hero section-shell" aria-labelledby="hero-title">
        <HeroContent />
        <HeroPortrait />
        <aside className="hero-rail" aria-label="Portfolio overview">
          <section><p>About me</p><span>Backend-focused engineer building reliable systems and thoughtful product experiences.</span><a href="#about">Learn more <span aria-hidden="true">↗</span></a></section>
          <section><p>My work</p><span>Explore projects across distributed systems, full-stack engineering, and AI applications.</span><a href="#projects">Browse projects <span aria-hidden="true">↗</span></a></section>
          <section><p>Follow me</p><span>Professional links will be added when verified profiles are available.</span></section>
        </aside>
      </section>
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </main>
    <footer className="site-footer section-shell"><span>© {new Date().getFullYear()} Sahithisri Cheruku</span><div>{technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></footer>
  </>;
}
