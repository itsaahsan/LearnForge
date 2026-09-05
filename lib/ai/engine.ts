import { PROMPTS } from "./prompts";
import { ForgeProject, ProjectAnalysis } from "../types";
import { DEMO_PROJECT } from "../demo-data";

export const AI_PROVIDER = (process.env.AI_PROVIDER || "demo").toLowerCase();
export const AI_MODE = AI_PROVIDER !== "demo" && !!process.env.AI_API_KEY ? "live" : "demo";

function providerConfig() {
  if (AI_PROVIDER === "mistral") {
    return { url: "https://api.mistral.ai/v1/chat/completions", model: process.env.AI_MODEL || "mistral-small-latest" };
  }
  return { url: "https://api.openai.com/v1/chat/completions", model: process.env.AI_MODEL || "gpt-4o-mini" };
}

async function chatComplete(system: string, user: string, jsonMode: boolean): Promise<string> {
  const { url, model } = providerConfig();
  const body: Record<string, unknown> = { model, messages: [{ role: "system", content: system }, { role: "user", content: user }] };
  if (jsonMode) body.response_format = { type: "json_object" };
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`AI provider ${res.status}`);
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return content;
}

function normalizeAnalysis(raw: any, fallback: ProjectAnalysis): ProjectAnalysis {
  const arr = (v: any) => (Array.isArray(v) && v.length ? v.map(String) : null);
  return {
    projectTitle: typeof raw.projectTitle === "string" && raw.projectTitle.trim() ? raw.projectTitle.trim().slice(0, 80) : fallback.projectTitle,
    problem: typeof raw.problem === "string" && raw.problem.trim() ? raw.problem.slice(0, 500) : fallback.problem,
    targetUsers: arr(raw.targetUsers) ?? fallback.targetUsers,
    coreFeatures: arr(raw.coreFeatures) ?? fallback.coreFeatures,
    advancedFeatures: arr(raw.advancedFeatures) ?? fallback.advancedFeatures,
    recommendedStack: arr(raw.recommendedStack) ?? fallback.recommendedStack,
    difficulty: typeof raw.difficulty === "string" ? raw.difficulty : fallback.difficulty,
    estimatedMilestones: arr(raw.estimatedMilestones) ?? fallback.estimatedMilestones,
    skillsToLearn: arr(raw.skillsToLearn) ?? fallback.skillsToLearn,
    risks: arr(raw.risks) ?? fallback.risks,
    firstMilestone: typeof raw.firstMilestone === "string" ? raw.firstMilestone : fallback.firstMilestone
  };
}

function demoTitle(idea: string): string {
  let s = ` ${idea.toLowerCase()} `;
  const prefixes = ["i want to build", "i want to create", "i want to make", "i wanna build",
    "build", "create", "make", "an app that", "a app that", "an app to", "a app to", "an app for",
    "a app for", "an app", "a app", "an application", "a application", "a tool", "a website",
    "a site", "a platform", "that helps", "that help", "to help", "for helping", "a", "an", "the", "my"];
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of prefixes) {
      if (s.startsWith(` ${p} `)) { s = s.slice(p.length + 1); changed = true; break; }
    }
  }
  let words = s.replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).slice(0, 3);
  const trailing = new Set(["with", "and", "for", "to", "of", "the", "a", "an", "in", "on", "that"]);
  while (words.length > 2 && trailing.has(words[words.length - 1])) words.pop();
  if (words.length < 2) return "Student Finance Assistant";
  return toTitle(words.join(" "));
}

function demoAnalysis(idea: string, level: string, interests: string[], goal: string): ProjectAnalysis {
  return {
    projectTitle: demoTitle(idea),
    problem: `Beginners know the idea (${idea.slice(0, 90)}…) but get stuck on what to build first, what to learn, and what to do next.`,
    targetUsers: ["Beginner developers", "Students building portfolio", "Hackathon teams"],
    coreFeatures: ["User accounts + profiles", "Core data CRUD", "Dashboard with progress", "Search / filtering", "Responsive UI"],
    advancedFeatures: ["AI-assisted suggestions", "Realtime updates", "Analytics + insights"],
    recommendedStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma + PostgreSQL", "Auth.js", "Vercel"],
    difficulty: level === "Beginner" ? "Beginner-friendly" : level === "Advanced" ? "Advanced" : "Intermediate",
    estimatedMilestones: ["Foundation", "Database", "Authentication", "Core Features", "Testing", "Deployment"],
    skillsToLearn: interests.length ? interests : ["React", "TypeScript", "APIs", "Databases"],
    risks: ["Scope creep", "Auth edge cases", "Skipping tests before new features"],
    firstMilestone: "Project Foundation — scaffold the app, model the data, and ship the first input form."
  };
}

