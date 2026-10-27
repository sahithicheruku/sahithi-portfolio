"use client";

import { ArrowDown, Download } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function HeroContent() {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(".hero-label", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : .6, ease: "power2.out" });
      gsap.fromTo(".hero-title", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : .8, delay: reduced ? 0 : .1, ease: "power2.out" });
      gsap.fromTo([".hero-subtitle", ".hero-copy"], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : .6, delay: reduced ? 0 : .25, stagger: reduced ? 0 : .08, ease: "power2.out" });
      gsap.fromTo(".hero-actions", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : .6, delay: reduced ? 0 : .4, ease: "power2.out" });
    }, contentRef);
    return () => context.revert();
  }, []);

  return <div className="hero-content" ref={contentRef}>
    <p className="eyebrow hero-label">Software Engineer / Full Stack Developer</p>
    <h1 className="hero-title" id="hero-title">Hi, I&apos;m<br /><em>Sahithisri.</em></h1>
    <p className="hero-subtitle">Engineering scalable systems and thoughtful digital experiences.</p>
    <p className="hero-copy">Software Engineer specializing in Java, Spring Boot, distributed systems, React, and AI-powered applications.</p>
    <div className="hero-actions">
      <a className="button button-primary" href="#projects">View My Work <ArrowDown size={16} aria-hidden="true" /></a>
      <a className="button button-resume" href="/resume/Sahithisri_Cheruku_Resume.docx" download="Sahithisri_Cheruku_Resume.docx"><Download size={16} aria-hidden="true" /> Download Resume</a>
    </div>
    <div className="hero-scroll-cue" aria-hidden="true"><span /> Scroll to explore</div>
  </div>;
}
