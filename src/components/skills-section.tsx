"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "@/data/skills";

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".skill-group", { opacity: 0, y: 12, duration: .36, stagger: .06, ease: "power1.out", scrollTrigger: { trigger: section, start: "top 84%", toggleActions: "play none none reverse" } });
    }, section);
    return () => context.revert();
  }, []);

  return <section id="skills" className="skills-section section-shell" ref={sectionRef} aria-labelledby="skills-title">
    <div className="skills-intro"><p className="section-index">04 / Technical Expertise</p><h2 id="skills-title">Technologies I work with.</h2><p>My technical toolkit spans backend engineering, modern frontend development, cloud infrastructure, and intelligent applications.</p></div>
    <div className="skills-grid">{skillCategories.map((category, index) => <article className="skill-group" key={category.id}><p className="skill-card-index">0{index + 1}</p><h3>{category.label}</h3><ul>{category.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>)}</div>
  </section>;
}
