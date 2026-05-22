"use client";

import type { Preset } from "@/app/lib/types";

type Props = {
  preset: Preset;
  onApply: (preset: Preset) => void;
};

export function PresetButton({ preset, onApply }: Props) {
  return (
    <button
      type="button"
      onClick={() => onApply(preset)}
      className="h-[34px] rounded-md border border-sd-line bg-sd-panel-2 px-3 text-sm text-sd-text hover:border-sd-accent-dark"
    >
      {preset.name}
    </button>
  );
}
