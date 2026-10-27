"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import React, { Suspense, useMemo, useRef } from "react";
import type { Group, Mesh, Object3D } from "three";
import { MathUtils } from "three";
import type { AvatarConfig } from "@/data/avatar-config";
import { defaultAvatarConfig } from "@/data/avatar-config";

type AvatarSceneProps = { modelSrc?: string; config?: AvatarConfig; className?: string; altText?: string };

const findNamedObject = (objects: Object3D[], names: string[]) => objects.find((object) => names.some((name) => object.name.toLowerCase() === name.toLowerCase()));

function AvatarModel({ modelSrc, config, reducedMotion }: { modelSrc: string; config: AvatarConfig; reducedMotion: boolean }) {
  const { scene } = useGLTF(modelSrc);
  const rootRef = useRef<Group>(null);
  const objects = useMemo(() => {
    const result: Object3D[] = [];
    scene.traverse((object) => result.push(object));
    return result;
  }, [scene]);
  const head = useMemo(() => findNamedObject(objects, config.bones.head), [objects, config]);
  const eyes = useMemo(() => [findNamedObject(objects, config.bones.leftEye), findNamedObject(objects, config.bones.rightEye)].filter((eye): eye is Object3D => Boolean(eye)), [objects, config]);
  const blinkMeshes = useMemo(() => objects.filter((object): object is Mesh => Boolean((object as Mesh).morphTargetDictionary && (object as Mesh).morphTargetInfluences)), [objects]);

  useFrame(({ pointer, clock }) => {
    if (!rootRef.current || reducedMotion) return;
    rootRef.current.rotation.y = MathUtils.lerp(rootRef.current.rotation.y, MathUtils.clamp(pointer.x * MathUtils.degToRad(6), -MathUtils.degToRad(6), MathUtils.degToRad(6)), 0.08);
    rootRef.current.rotation.x = MathUtils.lerp(rootRef.current.rotation.x, MathUtils.clamp(-pointer.y * MathUtils.degToRad(4), -MathUtils.degToRad(4), MathUtils.degToRad(4)), 0.08);
    if (head) {
      head.rotation.y = MathUtils.lerp(head.rotation.y, pointer.x * MathUtils.degToRad(6), 0.1);
      head.rotation.x = MathUtils.lerp(head.rotation.x, -pointer.y * MathUtils.degToRad(4), 0.1);
    }
    eyes.forEach((eye) => { eye.rotation.y = MathUtils.lerp(eye.rotation.y, MathUtils.clamp(pointer.x * MathUtils.degToRad(10), -MathUtils.degToRad(10), MathUtils.degToRad(10)), 0.12); });
    const blink = Math.max(0, Math.sin(clock.elapsedTime * 0.8) ** 32);
    blinkMeshes.forEach((mesh) => {
      const dictionary = mesh.morphTargetDictionary;
      if (!dictionary || !mesh.morphTargetInfluences) return;
      config.blendshapes.blink.forEach((name) => { const index = dictionary[name]; if (index !== undefined) mesh.morphTargetInfluences![index] = blink; });
    });
  });

  return <group ref={rootRef}><primitive object={scene} /></group>;
}

class AvatarErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

export function AvatarScene({ modelSrc, config = defaultAvatarConfig, className, altText = "Interactive 3D avatar" }: AvatarSceneProps) {
  if (!modelSrc) return null;
  const reducedMotion = typeof window !== "undefined" && (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches);
  return <div className={className} role="img" aria-label={altText}><AvatarErrorBoundary><Canvas camera={{ position: [0, 0.15, 2.8], fov: 28 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}><ambientLight intensity={1.1} /><directionalLight position={[2, 3, 4]} intensity={1.4} color="#F3F0EA" /><directionalLight position={[-2, 1, 1]} intensity={0.6} color="#C8AE87" /><Suspense fallback={null}><AvatarModel modelSrc={modelSrc} config={config} reducedMotion={reducedMotion} /><Environment preset="studio" /></Suspense></Canvas></AvatarErrorBoundary></div>;
}
