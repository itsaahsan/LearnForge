import { NextResponse } from "next/server";
import { analyzeProject, demoRoadmapFromAnalysis } from "@/lib/ai/engine";
import { ForgeProject } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { idea, level, interests, goal } = await req.json();
    if (!idea || typeof idea !== "string" || idea.length < 10 || idea.length > 2000)
      return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
    const analysis = await analyzeProject({ idea, level: level ?? "Beginner", interests: interests ?? [], goal: goal ?? "Learn" });
    const milestones = demoRoadmapFromAnalysis(analysis);
    const project: ForgeProject = {
      id: `p-${Date.now()}`, idea, level: level ?? "Beginner", interests: interests ?? [], goal: goal ?? "Learn",
      analysis, milestones,
      journal: [], timeline: [{ id: "e0", day: "DAY 1", date: "Day 1", title: "Project idea created", detail: idea.slice(0, 120), skill: "Problem framing" }],
      skillProgress: analysis.skillsToLearn.slice(0, 8).map((s) => ({ skill: s, pct: 10 })),
      achievements: ["First Commit"], xp: 50, streak: 1, createdAt: new Date().toISOString()
    };
    return NextResponse.json(project);
  } catch (e) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
