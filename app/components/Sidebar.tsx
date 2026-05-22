"use client";

import { CONTROL_GROUPS } from "@/app/lib/defaults";
import type { DustConfig } from "@/app/lib/types";
import { ControlGroup } from "./controls/ControlGroup";
import type { ConfigUpdate } from "./controls/SliderControl";

type Props = {
  config: DustConfig;
  onChange: ConfigUpdate;
};

export function Sidebar({ config, onChange }: Props) {
  return (
    <aside className="min-h-0 overflow-auto border-r border-sd-line bg-sd-panel px-3.5 py-4">
      <div className="space-y-[18px]">
        {CONTROL_GROUPS.map((group) => (
          <ControlGroup key={group.title} group={group} config={config} onChange={onChange} />
        ))}
      </div>
    </aside>
  );
}
