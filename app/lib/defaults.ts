import type { ControlGroupDefinition, DustConfig } from "./types";

export const STORAGE_KEY = "sacred-dust-editor-presets";
export const EXPORT_FILENAME = "nousresearch_crt_config.json";
export const RENDER_QUEUE_FILENAME = "pending.json";

export const DEFAULT_CONFIG: DustConfig = {
  uActivity: 0.44,
  uChaos: 0.55,
  uFlow: 0.99,
  uPointSize: 2.2,
  uGlowIntensity: 1.1,
  uRGBSplit: 0.35,
  uColor: "#d5b26f",
  uCRTfrequency: 100,
  uCRTvertical: 3,
  uCRTspeed: 3,
  uCRTspeed2: 0.5,
  uCRTintensity: 0.12,
  uCRTcolor: "#dbd8f5",
  bloomStrength: 0.6,
  bloomRadius: 0.5,
  bloomThreshold: 0.3,
  cameraZ: 5.2,
  cameraFOV: 45,
  particleDensity: 1,
  layerCount: 3,
  depthRange: 0.25,
  geometryType: "fibonacciSphere",
};

export const CONTROL_GROUPS: ControlGroupDefinition[] = [
  {
    title: "Dust Engine",
    items: [
      { key: "uActivity", label: "uActivity", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "uChaos", label: "uChaos", type: "range", min: 0.1, max: 2, step: 0.01 },
      { key: "uFlow", label: "uFlow", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "uPointSize", label: "uPointSize", type: "range", min: 0.5, max: 8, step: 0.1 },
      { key: "uGlowIntensity", label: "uGlowIntensity", type: "range", min: 0, max: 3, step: 0.05 },
      { key: "uRGBSplit", label: "uRGBSplit", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "uColor", label: "uColor", type: "color" },
    ],
  },
  {
    title: "CRT Overlay",
    items: [
      { key: "uCRTfrequency", label: "uCRTfrequency", type: "range", min: 10, max: 300, step: 1 },
      { key: "uCRTvertical", label: "uCRTvertical", type: "range", min: 0.5, max: 10, step: 0.1 },
      { key: "uCRTspeed", label: "uCRTspeed", type: "range", min: 0.5, max: 10, step: 0.1 },
      { key: "uCRTspeed2", label: "uCRTspeed2", type: "range", min: 0.1, max: 3, step: 0.05 },
      { key: "uCRTintensity", label: "uCRTintensity", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "uCRTcolor", label: "uCRTcolor", type: "color" },
    ],
  },
  {
    title: "Post-Processing",
    items: [
      { key: "bloomStrength", label: "bloomStrength", type: "range", min: 0, max: 2, step: 0.05 },
      { key: "bloomRadius", label: "bloomRadius", type: "range", min: 0, max: 1, step: 0.05 },
      { key: "bloomThreshold", label: "bloomThreshold", type: "range", min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: "Camera",
    items: [
      { key: "cameraZ", label: "cameraZ", type: "range", min: 2, max: 10, step: 0.1 },
      { key: "cameraFOV", label: "cameraFOV", type: "range", min: 20, max: 90, step: 1 },
    ],
  },
  {
    title: "Geometry",
    items: [
      { key: "particleDensity", label: "particleDensity", type: "range", min: 0.1, max: 2, step: 0.05 },
      { key: "layerCount", label: "layerCount", type: "range", min: 1, max: 5, step: 1 },
      { key: "depthRange", label: "depthRange", type: "range", min: 0.05, max: 0.5, step: 0.01 },
      {
        key: "geometryType",
        label: "geometryType",
        type: "select",
        options: [
          { label: "Fibonacci Sphere", value: "fibonacciSphere" },
          { label: "Merkaba", value: "merkaba" },
        ],
      },
    ],
  },
];
