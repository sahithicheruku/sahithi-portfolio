"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";
import gsap from "gsap";

type PortraitRevealProps = {
  baseImage?: string;
  revealImage?: string;
  altText: string;
  revealRadius?: number;
};

export function PortraitReveal({ baseImage, revealImage, altText, revealRadius = 115 }: PortraitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 50, y: 50, radius: 0 });
  const currentRef = useRef({ x: 50, y: 50, radius: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.fromTo(container, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : 1, ease: "power2.out" });
    }, container);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      context.revert();
    };
  }, []);

  function animateReveal() {
    if (frameRef.current !== null || !revealRef.current) return;
    const tick = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      current.radius += (target.radius - current.radius) * 0.22;
      revealRef.current?.style.setProperty("--reveal-x", `${current.x}%`);
      revealRef.current?.style.setProperty("--reveal-y", `${current.y}%`);
      revealRef.current?.style.setProperty("--reveal-radius", `${current.radius}px`);
      if (Math.abs(target.radius - current.radius) > 0.2 || Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = null;
    };
    frameRef.current = requestAnimationFrame(tick);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!revealImage || event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !revealRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    targetRef.current = { x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100, radius: revealRadius };
    animateReveal();
  }

  function handlePointerLeave() {
    if (!revealImage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    targetRef.current.radius = 0;
    animateReveal();
  }

  return (
    <div className="portrait-reveal" ref={containerRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div className="portrait-placeholder" aria-hidden={Boolean(baseImage)}>
        <span>Portrait<br />to come</span>
      </div>
      {baseImage && <Image className="portrait-image portrait-base" src={baseImage} alt={altText} fill sizes="(max-width: 700px) 90vw, 50vw" />}
      {revealImage && <div className="portrait-reveal-layer" ref={revealRef}>
        <Image className="portrait-image" src={revealImage} alt="" fill sizes="(max-width: 700px) 90vw, 50vw" />
      </div>}
      {!baseImage && <span className="sr-only">{altText} is not available yet.</span>}
      <div className="portrait-caption" aria-hidden="true"><span>01</span><span>Sahithisri<br />Cheruku</span></div>
    </div>
  );
}
