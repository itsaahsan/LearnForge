"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Map, Brain, Bug, LineChart, Trophy, Play } from "lucide-react";
import { StoreProvider } from "@/lib/store";

const STEPS = ["IDEA", "PLAN", "LEARN", "BUILD", "TEST", "REFLECT", "SHIP"];

export default function Landing() {
  return (
    <StoreProvider>
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <nav className="flex items-center justify-between py-6" aria-label="Main">
        <div className="flex items-center gap-2 font-bold text-lg"><Sparkles size={20} className="text-accent-400" /> LearnForge</div>
        <div className="flex gap-3">
          <Link href="/onboarding" className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium hover:bg-accent-400">Start Building</Link>
          <Link href="/dashboard?demo=1" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Explore Demo</Link>
        </div>
      </nav>

      <section className="grid gap-10 md:grid-cols-2 items-center pt-10">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold leading-tight">
            Build projects.<br />Build skills.<br /><span className="text-accent-400">Build your future.</span>
          </motion.h1>
          <p className="mt-4 text-slate-400 max-w-md">LearnForge turns your software idea into a guided learning journey—so you don&apos;t just finish projects, you understand how you built them.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 font-medium hover:bg-accent-400">Start Building <ArrowRight size={16} /></Link>
            <Link href="/dashboard?demo=1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 hover:bg-white/5"><Play size={16} /> Explore Demo</Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">No account needed for demo · Demo mode with realistic AI fallback · 3–5 min golden path</p>
        </div>
        <div className="glass rounded-2xl p-6" aria-label="Interactive project journey">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Interactive project journey</p>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? "bg-mint/20 text-mint" : i === 3 ? "bg-accent-500 text-white" : "bg-white/5 text-slate-400 border border-white/10"}`}>{i + 1}</span>
                <span className="text-sm font-medium">{s}</span>
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">{i < 3 ? "done" : i === 3 ? "current" : "locked"}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div animate={{ width: ["10%", "55%", "55%"] }} transition={{ duration: 2 }} className="h-full bg-gradient-to-r from-accent-500 to-mint" style={{ width: "55%" }} /></div>
          <p className="mt-2 text-xs text-slate-400">55% · Current mission: Build authentication</p>
        </div>
      </section>

      <section className="mt-20 grid gap-4 md:grid-cols-3" aria-label="How it works">
        {[
          { icon: <Map size={18} />, t: "Idea → Roadmap", d: "AI analyzes your idea and generates milestones, tasks, stack and skills." },
          { icon: <Brain size={18} />, t: "Learn by doing", d: "Learning Mode teaches WHY → CONCEPT → TRY IT → REFLECT at your level." },
          { icon: <LineChart size={18} />, t: "Prove growth", d: "Timeline, skills, journal and graduation report show real learning." }
        ].map((c) => (
          <div key={c.t} className="glass card-hover rounded-2xl p-5"><div className="text-accent-400">{c.icon}</div><h3 className="mt-2 font-semibold">{c.t}</h3><p className="text-sm text-slate-400 mt-1">{c.d}</p></div>
        ))}
      </section>

      <section className="mt-12 glass rounded-2xl p-6" aria-label="Why LearnForge">
        <h2 className="text-xl font-bold">Most beginners don&apos;t fail because they can&apos;t write code.</h2>
        <p className="text-slate-400 text-sm mt-2">They get stuck because they don&apos;t know what to build, what to learn, what to do next, why code isn&apos;t working, or whether they&apos;re improving. LearnForge turns that confusion into a structured journey.</p>
        <div className="mt-4 grid md:grid-cols-4 gap-3 text-sm">
          {[["AI Mentor", "Context-aware hints, not solution dumps"], ["Debug With Me", "Educational debugging checklists"], ["Project Health", "Momentum, risk, complexity insight"], ["Gamification", "XP, streaks, subtle badges"]].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/10 p-4"><p className="font-medium flex items-center gap-2"><Trophy size={14} className="text-mint" />{t}</p><p className="text-slate-400 text-xs mt-1">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold">Turn confusion into a shipped project.</h2>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/onboarding" className="rounded-xl bg-accent-500 px-5 py-3 font-medium hover:bg-accent-400">Start Building</Link>
          <Link href="/dashboard?demo=1" className="rounded-xl border border-white/10 px-5 py-3 hover:bg-white/5">Explore Demo</Link>
        </div>
      </section>

      <footer className="mt-16 flex items-center gap-2 text-xs text-slate-500"><Bug size={14} /> Built for hackathon demo · AI disclosure in README · Demo mode fallback included</footer>
    </main>
    </StoreProvider>
  );
}
