"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

const homepageProjectDetails = {
  pulseops: { category: "Backend Engineering / Distributed Systems", description: "An event-driven transaction-processing platform built with Spring Boot, Kafka, PostgreSQL, and Redis, featuring secure APIs, transaction lifecycle management, and containerized infrastructure." },
  jobsync: { category: "Applied AI / Full-Stack Engineering", description: "An AI-assisted job management platform integrating application tracking with resume analysis, semantic job matching, and skills-gap insights using Python-based NLP services." },
  lendloop: { category: "Full-Stack Product Engineering", description: "A community lending platform with authenticated users, item discovery, ownership-aware borrowing requests, approval workflows, and return management." },
} as const;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => { gsap.from(".project-card", { opacity: 0, y: 16, duration: .4, stagger: .1, ease: "power1.out", scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none reverse" } }); }, section);
    return () => context.revert();
  }, []);
  return <section id="projects" className="projects-section section-shell" ref={sectionRef} aria-labelledby="projects-title">
    <div className="projects-intro"><p className="section-index">03 / SELECTED PROJECTS</p><h2 id="projects-title">Selected engineering work.</h2><p>A collection of projects exploring distributed systems, full-stack engineering, and AI-powered applications.</p></div>
    <div className="project-list">{projects.map((project, index) => { const details = homepageProjectDetails[project.slug as keyof typeof homepageProjectDetails]; return <article className="project-card" key={project.slug}>
      <div className="project-content"><div className="project-heading-row"><p className="project-number">0{index + 1}</p><p className="project-category">{details.category}</p></div><h3>{project.name}</h3><p className="project-description">{details.description}</p><div className="project-footer"><p className="project-tech-label">Technologies Used</p><div className="project-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><div className="project-actions"><Link className="text-link" href={`/projects/${project.slug}`}>View Case Study <ArrowUpRight size={15} aria-hidden="true" /></Link>{project.links.map((link) => <a className="project-link" href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label === "Live Demo" ? "Live Website" : link.label} <ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div></div>
    </article>; })}</div>
  </section>;
}