function toTitle(s: string) {
  const acronyms = new Set(["ai", "api", "ui", "ux", "db", "qa", "xp", "mvp", "url"]);
  return s.split(" ").map((w) => (acronyms.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
}

export async function analyzeProject(input: { idea: string; level: string; interests: string[]; goal: string }): Promise<ProjectAnalysis> {
  const fallback = demoAnalysis(input.idea, input.level, input.interests, input.goal);
  if (AI_MODE === "demo") return fallback;
  // Live provider call (server-side only). Falls back to demo on any failure.
  try {
    const content = await chatComplete(PROMPTS.analyzer, JSON.stringify(input), true);
    return normalizeAnalysis(JSON.parse(content), fallback);
  } catch {
    return fallback;
  }
}

export function demoRoadmapFromAnalysis(a: ProjectAnalysis) {
  // Clone demo milestones but retitle project-specific bits
  const m = structuredClone(DEMO_PROJECT.milestones);
  return m;
}

export function mentorReply(project: ForgeProject, message: string): string {
  const current = project.milestones.find((m) => m.status === "current");
  const msg = message.toLowerCase();
  if (msg.includes("explain")) return `Concept bite: authentication = proving *who you are* (sign-in) + proving it on *every request* (session). Sessions fail when creation, transport (cookies), or lookup (DB) breaks. Which of those three feels shakiest in your code?`;
  if (msg.includes("stuck") || msg.includes("auth") || msg.includes("session")) {
    return `You're working on **${current?.title ?? "your current milestone"}**.\n\nBefore changing code, check these three things:\n1. Is the session being created? (log \`session\` in your auth callback)\n2. Is the user ID reaching the protected route? (check middleware + headers)\n3. Is the DB query scoped with \`where: { userId }\`?\n\nLet's debug them one at a time — tell me what step 1 shows and I'll guide the next move.`;
  }
  if (msg.includes("hint")) return `Hint: shrink the problem. Reproduce with the smallest input, read the exact error line, then isolate: input → logic → output. Your next action: write down expected vs actual for **${current?.title}**.`;
  return `Good question. Given you're at **${current?.title}** (${project.level} level), here's the move: restate the goal in one sentence, list what you've tried, then run the smallest test that could prove you wrong. Share the result and I'll give the next precise step — no solution-dump, you'll own the fix.`;
}

export function debugReply(input: { error: string; expected: string; actual: string; code: string }): string {
  return `**PROBABLE CAUSE**\n${input.error.slice(0, 140) || "Unhandled exception"} — likely a data-shape or auth-scope issue.\n\n**WHY IT HAPPENS**\nCode assumes a value (session/user/row) exists, but at runtime it's null at that line.\n\n**DEBUGGING STEPS**\n1. Reproduce with minimal input\n2. Log the value just before the failing line\n3. Check transport (cookies/headers) then lookup (DB query)\n4. Fix the narrowest cause; add a guard + test\n\n**HINT**\nAdd \`console.log({ sessionUser: session?.user?.id })\` before the query — if it's undefined, the bug is upstream of the DB.\n\n**WHAT TO LEARN**\nAuth scoping + null-safety + reading stack traces.`;
}

export async function mentorReplyLive(project: ForgeProject, message: string): Promise<string> {
  if (AI_MODE === "demo") return mentorReply(project, message);
  const current = project.milestones.find((m) => m.status === "current");
  const ctx = `Project: ${project.analysis.projectTitle} (${project.level}). Current milestone: ${current?.title} — ${current?.objective}. Completed tasks: ${project.milestones.flatMap((m) => m.tasks).filter((t) => t.status === "COMPLETED").map((t) => t.title).join("; ") || "none"}. Skills: ${project.skillProgress.map((s) => s.skill).join(", ")}.`;
  try {
    return (await chatComplete(PROMPTS.mentor, `${ctx}\n\nUser: ${message}`, false)).slice(0, 1500);
  } catch {
    return mentorReply(project, message);
  }
}

export async function debugReplyLive(input: { error: string; expected: string; actual: string; code: string }): Promise<string> {
  if (AI_MODE === "demo") return debugReply(input);
  try {
    return (await chatComplete(PROMPTS.debugger, JSON.stringify(input), false)).slice(0, 2000);
  } catch {
    return debugReply(input);
  }
}

export async function healthInsightLive(project: ForgeProject): Promise<string> {
  if (AI_MODE === "demo") return healthInsight(project);
  const stats = `Milestones: ${project.milestones.map((m) => `${m.title}:${m.status}`).join(", ")}. Tasks: ${project.milestones.flatMap((m) => m.tasks).map((t) => `${t.title}:${t.status}`).join("; ")}. XP ${project.xp}, streak ${project.streak}.`;
  try {
    return (await chatComplete(PROMPTS.health, stats, false)).slice(0, 800);
  } catch {
    return healthInsight(project);
  }
}

export async function reportLive(project: ForgeProject): Promise<string> {
  if (AI_MODE === "demo") return reportFallback(project);
  const stats = `Project: ${project.analysis.projectTitle}. Milestones: ${project.milestones.filter((m) => m.status === "completed").length}/${project.milestones.length}. Journal: ${JSON.stringify(project.journal)}. Skills: ${project.skillProgress.map((s) => `${s.skill} ${s.pct}%`).join(", ")}.`;
  try {
    return (await chatComplete(PROMPTS.report, stats, false)).slice(0, 2000);
  } catch {
    return reportFallback(project);
  }
}

function reportFallback(p: ForgeProject): string {
  return `You built ${p.analysis.projectTitle} in a structured journey: ${p.milestones.filter((m) => m.status === "completed").length}/${p.milestones.length} milestones, ${p.journal.length} reflections, and ${p.skillProgress.length} growing skills. Next: add tests, polish auth edge cases, and deploy.`;
}
export function healthInsight(project: ForgeProject): string {
  const total = project.milestones.flatMap((m) => m.tasks);
  const done = total.filter((t) => t.status === "COMPLETED").length;
  const pct = Math.round((done / Math.max(total.length, 1)) * 100);
  const blocked = total.filter((t) => t.status === "BLOCKED").length;
  if (blocked > 0) return `Your project is progressing well at ${pct}%. You have ${blocked} blocked task(s) — unblock those before adding features to protect momentum.`;
  if (pct < 50) return `Solid foundation at ${pct}%. Core architecture is forming — keep tasks small and demo weekly to protect momentum.`;
  return `Your project is progressing well at ${pct}%. Core architecture is done but testing hasn't started — consider adding tests before introducing new features.`;
}
