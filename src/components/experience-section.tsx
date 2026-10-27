"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Metric = { value: string; label: string };
type ExperienceEntry = { dates: string; company: string; role: string; description: string; metrics: Metric[]; technologies: string[] };

const experience: ExperienceEntry[] = [
  { dates: "DEC 2025 — PRESENT", company: "PROGRESSIVE", role: "Full Stack Java Developer", description: "Built high-throughput Spring Boot services, Kafka-driven workflows, and React applications for insurance platforms.", metrics: [{ value: "500K+", label: "events / day" }, { value: "30%", label: "faster APIs" }, { value: "45%", label: "faster deployments" }], technologies: ["Java 21", "Spring Boot", "Spring Data JPA", "Microservices", "REST APIs", "Apache Kafka", "React 18", "TypeScript", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Jenkins", "GitHub Actions"] },
  { dates: "JUN 2024 — DEC 2025", company: "WELLS FARGO", role: "Senior Software Engineer", description: "Engineered secure microservices and improved data performance, release automation, and Azure-based deployments.", metrics: [{ value: "35%", label: "faster retrieval" }, { value: "50%", label: "shorter release cycles" }, { value: "99.9%", label: "availability" }], technologies: ["Java", "Spring Boot", "Hibernate / JPA", "Microservices", "REST APIs", "Apache Kafka", "React", "TypeScript", "Oracle", "PostgreSQL", "Microsoft Azure", "Azure AKS", "Docker", "Kubernetes", "Azure DevOps", "Keycloak"] },
  { dates: "JUN 2022 — DEC 2023", company: "MASTERCARD", role: "Software Developer", description: "Developed transaction-processing APIs, optimized data access, and supported full-stack applications.", metrics: [{ value: "500K+", label: "requests / day" }, { value: "30%", label: "lower API latency" }, { value: "200K+", label: "daily users" }], technologies: ["Java", "Spring Boot", "Microservices", "REST APIs", "React", "TypeScript", "MySQL", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "Azure AKS", "Jenkins", "JUnit", "Mockito"] },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => gsap.from(".experience-entry", { opacity: 0, y: 12, duration: .35, stagger: .07, ease: "power1.out", scrollTrigger: { trigger: section, start: "top 84%", toggleActions: "play none none reverse" } }), section);
    return () => context.revert();
  }, []);

  return <section id="experience" className="experience-section section-shell" ref={sectionRef} aria-labelledby="experience-title">
    <div className="experience-heading"><div><p className="section-index">02 / Professional Experience</p><h2 id="experience-title">Experience building software at scale.</h2><p className="experience-description">From transaction-processing systems to cloud-native applications, I&apos;ve worked across the stack to improve performance, reliability, and delivery.</p></div></div>
    <div className="experience-list">{experience.map((entry) => <article className="experience-entry" key={entry.company}><div className="experience-meta"><p>{entry.dates}</p></div><div className="experience-detail"><p className="experience-company">{entry.company}</p><h3>{entry.role}</h3><p className="experience-role-description">{entry.description}</p><div className="experience-metrics" aria-label={`${entry.company} key metrics`}>{entry.metrics.map((metric) => <div className="experience-metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div><div className="experience-tech"><p>Technologies Used</p><div>{entry.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></div></article>)}</div>
    <p className="resume-line">More details in my resume <Link href="/resume/Sahithisri_Cheruku_Resume.docx" download="Sahithisri_Cheruku_Resume.docx">Download Resume <ArrowUpRight size={14} aria-hidden="true" /></Link></p>
  </section>;
}
