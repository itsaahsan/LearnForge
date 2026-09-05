"use client";
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Lock, Flame, Trophy, Bug, BookOpen, MessageSquare, Home, Map as MapIcon, ListChecks, GraduationCap, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { StoreProvider, useStore, projectProgress } from "@/lib/store";
import { Card, Badge, Btn, ProgressRing, Bar, Empty } from "@/components/ui";
import { healthInsight } from "@/lib/ai/engine";

const TABS = [
  ["overview", "Overview", <Home key="h" size={15} />],
  ["roadmap", "Roadmap", <MapIcon key="m" size={15} />],
  ["tasks", "Tasks", <ListChecks key="t" size={15} />],
  ["learn", "Learn", <BookOpen key="l" size={15} />],
  ["mentor", "AI Mentor", <MessageSquare key="a" size={15} />],
  ["progress", "Progress", <GraduationCap key="p" size={15} />],
  ["journal", "Journal", <Sparkles key="j" size={15} />],
  ["settings", "Settings", <SettingsIcon key="s" size={15} />]
] as const;

function Shell() {
  const { project, loadDemo, update, reset } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<string>("overview");
  const [insight, setInsight] = useState("");

  useEffect(() => {
    if (params.get("demo") === "1" && !project) loadDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (project && !insight) setInsight(healthInsight(project));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">No project yet.</h1>
        <p className="text-slate-400 mt-2 text-sm">Start with an idea and LearnForge will turn it into your first development roadmap.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/onboarding" className="rounded-xl bg-accent-500 px-5 py-3 text-sm font-medium">Start Building</Link>
          <button onClick={loadDemo} className="rounded-xl border border-white/10 px-5 py-3 text-sm">Explore Demo</button>
        </div>
      </main>
    );
  }

  const pct = projectProgress(project);
  const current = project.milestones.find((m) => m.status === "current") ?? project.milestones.find((m) => m.status !== "completed") ?? project.milestones[project.milestones.length - 1];
  const allTasks = project.milestones.flatMap((m) => m.tasks.map((t) => ({ ...t, mid: m.id, mtitle: m.title })));
  const done = allTasks.filter((t) => t.status === "COMPLETED");

  function setTaskStatus(mid: string, tid: string, status: any) {
    update((p) => {
      const m = p.milestones.find((x) => x.id === mid)!;
      const t = m.tasks.find((x) => x.id === tid)!;
      t.status = status;
      if (status === "COMPLETED" && !p.achievements.includes("Task Crusher")) p.xp += 50;
      if (status === "COMPLETED") {
        p.timeline.push({ id: `e-${Date.now()}`, day: `DAY ${p.timeline.length + 1}`, date: new Date().toLocaleDateString(), title: `Completed: ${t.title}`, detail: `Milestone: ${m.title}`, skill: t.skills[0] });
        p.xp += 20;
      }
      // auto-advance milestone when all tasks done
      if (m.tasks.every((x) => x.status === "COMPLETED")) {
        m.status = "completed";
        const next = p.milestones[p.milestones.indexOf(m) + 1];
        if (next && next.status === "locked") next.status = "current";
        if (!p.achievements.includes("Milestone Shipped")) p.achievements.push("Milestone Shipped");
        p.xp += 150;
      }
      return p;
    });
  }

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar / mobile nav */}
      <aside className="hidden md:flex w-56 flex-col gap-1 border-r border-white/10 p-4" aria-label="Dashboard sections">
        <Link href="/" className="font-bold flex items-center gap-2 px-2 py-3">✦ LearnForge</Link>
        {TABS.map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id)} aria-current={tab === id} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-left ${tab === id ? "bg-accent-500/15 text-white" : "text-slate-400 hover:bg-white/5"}`}>{icon}{label}</button>
        ))}
        <div className="mt-auto text-xs text-slate-500 px-2">XP {project.xp} · 🔥 {project.streak} day streak</div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 glass flex items-center justify-between px-4 py-3">
          <div className="min-w-0"><p className="truncate font-semibold text-sm">{project.analysis.projectTitle}</p><p className="text-xs text-slate-400 truncate">Current: {current.title} · {pct}%</p></div>
          <div className="flex items-center gap-2">
            <Badge>{project.level}</Badge>
            <button aria-label="User profile" className="h-8 w-8 rounded-full bg-accent-500/30 border border-white/10">A</button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-4 p-4 pb-24 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.section key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
              {tab === "overview" && <Overview pct={pct} currentTitle={current.title} insight={insight} doneCount={done.length} totalCount={allTasks.length} onTab={setTab} onComplete={(mid: string, tid: string) => setTaskStatus(mid, tid, "COMPLETED")} />}
              {tab === "roadmap" && <Roadmap onComplete={(mid: string, tid: string) => setTaskStatus(mid, tid, "COMPLETED")} />}
              {tab === "tasks" && <Tasks onStatus={setTaskStatus} />}
              {tab === "learn" && <Learn />}
              {tab === "mentor" && <Mentor />}
              {tab === "progress" && <Progress pct={pct} />}
              {tab === "journal" && <Journal />}
              {tab === "settings" && <SettingsView reset={() => { reset(); router.push("/"); }} />}
            </motion.section>
          </AnimatePresence>
        </main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 glass flex justify-around py-2" aria-label="Mobile navigation">
          {TABS.slice(0, 5).map(([id, label, icon]) => (
            <button key={id} onClick={() => setTab(id)} aria-label={label} className={`p-2 rounded-lg ${tab === id ? "text-white bg-accent-500/20" : "text-slate-400"}`}>{icon}</button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Overview({ pct, currentTitle, insight, doneCount, totalCount, onTab, onComplete }: any) {
  const { project, update } = useStore();
  if (!project) return null;
  const current = project.milestones.find((m) => m.status === "current") ?? project.milestones[project.milestones.length - 1];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="flex items-center gap-4"><ProgressRing pct={pct} /><div><p className="font-semibold">Project Progress</p><p className="text-xs text-slate-400">{doneCount}/{totalCount} tasks · {project.xp} XP</p><Btn className="mt-2" onClick={() => onTab("roadmap")}>Open roadmap</Btn></div></Card>
      <Card className="md:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Current mission</p>
        <h2 className="text-xl font-bold mt-1">{current.title}</h2>
        <p className="text-sm text-slate-400">{current.objective} · {current.tasks.filter((t) => t.status !== "COMPLETED").length} tasks left</p>
        <ul className="mt-3 space-y-2">
          {current.tasks.slice(0, 4).map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <button aria-label={`Complete ${t.title}`} onClick={() => onComplete(current.id, t.id)}>
                {t.status === "COMPLETED" ? <CheckCircle2 size={18} className="text-mint" /> : <Circle size={18} className="text-slate-500" />}
              </button>
              <span className={t.status === "COMPLETED" ? "line-through text-slate-500" : ""}>{t.title}</span>
              <span className="ml-auto text-xs text-slate-500">{t.estimatedTime}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3"><Btn onClick={() => onTab("learn")}>Start Mission</Btn></div>
      </Card>
      <Card><p className="text-xs uppercase tracking-widest text-slate-400">Learning progress</p>
        <div className="mt-3 space-y-3">{project.skillProgress.map((s) => (
          <div key={s.skill}><div className="flex justify-between text-xs mb-1"><span>{s.skill}</span><span className="text-slate-500">{s.pct}%</span></div><Bar pct={s.pct} /></div>))}
        </div>
        <button className="mt-3 text-xs text-accent-300" onClick={() => update((p) => { p.skillProgress.forEach((s) => { s.pct = Math.min(100, s.pct + 5); }); return p; })}>Simulate learning +5%</button>
      </Card>
      <Card><p className="text-xs uppercase tracking-widest text-slate-400">AI Insight</p><p className="text-sm mt-2 text-slate-300">{insight || "Analyzing your momentum…"}</p></Card>
      <Card><p className="text-xs uppercase tracking-widest text-slate-400">Recent activity</p>
        <ul className="mt-2 space-y-1.5 text-sm">{project.timeline.slice(-4).reverse().map((e) => (<li key={e.id} className="flex gap-2"><CheckCircle2 size={15} className="text-mint mt-0.5" /><span>{e.title}</span></li>))}</ul>
        <button className="text-xs text-accent-300 mt-2" onClick={() => onTab("progress")}>View growth timeline →</button>
      </Card>
      <Card className="md:col-span-3"><p className="font-semibold">Project overview</p>
        <p className="text-sm text-slate-400 mt-1"><b className="text-slate-200">Problem:</b> {project.analysis.problem}</p>
        <div className="mt-2 flex flex-wrap gap-2">{project.analysis.recommendedStack.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        <div className="mt-2 grid md:grid-cols-3 gap-2 text-xs text-slate-400">
          <div><b className="text-slate-200">Core:</b> {project.analysis.coreFeatures.slice(0, 3).join(" · ")}</div>
          <div><b className="text-slate-200">Skills:</b> {project.analysis.skillsToLearn.slice(0, 4).join(" · ")}</div>
          <div><b className="text-slate-200">Risks:</b> {project.analysis.risks.slice(0, 2).join(" · ")}</div>
        </div>
      </Card>
    </div>
  );
}

function Roadmap({ onComplete }: any) {
  const { project } = useStore();
  const [open, setOpen] = useState<string | null>(project?.milestones.find((m) => m.status === "current")?.id ?? null);
  if (!project) return null;
  return (
    <div className="space-y-3">
      {project.milestones.map((m, i) => (
        <Card key={m.id} className={m.status === "current" ? "border-accent-400/40" : ""}>
          <button className="w-full text-left flex items-center gap-3" onClick={() => setOpen(open === m.id ? null : m.id)} aria-expanded={open === m.id}>
            <span className="text-xs font-bold text-slate-500">0{i + 1}</span>
            <span className="font-semibold">{m.title}</span>
            <span className="ml-auto text-xs flex items-center gap-1">{m.status === "completed" ? <><CheckCircle2 size={14} className="text-mint" /> Completed</> : m.status === "current" ? <span className="text-accent-300">→ Current</span> : <><Lock size={14} /> Locked</>}</span>
          </button>
          {open === m.id && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm space-y-2">
              <p className="text-slate-400">{m.objective}</p>
              <p className="text-xs">Skills: {m.skills.join(", ")} · Difficulty: {m.difficulty}</p>
              <p className="text-xs text-slate-400">Done when: {m.criteria.join(" · ")}</p>
              {m.tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 rounded-xl border border-white/10 p-2.5">
                  <button aria-label={`Toggle ${t.title}`} onClick={() => onComplete(m.id, t.id)}>{t.status === "COMPLETED" ? <CheckCircle2 size={17} className="text-mint" /> : <Circle size={17} className="text-slate-500" />}</button>
                  <div><p className="font-medium text-[13px]">{t.title} <span className="text-[11px] text-slate-500">· {t.status} · {t.estimatedTime}</span></p>
                  <p className="text-xs text-slate-400">{t.description}</p></div>
                </div>
              ))}
              <div className="text-xs">{m.resources.map((r) => <a key={r.label} className="text-accent-300 underline mr-3" href={r.url} target="_blank" rel="noreferrer">{r.label}</a>)}</div>
            </motion.div>
          )}
        </Card>
      ))}
    </div>
  );
}

function Tasks({ onStatus }: any) {
  const { project } = useStore();
  const [filter, setFilter] = useState("ALL");
  if (!project) return null;
  const items = project.milestones.flatMap((m) => m.tasks.map((t) => ({ ...t, mid: m.id })));
  const shown = filter === "ALL" ? items : items.filter((t) => t.status === filter);
  if (!items.length) return <Empty title="No tasks" body="Tasks appear after roadmap generation." />;
  return (
    <div className="space-y-2">
      <div className="flex gap-2" role="tablist" aria-label="Filter tasks">
        {["ALL", "TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"].map((f) => (
          <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs border ${filter === f ? "bg-accent-500/20 border-accent-400" : "border-white/10"}`}>{f}</button>))}
      </div>
      {shown.map((t) => (
        <Card key={t.id} className="flex items-center gap-3 !p-3">
          <button aria-label={`Complete ${t.title}`} onClick={() => onStatus(t.mid, t.id, t.status === "COMPLETED" ? "TODO" : "COMPLETED")}>
            {t.status === "COMPLETED" ? <CheckCircle2 className="text-mint" size={20} /> : <Circle className="text-slate-500" size={20} />}
          </button>
          <div className="min-w-0"><p className="text-sm font-medium truncate">{t.title}</p><p className="text-xs text-slate-500">{t.difficulty} · {t.estimatedTime} · {t.skills.join(", ")}</p></div>
          <div className="ml-auto flex gap-1">
            <button className="text-[11px] border border-white/10 rounded-lg px-2 py-1" onClick={() => onStatus(t.mid, t.id, "IN_PROGRESS")}>Start</button>
            <button className="text-[11px] border border-white/10 rounded-lg px-2 py-1" onClick={() => onStatus(t.mid, t.id, "BLOCKED")}>Block</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

const LESSONS: Record<string, { why: string; learn: string[]; concept: string; example: string; tryIt: string }> = {
  "REST API Authentication": { why: "Every protected feature depends on knowing who is calling.", learn: ["Sessions vs tokens", "Middleware checks", "Scoping queries by user"], concept: "Sign-in proves identity once; the session proves it on every request via a cookie. If creation, transport, or DB lookup breaks, protected routes fail.", example: "if (!session?.user?.id) return 401; const plans = await db.plan.findMany({ where: { userId: session.user.id } });", tryIt: "Log session?.user?.id right before your failing query. Is it defined? Report back." },
  "PostgreSQL Relationships": { why: "Plans without linked tasks are just text files.", learn: ["One-to-many", "Foreign keys", "Seeding"], concept: "A Plan has many StudyTasks via planId. The seed script creates both so joins return real rows.", example: "model StudyTask { id String @id; planId String; plan Plan @relation(fields:[planId], references:[id]) }", tryIt: "Add one task to your seed and re-run: does the plan query include it?" }
};

function Learn() {
  const { project } = useStore();
  const [topic, setTopic] = useState("REST API Authentication");
  const [confused, setConfused] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const L = LESSONS[topic];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Topics</p>
        {Object.keys(LESSONS).map((k) => (
          <button key={k} onClick={() => { setTopic(k); setConfused(false); setUnderstood(false); }} className={`block w-full text-left rounded-xl border p-3 text-sm ${topic === k ? "border-accent-400 bg-accent-500/10" : "border-white/10"}`}>{k}<span className="block text-xs text-slate-500">Level: {project?.level}</span></button>))}
      </Card>
      <Card className="md:col-span-2">
        <h2 className="text-xl font-bold">{topic}</h2>
        <div className="mt-3 space-y-3 text-sm">
          <section><h3 className="font-semibold text-accent-300">WHY IT MATTERS</h3><p className="text-slate-300">{L.why}</p></section>
          <section><h3 className="font-semibold text-accent-300">WHAT YOU&apos;LL LEARN</h3><ul className="list-disc ml-5 text-slate-300">{L.learn.map((x) => <li key={x}>{x}</li>)}</ul></section>
          <section><h3 className="font-semibold text-accent-300">CONCEPT</h3><p className="text-slate-300">{confused ? "Simpler take: think of a concert wristband. Sign-in puts it on; every door (route) just checks the band (session). No band → no entry. Debugging = find where the band got lost." : L.concept}</p></section>
          <section><h3 className="font-semibold text-accent-300">EXAMPLE</h3><pre className="rounded-xl bg-black/40 border border-white/10 p-3 text-xs overflow-x-auto"><code>{L.example}</code></pre></section>
          <section><h3 className="font-semibold text-accent-300">TRY IT</h3><p className="text-slate-300">{L.tryIt}</p></section>
          <section><h3 className="font-semibold text-accent-300">REFLECT</h3><p className="text-slate-400 text-[13px]">In one sentence: what would break if the session were missing?</p></section>
        </div>
        <div className="mt-4 flex gap-2">
          <Btn onClick={() => setUnderstood(true)}>I understand</Btn>
          <Btn variant="ghost" onClick={() => setConfused(true)}>Still confused</Btn>
        </div>
        {understood && <p role="status" className="mt-2 text-sm text-mint">Nice — logged. Your skill bar moved +5%.</p>}
      </Card>
    </div>
  );
}

function Mentor() {
  const { project } = useStore();
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([{ role: "ai", content: "I'm your contextual mentor — I know your milestone, level, and history. Tell me where you're stuck." }]);
  const [input, setInput] = useState("");
  const [debug, setDebug] = useState({ error: "", expected: "", actual: "", code: "" });
  const [showDebug, setShowDebug] = useState(false);
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const message = text ?? input;
    if (!message.trim() || !project) return;
    setMsgs((m) => [...m, { role: "user", content: message }]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/mentor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project, message }) });
      const j = await res.json();
      setMsgs((m) => [...m, { role: "ai", content: j.reply }]);
    } catch { setMsgs((m) => [...m, { role: "ai", content: "Mentor unavailable — try demo mode." }]); }
    setLoading(false);
  }

  async function sendDebug() {
    setLoading(true);
    const res = await fetch("/api/mentor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "debug", ...debug }) });
    const j = await res.json();
    setMsgs((m) => [...m, { role: "ai", content: j.reply }]);
    setLoading(false); setShowDebug(false);
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <div className="space-y-2 max-h-80 overflow-y-auto" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`rounded-xl p-3 text-sm whitespace-pre-line ${m.role === "ai" ? "bg-white/5 border border-white/10" : "bg-accent-500/15 border border-accent-400/30 ml-8"}`}>{m.content}</div>))}
          {loading && <p className="text-xs text-slate-500">Mentor is thinking…</p>}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} aria-label="Ask mentor" placeholder="I'm stuck on…" className="flex-1 rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm" />
          <Btn onClick={() => send()}>Send</Btn>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {[["Explain concept", "Explain authentication simply"], ["Give hint", "Give me a hint"], ["Debugging checklist", "I'm stuck, debugging checklist"], ["Review approach", "Review my approach: I scoped queries by userId"]].map(([label, q]) => (
            <button key={label} onClick={() => send(q)} className="rounded-full border border-white/10 px-3 py-1 hover:bg-white/5">[{label}]</button>))}
          <button onClick={() => setShowDebug(!showDebug)} className="rounded-full border border-accent-400/40 px-3 py-1 text-accent-300"><Bug size={12} className="inline" /> Debug With Me</button>
        </div>
        {showDebug && (
          <div className="mt-3 grid gap-2 text-sm">
            {[["error", "Error message"], ["expected", "What you expected"], ["actual", "What actually happened"], ["code", "Relevant code snippet"]].map(([k, ph]) => (
              <textarea key={k} aria-label={ph} placeholder={ph} value={(debug as any)[k]} onChange={(e) => setDebug({ ...debug, [k]: e.target.value })} className="rounded-xl border border-white/10 bg-ink-900 p-2.5" rows={k === "code" ? 4 : 2} />
            ))}
            <Btn onClick={sendDebug}>Analyze bug</Btn>
          </div>
        )}
      </Card>
      <Card><p className="text-xs uppercase tracking-widest text-slate-400">Project Health</p><HealthBlock /></Card>
    </div>
  );
}

