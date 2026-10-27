"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const expertise = ["Backend Engineering", "Full Stack Development", "Distributed Systems", "Cloud & DevOps", "AI-Powered Applications"];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".about-reveal", {
        opacity: 0,
        y: 14,
        duration: 0.38,
        stagger: 0.06,
        ease: "power1.out",
        scrollTrigger: { trigger: section, start: "top 84%", toggleActions: "play none none reverse" },
      });
      gsap.from(".expertise-row", {
        opacity: 0,
        x: 10,
        duration: 0.3,
        stagger: 0.05,
        ease: "power1.out",
        scrollTrigger: { trigger: ".expertise-list", start: "top 90%", toggleActions: "play none none reverse" },
      });
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section id="about" className="about-section section-shell" ref={sectionRef} aria-labelledby="about-title">
      <div className="about-main">
        <p className="section-index about-reveal">01 / About Me</p>
        <h2 id="about-title" className="about-title about-reveal">Engineering with purpose.<br /><em>Building with precision.</em></h2>
        <div className="about-copy about-reveal">
          <p>I&apos;m Sahithisri Cheruku, a Software Engineer with 4+ years of experience building backend systems and full-stack applications.</p>
          <p>My work focuses on Java, Spring Boot, microservices, REST APIs, React, TypeScript, and distributed systems. I solve complex engineering problems, improve application performance, and build reliable software.</p>
          <p>I also explore AI-powered solutions, combining modern web technologies with intelligent application features.</p>
        </div>
      </div>
      <aside className="about-aside about-reveal" aria-label="Education and areas of expertise">
        <div className="about-detail">
          <p className="detail-label">Education</p>
          <p className="detail-title">Master of Science in Computer Science</p>
          <p className="detail-meta">Southern Methodist University<br />Dallas, Texas</p>
        </div>
        <div className="about-detail">
          <p className="detail-label">Core Expertise</p>
          <ul className="expertise-list">
            {expertise.map((item, index) => <li className="expertise-row" key={item}><span>0{index + 1}</span>{item}</li>)}
          </ul>
        </div>
      </aside>
    </section>
  );
}
