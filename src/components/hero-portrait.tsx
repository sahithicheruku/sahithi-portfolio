"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroPortrait() {
  const [source, setSource] = useState("/images/sahithisri-portrait-elbows.png");
  return <div className="hero-cutout" aria-hidden="true"><Image src={source} alt="" fill priority sizes="(max-width: 760px) 86vw, 44vw" onError={() => setSource("/images/sahithi-potrait-color.jpeg")} /></div>;
}