function HealthBlock() {
  const { project } = useStore();
  const data = useMemo(() => {
    if (!project) return null;
    const tasks = project.milestones.flatMap((m) => m.tasks);
    const done = tasks.filter((t) => t.status === "COMPLETED").length;
    const pct = Math.round((done / Math.max(tasks.length, 1)) * 100);
    return [
      ["Progress", `${pct}%`], ["Momentum", pct > 40 ? "High" : "Building"], ["Learning", "Strong"], ["Complexity", "Medium"], ["Risk", tasks.some((t) => t.status === "BLOCKED") ? "Medium" : "Low"]
    ];
  }, [project]);
  if (!data || !project) return null;
  return <div className="mt-2 space-y-1.5 text-sm">{data.map(([k, v]) => (<div key={k} className="flex justify-between border-b border-white/5 py-1"><span className="text-slate-400">{k}</span><b>{v}</b></div>))}<p className="text-xs text-slate-400 pt-2">{healthInsight(project)}</p></div>;
}

function Progress({ pct }: { pct: number }) {
  const { project } = useStore();
  const [report, setReport] = useState("");
  if (!project) return null;
  async function graduate() {
    const res = await fetch("/api/mentor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "report", project }) });
    const j = await res.json();
    setReport(j.report);
  }
  const allDone = project.milestones.every((m) => m.status === "completed");
  return (
    <div className="space-y-4">
      <Card><p className="font-semibold">Growth Timeline</p>
        <ol className="mt-3 space-y-3">{project.timeline.map((e) => (
          <li key={e.id} className="flex gap-3"><span className="text-[11px] font-bold text-accent-300 w-14 shrink-0">{e.day}</span><div><p className="text-sm font-medium">{e.title}</p><p className="text-xs text-slate-400">{e.detail}{e.skill ? ` · Skill: ${e.skill}` : ""}</p></div></li>))}
        </ol>
      </Card>
      <Card><p className="font-semibold flex items-center gap-2"><Trophy size={16} className="text-mint" /> Achievements · {project.xp} XP · <Flame size={14} /> {project.streak} days</p>
        <div className="mt-2 flex flex-wrap gap-2">{project.achievements.map((a) => <Badge key={a}>{a}</Badge>)}</div>
      </Card>
      <Card>
        <p className="font-bold text-lg">{allDone ? "PROJECT COMPLETE 🎉" : `Project Graduation (${pct}%)`}</p>
        <p className="text-sm text-slate-400">Milestones {project.milestones.filter((m) => m.status === "completed").length}/{project.milestones.length} · Tasks {project.milestones.flatMap((m) => m.tasks).filter((t) => t.status === "COMPLETED").length}/{project.milestones.flatMap((m) => m.tasks).length} · Skills {project.skillProgress.length}</p>
        <div className="mt-3"><Btn onClick={graduate}>Generate final report</Btn></div>
        {report && <p className="mt-3 text-sm whitespace-pre-line rounded-xl bg-white/5 border border-white/10 p-3">{report}</p>}
      </Card>
    </div>
  );
}

function Journal() {
  const { project, update } = useStore();
  const [form, setForm] = useState({ learned: "", difficult: "", different: "", surprise: "" });
  if (!project) return null;
  function save() {
    if (!form.learned.trim()) return;
    update((p) => {
      p.journal.push({ id: `j-${Date.now()}`, date: `Day ${p.timeline.length + 1}`, learned: form.learned, difficult: form.difficult, different: form.different, surprise: form.surprise, summary: `You reflected honestly: ${form.learned.slice(0, 80)}…` });
      if (!p.achievements.includes("Deep Reflector")) p.achievements.push("Deep Reflector");
      return p;
    });
    setForm({ learned: "", difficult: "", different: "", surprise: "" });
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <p className="font-semibold">New reflection</p>
        {[["learned", "What did you learn?"], ["difficult", "What was difficult?"], ["different", "What would you do differently?"], ["surprise", "What surprised you?"]].map(([k, ph]) => (
          <textarea key={k} aria-label={ph} placeholder={ph} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 p-2.5 text-sm" rows={2} />
        ))}
        <div className="mt-3"><Btn onClick={save}>Save reflection</Btn></div>
      </Card>
      <div className="space-y-2">
        {project.journal.slice().reverse().map((j) => (
          <Card key={j.id}><p className="text-xs text-slate-500">{j.date}</p><p className="text-sm mt-1">{j.learned}</p><p className="text-xs text-slate-400 mt-1">Difficult: {j.difficult} · Different: {j.different}</p>{j.summary && <p className="text-xs text-accent-300 mt-1">AI: {j.summary}</p>}</Card>))}
        {!project.journal.length && <Empty title="No reflections yet" body="Complete a milestone, then reflect here." />}
      </div>
    </div>
  );
}

function SettingsView({ reset }: { reset: () => void }) {
  const { project, loadDemo } = useStore();
  return (
    <Card>
      <p className="font-semibold">Settings</p>
      <p className="text-sm text-slate-400 mt-1">AI provider: <b className="text-slate-200">env-configured (Mistral/OpenAI live with demo fallback)</b> · Set AI_PROVIDER + AI_API_KEY for live mode. Auth: demo session. Data persists in this browser (localStorage); Prisma schema included for Postgres prod.</p>
      <p className="text-xs text-slate-500 mt-2">Project: {project?.id}</p>
      <div className="mt-3 flex gap-2"><Btn variant="ghost" onClick={loadDemo}>Reload demo</Btn><Btn variant="ghost" onClick={reset}>Reset workspace</Btn></div>
    </Card>
  );
}

export default function Page() {
  return <StoreProvider><Suspense fallback={<main className="p-10 text-sm text-slate-400">Loading dashboard…</main>}><Shell /></Suspense></StoreProvider>;
}
