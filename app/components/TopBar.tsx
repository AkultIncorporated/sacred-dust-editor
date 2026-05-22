"use client";

import type { DustConfig, Preset, SavedPresets } from "@/app/lib/types";
import { BUILT_IN_PRESETS } from "./presets/presets";
import { PresetButton } from "./presets/PresetButton";

type Props = {
  savedPresets: SavedPresets;
  selectedSavedPreset: string;
  onSelectedSavedPreset: (name: string) => void;
  onApplyPreset: (preset: Preset) => void;
  onApplySavedPreset: (name: string) => void;
  onSavePreset: () => void;
  onDeletePreset: () => void;
  onExportConfig: () => void;
  onQueueRender: () => void;
  config: DustConfig;
};

export function TopBar({
  savedPresets,
  selectedSavedPreset,
  onSelectedSavedPreset,
  onApplyPreset,
  onApplySavedPreset,
  onSavePreset,
  onDeletePreset,
  onExportConfig,
  onQueueRender,
}: Props) {
  const savedNames = Object.keys(savedPresets).sort();

  return (
    <header className="col-span-2 flex min-w-0 items-center gap-2 overflow-x-auto border-b border-sd-line bg-[#101010] px-3.5 py-2.5">
      <div className="mr-2 shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-sd-accent">
        Sacred Dust Editor
      </div>
      <div className="flex min-w-0 items-center gap-2">
        {BUILT_IN_PRESETS.map((preset) => (
          <PresetButton key={preset.name} preset={preset} onApply={onApplyPreset} />
        ))}
      </div>
      <div className="min-w-4 flex-1" />
      <div className="flex items-center gap-2">
        <select
          aria-label="Saved presets"
          value={selectedSavedPreset}
          onChange={(event) => {
            const name = event.target.value;
            onSelectedSavedPreset(name);
            if (name) onApplySavedPreset(name);
          }}
          className="h-[34px] min-w-[150px] rounded-md border border-sd-line bg-sd-panel-2 px-3 text-sm text-sd-text hover:border-sd-accent-dark"
        >
          <option value="">Saved presets</option>
          {savedNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button type="button" onClick={onSavePreset} className="h-[34px] rounded-md border border-sd-line bg-sd-panel-2 px-3 text-sm text-sd-text hover:border-sd-accent-dark">
          Save Preset
        </button>
        <button type="button" onClick={onDeletePreset} className="h-[34px] rounded-md border border-sd-line bg-sd-panel-2 px-3 text-sm text-sd-danger hover:border-sd-accent-dark">
          Delete
        </button>
        <button type="button" onClick={onExportConfig} className="h-[34px] rounded-md border border-sd-accent-dark bg-[#2b2416] px-3 text-sm text-sd-accent hover:border-sd-accent">
          Export Config
        </button>
        <button type="button" onClick={onQueueRender} className="h-[34px] rounded-md border border-sd-accent-dark bg-[#2b2416] px-3 text-sm text-sd-accent hover:border-sd-accent">
          Queue Render
        </button>
      </div>
    </header>
  );
}
