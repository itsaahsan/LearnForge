"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StoreProvider, useStore } from "@/lib/store";
import { Btn, Card, Badge } from "@/components/ui";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SKILLS = ["React", "TypeScript", "Python", "APIs", "Databases", "AI", "Authentication", "Deployment", "Testing", "System Design"];
const GOALS = ["Learn", "Build portfolio", "Prepare for interviews", "Hackathon", "Launch a product"];

function Flow() {
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [interests, setInterests] = useState<string[]>(["React", "APIs"]);
  const [goal, setGoal] = useState("Build portfolio");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setProject } = useStore();
  const router = useRouter();

  async function generate() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea, level, interests, goal }) });
      if (!res.ok) throw new Error("Analysis failed");
      const project = await res.json();
      setProject(project);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Try the demo.");
    } finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs text-slate-400">Step {step} of 5</p>
      <div className="h-1.5 rounded-full bg-white/10 mt-2 mb-6"><div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${step * 20}%` }} /></div>

      {step === 1 && (
        <Card><h1 className="text-2xl font-bold">What do you want to build?</h1>
          <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={5} aria-label="Project idea" placeholder="I want to build a personal finance app that helps students understand where their money goes." className="mt-4 w-full rounded-xl border border-white/10 bg-ink-900 p-4 text-sm" />
          <div className="mt-4 flex justify-end"><Btn onClick={() => idea.trim().length > 10 && setStep(2)}>Continue</Btn></div>
          {idea.trim().length <= 10 && <p className="text-xs text-slate-500 mt-2">Describe your idea in at least a sentence to continue.</p>}
        </Card>
      )}
      {step === 2 && (
        <Card><h2 className="text-2xl font-bold">What is your experience level?</h2>
          <div className="mt-4 grid gap-2">{LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} aria-pressed={level === l} className={`rounded-xl border p-4 text-left ${level === l ? "border-accent-400 bg-accent-500/10" : "border-white/10 hover:bg-white/5"}`}>{l}</button>))}
          </div>
          <div className="mt-4 flex justify-between"><Btn variant="ghost" onClick={() => setStep(1)}>Back</Btn><Btn onClick={() => setStep(3)}>Continue</Btn></div>
        </Card>
      )}
      {step === 3 && (
        <Card><h2 className="text-2xl font-bold">What do you want to learn?</h2>
          <div className="mt-4 flex flex-wrap gap-2">{SKILLS.map((s) => (
            <button key={s} onClick={() => setInterests((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} aria-pressed={interests.includes(s)} className={`rounded-full border px-3 py-1.5 text-sm ${interests.includes(s) ? "border-accent-400 bg-accent-500/15" : "border-white/10"}`}><Badge>{s}</Badge></button>))}
          </div>
          <div className="mt-4 flex justify-between"><Btn variant="ghost" onClick={() => setStep(2)}>Back</Btn><Btn onClick={() => setStep(4)}>Continue</Btn></div>
        </Card>
      )}
      {step === 4 && (
        <Card><h2 className="text-2xl font-bold">What is your goal?</h2>
          <div className="mt-4 grid gap-2">{GOALS.map((g) => (
            <button key={g} onClick={() => setGoal(g)} aria-pressed={goal === g} className={`rounded-xl border p-4 text-left ${goal === g ? "border-accent-400 bg-accent-500/10" : "border-white/10 hover:bg-white/5"}`}>{g}</button>))}
          </div>
          <div className="mt-4 flex justify-between"><Btn variant="ghost" onClick={() => setStep(3)}>Back</Btn><Btn onClick={() => setStep(5)}>Continue</Btn></div>
        </Card>
      )}
      {step === 5 && (
        <Card>
          <h2 className="text-2xl font-bold">Generate my project plan</h2>
          <p className="text-sm text-slate-400 mt-1">{level} · {goal} · {interests.join(", ") || "General"}</p>
          {!loading ? (
            <div className="mt-4"><Btn onClick={generate}>Generate plan</Btn>
              {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}</div>
          ) : (
            <motion.div aria-live="polite" className="mt-6 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-accent-300">Analyzing idea → generating roadmap…</p>
              {[90, 70, 50].map((w, i) => (
                <motion.div key={i} className="h-3 rounded-full bg-gradient-to-r from-accent-500 to-mint" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} style={{ width: `${w}%` }} />
              ))}
            </motion.div>
          )}
          <div className="mt-4"><Btn variant="ghost" onClick={() => setStep(4)}>Back</Btn></div>
        </Card>
      )}
    </main>
  );
}

export default function Page() {
  return <StoreProvider><Flow /></StoreProvider>;
}
