# LearnForge

Turn an idea into a project. Turn a project into skills.

## Problem

Most beginners don't fail because they cannot write code. They get stuck because they don't know what to build, what to learn, what to do next, why their code isn't working, or whether they are actually improving.

## Solution

LearnForge is an AI-powered project-building mentor: IDEA → PLAN → LEARN → BUILD → TEST → REFLECT → SHIP. It generates a structured roadmap, teaches at your level, debugs educationally, tracks health/momentum, journals growth, and graduates you with a shareable report.

## Features

- Guided onboarding (idea → level → interests → goal → AI plan)
- AI project analyzer (structured JSON → beautiful overview)
- Interactive roadmap + task system (TODO/IN_PROGRESS/BLOCKED/COMPLETED)
- Learning Mode (WHY / LEARN / CONCEPT / EXAMPLE / TRY IT / REFLECT, level-aware)
- Contextual AI mentor + Debug With Me (no solution-dumps)
- Project Health, Growth Timeline, Journal + AI summaries
- Gamification (XP, streaks, badges), Graduation report, Demo mode

## Architecture

- Frontend: Next.js 14 App Router + React + Tailwind + Framer Motion + Lucide
- Backend: Next.js API routes (`/api/analyze`, `/api/mentor`) — server-side AI only
- Persistence: browser localStorage (demo/local) + Prisma schema ready for Postgres prod
- AI layer: `lib/ai/engine.ts` abstraction (demo deterministic ↔ live provider), prompts in `lib/ai/prompts.ts`

## Tech Stack

Next.js, TypeScript, Tailwind, Framer Motion, Lucide, Prisma (schema), Auth-ready (demo session)

## AI Architecture

System prompts per capability: analyzer, roadmap, tutor, mentor, debugger, reflection, health, report. Structured JSON outputs; UI never renders raw JSON. `AI_PROVIDER=demo` gives deterministic realistic responses; set `AI_PROVIDER=openai` + `AI_API_KEY` for live calls (never exposed to browser).

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Golden path: Start Building → enter idea → Generate plan → Roadmap → complete a task → Learn → Mentor → Progress → report. Or click **Explore Demo** for the pre-seeded "AI Study Planner".

## Environment Variables

| Var | Purpose |
|-----|---------|
| AI_PROVIDER | `demo` or `openai` |
| AI_API_KEY | server-side key for live mode |
| DATABASE_URL | Postgres (prod) / sqlite file (local) |
| NEXT_PUBLIC_DEMO_MODE | show demo affordances |

## Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Local default uses sqlite (`file:./dev.db`); set `DATABASE_URL` to Postgres in prod. Runtime demo persistence uses localStorage so the hackathon demo works with zero infra.

## Demo Mode

Visit `/dashboard?demo=1` or click Explore Demo. Seeded project: AI Study Planner, 6 milestones, 30+ tasks across states, skills, journal, timeline, insights.

## AI Disclosure

AI coding assistance was used to scaffold and accelerate development. In-product AI (analyzer, mentor, debugger, health, report) runs through the `lib/ai` abstraction; demo mode uses deterministic hand-authored responses so judging never depends on network keys.

## Challenges

- Keeping AI structured (JSON-only prompts + fallback parser)
- Making the mentor contextual without dumping solutions
- Zero-infra demo stability (localStorage + demo seed) while keeping Prisma/Postgres credibility

## What I Learned

- Structured AI outputs beat free-form text for product UX
- Teaching prompts (hint-first, checklist-first) feel more intelligent than answer-bots
- Golden-path demo design matters as much as features (customize this section with your own learnings)

## License

MIT
