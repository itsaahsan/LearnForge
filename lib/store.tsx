"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ForgeProject } from "@/lib/types";
import { DEMO_PROJECT } from "@/lib/demo-data";

const KEY = "learnforge:project:v1";

interface Store {
  project: ForgeProject | null;
  setProject: (p: ForgeProject | null) => void;
  update: (fn: (p: ForgeProject) => ForgeProject) => void;
  loadDemo: () => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [project, setProjectState] = useState<ForgeProject | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProjectState(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      if (project) localStorage.setItem(KEY, JSON.stringify(project));
      else localStorage.removeItem(KEY);
    } catch {}
  }, [project, ready]);

  const value = useMemo<Store>(() => ({
    project,
    setProject: setProjectState,
    update: (fn) => setProjectState((p) => (p ? fn(structuredClone(p)) : p)),
    loadDemo: () => setProjectState(structuredClone(DEMO_PROJECT)),
    reset: () => setProjectState(null)
  }), [project]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export function projectProgress(p: ForgeProject) {
  const tasks = p.milestones.flatMap((m) => m.tasks);
  const done = tasks.filter((t) => t.status === "COMPLETED").length;
  return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
}
