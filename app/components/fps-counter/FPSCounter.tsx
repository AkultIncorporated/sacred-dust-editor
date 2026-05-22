"use client";

import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useState } from "react";

export function FPSCounter() {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const stampRef = useRef(0);

  useFrame(({ clock }) => {
    framesRef.current += 1;
    const now = clock.elapsedTime * 1000;
    if (stampRef.current === 0) {
      stampRef.current = now;
    }
    if (now - stampRef.current >= 500) {
      setFps(Math.round((framesRef.current * 1000) / (now - stampRef.current)));
      framesRef.current = 0;
      stampRef.current = now;
    }
  });

  return (
    <Html fullscreen>
      <div className="pointer-events-none absolute right-2.5 top-2.5 rounded border border-sd-accent/30 bg-sd-bg/75 px-2 py-1 font-mono text-xs text-sd-accent">
        FPS {fps || "--"}
      </div>
    </Html>
  );
}
