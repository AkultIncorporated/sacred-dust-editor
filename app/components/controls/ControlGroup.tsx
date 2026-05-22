"use client";

import { useState } from "react";
import type { ControlGroupDefinition, DustConfig } from "@/app/lib/types";
import { ColorPicker } from "./ColorPicker";
import { SliderControl } from "./SliderControl";
import type { ConfigUpdate } from "./SliderControl";

type Props = {
  group: ControlGroupDefinition;
  config: DustConfig;
  onChange: ConfigUpdate;
};

export function ControlGroup({ group, config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-b border-sd-line pb-[18px] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mb-3 flex h-auto w-full items-center justify-between border-0 bg-transparent p-0 text-left text-xs font-bold uppercase tracking-[0.08em] text-sd-accent"
      >
        <span>{group.title}</span>
        <span className="font-mono text-sd-muted">{open ? "-" : "+"}</span>
      </button>
      {open ? (
        <div className="space-y-3">
          {group.items.map((item) => {
            const value = config[item.key];
            if (item.type === "color") {
              return (
                <ColorPicker
                  key={item.key}
                  label={item.label}
                  value={String(value)}
                  onChange={(next) => onChange(item.key, next as DustConfig[typeof item.key])}
                />
              );
            }
            if (item.type === "select") {
              return (
                <div key={item.key} className="grid grid-cols-[minmax(0,1fr)_140px] items-center gap-2.5">
                  <label className="text-[13px] text-sd-text" htmlFor={item.key}>
                    {item.label}
                  </label>
                  <select
                    id={item.key}
                    value={String(value)}
                    onChange={(event) => onChange(item.key, event.target.value as DustConfig[typeof item.key])}
                    className="h-[34px] rounded-md border border-sd-line bg-sd-panel-2 px-2 text-[13px] text-sd-text"
                  >
                    {item.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <SliderControl
                key={item.key}
                label={item.label}
                value={Number(value)}
                min={item.min ?? 0}
                max={item.max ?? 1}
                step={item.step ?? 0.01}
                onChange={(next) => onChange(item.key, next as DustConfig[typeof item.key])}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
