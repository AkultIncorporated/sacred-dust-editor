"use client";

import type { DustConfig } from "@/app/lib/types";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function SliderControl({ label, value, min, max, step, onChange }: Props) {
  const display = label === "layerCount" || label === "cameraFOV" || label === "uCRTfrequency"
    ? String(Math.round(value))
    : value.toFixed(2);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_74px] items-center gap-x-2.5 gap-y-2">
      <label className="min-w-0 text-[13px] text-sd-text" htmlFor={label}>
        {label}
      </label>
      <div className="font-mono text-xs text-sd-muted text-right">{display}</div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="col-span-2 w-full accent-sd-accent"
      />
    </div>
  );
}

export type ConfigUpdate = <K extends keyof DustConfig>(key: K, value: DustConfig[K]) => void;
