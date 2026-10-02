import { useEffect, useState } from "react";

/** Persistence adapter. Replace the two functions below with fetch() calls to use a backend later. */
export const storage = {
  read<T>(key: string, fallback: T): T {
    try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; }
    catch { return fallback; }
  },
  write<T>(key: string, value: T): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota/private mode */ }
  },
};

/** useState that auto-saves to storage on every change. */
export function usePersistentState<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => storage.read<T>(key, initial()));
  useEffect(() => storage.write(key, value), [key, value]);
  return [value, setValue] as const;
}
