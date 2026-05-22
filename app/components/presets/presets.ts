import type { Preset } from "@/app/lib/types";

export const BUILT_IN_PRESETS: Preset[] = [
  {
    name: "Dark Merkaba",
    config: {
      geometryType: "merkaba",
      uActivity: 0.3,
      uChaos: 0.5,
      uGlowIntensity: 1.2,
      uPointSize: 3.5,
      uCRTintensity: 0.08,
    },
  },
  {
    name: "Warm Logo",
    config: {
      uActivity: 0.44,
      uChaos: 0.55,
      uGlowIntensity: 1.1,
      uPointSize: 2.2,
      uCRTintensity: 0.12,
      uColor: "#d5b26f",
    },
  },
  {
    name: "Ethereal Sphere",
    config: {
      geometryType: "fibonacciSphere",
      uActivity: 0.22,
      uChaos: 0.35,
      uGlowIntensity: 0.45,
      uPointSize: 1.2,
      uCRTintensity: 0.05,
    },
  },
  {
    name: "CRT Heavy",
    config: {
      uCRTintensity: 0.35,
      uCRTfrequency: 150,
      uCRTspeed: 5,
    },
  },
  {
    name: "Minimal",
    config: {
      uGlowIntensity: 0.6,
      uRGBSplit: 0.1,
      uCRTintensity: 0,
      bloomStrength: 0.3,
    },
  },
];
