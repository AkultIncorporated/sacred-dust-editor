"use client";

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { EditorLayout } from "./components/EditorLayout";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { WebGLCanvas } from "./components/WebGLCanvas";
import { usePresets } from "./hooks/usePresets";
import { DEFAULT_CONFIG, EXPORT_FILENAME, RENDER_QUEUE_FILENAME } from "./lib/defaults";
import type { DustConfig, Preset } from "./lib/types";

type SaveFilePicker = (options: {
  suggestedName?: string;
  types?: Array<{ description: string; accept: Record<string, string[]> }>;
}) => Promise<{
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>;
    close: () => Promise<void>;
  }>;
}>;

function normalizeHex(hex: string) {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function currentRenderConfig(values: DustConfig) {
  return {
    timestamp: new Date().toISOString(),
    composition: "nousresearch_crt",
    duration: 10,
    fps: 30,
    quality: "high",
    dust: {
      activity: values.uActivity,
      chaos: values.uChaos,
      flow: values.uFlow,
      pointSize: values.uPointSize,
      glowIntensity: values.uGlowIntensity,
      rgbSplit: values.uRGBSplit,
      color: values.uColor,
    },
    crt: {
      frequency: values.uCRTfrequency,
      vertical: values.uCRTvertical,
      speed: values.uCRTspeed,
      speed2: values.uCRTspeed2,
      intensity: values.uCRTintensity,
      color: values.uCRTcolor,
    },
    bloom: {
      strength: values.bloomStrength,
      radius: values.bloomRadius,
      threshold: values.bloomThreshold,
    },
    camera: {
      z: values.cameraZ,
      fov: values.cameraFOV,
    },
    geometry: {
      type: values.geometryType,
      density: values.particleDensity,
      layers: Math.round(values.layerCount),
      depthRange: values.depthRange,
    },
  };
}

export default function Home() {
  const [config, setConfig] = useState<DustConfig>(DEFAULT_CONFIG);
  const [selectedSavedPreset, setSelectedSavedPreset] = useState("");
  const [particleCount, setParticleCount] = useState(0);
  const [status, setStatus] = useState("Sacred dust engine ready.");
  const [statusVisible, setStatusVisible] = useState(true);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const { savedPresets, savePreset, deletePreset } = usePresets();

  const showStatus = useCallback((message: string, sticky = false) => {
    setStatus(message);
    setStatusVisible(true);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    if (!sticky) {
      statusTimerRef.current = setTimeout(() => setStatusVisible(false), 2600);
    }
  }, []);

  const updateConfig = useCallback(<K extends keyof DustConfig>(key: K, value: DustConfig[K]) => {
    setConfig((current) => ({
      ...current,
      [key]: typeof value === "string" && key.toLowerCase().includes("color") ? normalizeHex(value) : value,
    }));
  }, []);

  const applyPartialConfig = useCallback(
    (partial: Partial<DustConfig>, message = "Preset applied.") => {
      tweenRef.current?.kill();
      setConfig((current) => {
        const target = { ...current, ...partial };
        const numericKeys = Object.keys(partial).filter(
          (key) => typeof current[key as keyof DustConfig] === "number",
        ) as Array<keyof DustConfig>;

        if (numericKeys.length > 0) {
          const tweenState = Object.fromEntries(
            numericKeys.map((key) => [key, current[key] as number]),
          ) as Record<string, number>;
          const tweenTarget = Object.fromEntries(
            numericKeys.map((key) => [key, target[key] as number]),
          );

          tweenRef.current = gsap.to(tweenState, {
            ...tweenTarget,
            duration: 0.65,
            ease: "power2.out",
            onUpdate: () => {
              setConfig((latest) => {
                const next = { ...latest };
                numericKeys.forEach((key) => {
                  (next as Record<string, unknown>)[key] = tweenState[key as string];
                });
                return next;
              });
            },
          });
        }

        showStatus(message);
        return target;
      });
    },
    [showStatus],
  );

  const handleApplyPreset = useCallback(
    (preset: Preset) => applyPartialConfig(preset.config),
    [applyPartialConfig],
  );

  const handleApplySavedPreset = useCallback(
    (name: string) => {
      const preset = savedPresets[name];
      if (preset) applyPartialConfig(preset, "Saved preset applied.");
    },
    [applyPartialConfig, savedPresets],
  );

  const handleSavePreset = useCallback(() => {
    const name = window.prompt("Preset name");
    if (!name?.trim()) return;
    savePreset(name, config);
    setSelectedSavedPreset(name.trim());
    showStatus("Preset saved.");
  }, [config, savePreset, showStatus]);

  const handleDeletePreset = useCallback(() => {
    if (!selectedSavedPreset) return;
    deletePreset(selectedSavedPreset);
    setSelectedSavedPreset("");
    showStatus("Preset deleted.");
  }, [deletePreset, selectedSavedPreset, showStatus]);

  const handleExportConfig = useCallback(() => {
    downloadJson(EXPORT_FILENAME, currentRenderConfig(config));
    showStatus("Config exported.");
  }, [config, showStatus]);

  const handleQueueRender = useCallback(async () => {
    const data = currentRenderConfig(config);
    if ("showSaveFilePicker" in window) {
      try {
        const showSaveFilePicker = window.showSaveFilePicker as SaveFilePicker;
        const handle = await showSaveFilePicker({
          suggestedName: RENDER_QUEUE_FILENAME,
          types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        showStatus("Render queued: pending.json written.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    downloadJson(RENDER_QUEUE_FILENAME, data);
    showStatus("Render queue JSON exported as pending.json.");
  }, [config, showStatus]);

  const handleParticleCount = useCallback(
    (count: number) => {
      setParticleCount(count);
      showStatus(`${count.toLocaleString()} particles loaded`);
    },
    [showStatus],
  );

  return (
    <EditorLayout
      topBar={
        <TopBar
          config={config}
          savedPresets={savedPresets}
          selectedSavedPreset={selectedSavedPreset}
          onSelectedSavedPreset={setSelectedSavedPreset}
          onApplyPreset={handleApplyPreset}
          onApplySavedPreset={handleApplySavedPreset}
          onSavePreset={handleSavePreset}
          onDeletePreset={handleDeletePreset}
          onExportConfig={handleExportConfig}
          onQueueRender={handleQueueRender}
        />
      }
      sidebar={<Sidebar config={config} onChange={updateConfig} />}
      canvas={
        <WebGLCanvas
          config={config}
          particleCount={particleCount}
          status={status}
          statusVisible={statusVisible}
          onParticleCount={handleParticleCount}
        />
      }
    />
  );
}
