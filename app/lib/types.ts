export type GeometryType = "fibonacciSphere" | "merkaba";

export interface DustConfig {
  uActivity: number;
  uChaos: number;
  uFlow: number;
  uPointSize: number;
  uGlowIntensity: number;
  uRGBSplit: number;
  uColor: string;
  uCRTfrequency: number;
  uCRTvertical: number;
  uCRTspeed: number;
  uCRTspeed2: number;
  uCRTintensity: number;
  uCRTcolor: string;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  cameraZ: number;
  cameraFOV: number;
  particleDensity: number;
  layerCount: number;
  depthRange: number;
  geometryType: GeometryType;
}

export interface Preset {
  name: string;
  config: Partial<DustConfig>;
}

export interface GeometryBuffers {
  positions: Float32Array;
  normals: Float32Array;
  randoms: Float32Array;
  count: number;
}

export interface ControlItem {
  key: keyof DustConfig;
  label: string;
  type: "range" | "color" | "select";
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string }>;
}

export interface ControlGroupDefinition {
  title: string;
  items: ControlItem[];
}

export type SavedPresets = Record<string, DustConfig>;
