"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY } from "@/app/lib/defaults";
import type { DustConfig, SavedPresets } from "@/app/lib/types";

function readPresets(): SavedPresets {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as SavedPresets;
  } catch {
    return {};
  }
}

export function usePresets() {
  const [savedPresets, setSavedPresets] = useState<SavedPresets>({});

  useEffect(() => {
    setSavedPresets(readPresets());
  }, []);

  const persist = useCallback((next: SavedPresets) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedPresets(next);
  }, []);

  const savePreset = useCallback(
    (name: string, config: DustConfig) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      persist({ ...readPresets(), [trimmed]: config });
    },
    [persist],
  );

  const deletePreset = useCallback(
    (name: string) => {
      const next = { ...readPresets() };
      delete next[name];
      persist(next);
    },
    [persist],
  );

  return { savedPresets, savePreset, deletePreset };
}
