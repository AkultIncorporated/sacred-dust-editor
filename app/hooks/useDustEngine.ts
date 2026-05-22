"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { DustConfig } from "@/app/lib/types";

type DustUniforms = {
  uTime: { value: number };
  uActivity: { value: number };
  uChaos: { value: number };
  uFlow: { value: number };
  uPointSize: { value: number };
  uExplodeIntensity: { value: number };
  uMouse: { value: THREE.Vector2 };
  uMouseActive: { value: number };
  uMouseDown: { value: number };
  uColor: { value: THREE.Color };
  uRGBSplit: { value: number };
  uGlowIntensity: { value: number };
  uResolution: { value: THREE.Vector2 };
  uCRTfrequency: { value: number };
  uCRTvertical: { value: number };
  uCRTspeed: { value: number };
  uCRTspeed2: { value: number };
  uCRTintensity: { value: number };
  uCRTcolor: { value: THREE.Color };
};

function createUniforms(config: DustConfig, kind: "main" | "background"): DustUniforms {
  const background = kind === "background";
  return {
    uTime: { value: 0 },
    uActivity: { value: background ? 0.22 : config.uActivity },
    uChaos: { value: background ? 0.35 : config.uChaos },
    uFlow: { value: config.uFlow },
    uPointSize: { value: background ? 1.2 : config.uPointSize },
    uExplodeIntensity: { value: 0 },
    uMouse: { value: new THREE.Vector2(5, 5) },
    uMouseActive: { value: 0 },
    uMouseDown: { value: 0 },
    uColor: { value: new THREE.Color(background ? "#8b6914" : config.uColor) },
    uRGBSplit: { value: background ? 0.15 : config.uRGBSplit },
    uGlowIntensity: { value: background ? 0.45 : config.uGlowIntensity },
    uResolution: { value: new THREE.Vector2(1080, 1080) },
    uCRTfrequency: { value: config.uCRTfrequency },
    uCRTvertical: { value: config.uCRTvertical },
    uCRTspeed: { value: config.uCRTspeed },
    uCRTspeed2: { value: config.uCRTspeed2 },
    uCRTintensity: { value: config.uCRTintensity },
    uCRTcolor: { value: new THREE.Color(config.uCRTcolor) },
  };
}

export function useDustEngine(config: DustConfig) {
  const mainUniformsRef = useRef<DustUniforms | null>(null);
  const backgroundUniformsRef = useRef<DustUniforms | null>(null);
  const mouseDownRef = useRef(false);

  if (!mainUniformsRef.current) {
    mainUniformsRef.current = createUniforms(config, "main");
  }

  if (!backgroundUniformsRef.current) {
    backgroundUniformsRef.current = createUniforms(config, "background");
  }

  useEffect(() => {
    const main = mainUniformsRef.current;
    const background = backgroundUniformsRef.current;
    if (!main || !background) return;

    main.uActivity.value = config.uActivity;
    main.uChaos.value = config.uChaos;
    main.uFlow.value = config.uFlow;
    main.uPointSize.value = config.uPointSize;
    main.uGlowIntensity.value = config.uGlowIntensity;
    main.uRGBSplit.value = config.uRGBSplit;
    main.uColor.value.set(config.uColor);
    main.uCRTfrequency.value = config.uCRTfrequency;
    main.uCRTvertical.value = config.uCRTvertical;
    main.uCRTspeed.value = config.uCRTspeed;
    main.uCRTspeed2.value = config.uCRTspeed2;
    main.uCRTintensity.value = config.uCRTintensity;
    main.uCRTcolor.value.set(config.uCRTcolor);

    background.uFlow.value = config.uFlow;
    background.uCRTfrequency.value = config.uCRTfrequency;
    background.uCRTvertical.value = config.uCRTvertical;
    background.uCRTspeed.value = config.uCRTspeed;
    background.uCRTspeed2.value = config.uCRTspeed2;
    background.uCRTintensity.value = config.uCRTintensity;
    background.uCRTcolor.value.set(config.uCRTcolor);
  }, [config]);

  return {
    mainUniforms: mainUniformsRef.current as DustUniforms,
    backgroundUniforms: backgroundUniformsRef.current as DustUniforms,
    mouseDownRef,
  };
}
