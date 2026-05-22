"use client";

import { Canvas } from "@react-three/fiber";
import { FPSCounter } from "./fps-counter/FPSCounter";
import { DustScene } from "./DustScene";
import type { DustConfig } from "@/app/lib/types";

type Props = {
  config: DustConfig;
  particleCount: number;
  status: string;
  statusVisible: boolean;
  onParticleCount: (count: number) => void;
};

export function WebGLCanvas({ config, particleCount, status, statusVisible, onParticleCount }: Props) {
  return (
    <main className="grid min-h-0 min-w-0 place-items-center bg-[radial-gradient(circle_at_50%_45%,#111_0%,var(--bg)_64%)] p-4">
      <div className="relative aspect-square h-[min(1080px,calc(100vw-352px),calc(100vh-88px))] w-[min(1080px,calc(100vw-352px),calc(100vh-88px))] bg-sd-bg shadow-[0_0_0_1px_#1e1e1e,0_26px_80px_rgba(0,0,0,0.48)] max-[920px]:h-[min(1080px,calc(100vw-312px),calc(100vh-88px))] max-[920px]:w-[min(1080px,calc(100vw-312px),calc(100vh-88px))]">
        <Canvas
          camera={{ fov: config.cameraFOV, position: [0, 0, config.cameraZ], near: 0.1, far: 100 }}
          dpr={1}
          gl={{ antialias: true, alpha: false }}
        >
          <DustScene config={config} onParticleCount={onParticleCount} />
          <FPSCounter />
        </Canvas>
        <div className="pointer-events-none absolute right-2.5 top-9 rounded border border-sd-accent/30 bg-sd-bg/75 px-2 py-1 font-mono text-xs text-sd-muted">
          {particleCount.toLocaleString()} particles
        </div>
        <div
          className={`pointer-events-none absolute bottom-2.5 left-2.5 max-w-[calc(100%-20px)] rounded-md border border-sd-accent/25 bg-sd-bg/80 px-2.5 py-2 text-xs text-sd-text transition duration-150 ${
            statusVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {status}
        </div>
      </div>
    </main>
  );
}
