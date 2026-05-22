"use client";

import type { ReactNode } from "react";

type Props = {
  topBar: ReactNode;
  sidebar: ReactNode;
  canvas: ReactNode;
};

export function EditorLayout({ topBar, sidebar, canvas }: Props) {
  return (
    <div className="grid h-screen w-screen grid-cols-[320px_minmax(0,1fr)] grid-rows-[56px_minmax(0,1fr)] overflow-hidden bg-sd-bg text-sd-text max-[920px]:grid-cols-[280px_minmax(0,1fr)]">
      {topBar}
      {sidebar}
      {canvas}
    </div>
  );
}
