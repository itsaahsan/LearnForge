import { NextResponse } from "next/server";
import { mentorReplyLive, debugReplyLive, healthInsightLive, reportLive, AI_MODE } from "@/lib/ai/engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.mode === "debug") return NextResponse.json({ reply: await debugReplyLive(body), aiMode: AI_MODE });
    if (body.mode === "health") return NextResponse.json({ insight: await healthInsightLive(body.project), aiMode: AI_MODE });
    if (body.mode === "report") return NextResponse.json({ report: await reportLive(body.project), aiMode: AI_MODE });
    return NextResponse.json({ reply: await mentorReplyLive(body.project, body.message ?? ""), aiMode: AI_MODE });
  } catch {
    return NextResponse.json({ error: "Mentor failed" }, { status: 500 });
  }
}
