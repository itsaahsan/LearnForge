import { ForgeProject } from "./types";

export const DEMO_PROJECT: ForgeProject = {
  id: "demo-ai-study-planner",
  idea: "An AI study planner that turns a syllabus into a weekly plan with reminders and progress tracking.",
  level: "Beginner",
  interests: ["React", "TypeScript", "APIs", "Databases", "AI", "Authentication"],
  goal: "Build portfolio",
  analysis: {
    projectTitle: "AI Study Planner",
    problem: "Students struggle to turn syllabi and deadlines into a realistic weekly study plan they actually follow.",
    targetUsers: ["College students", "Bootcamp learners", "Self-taught developers"],
    coreFeatures: ["Syllabus parser", "Weekly plan generator", "Task checklist with streaks", "Progress dashboard", "Reminder scheduling"],
    advancedFeatures: ["AI re-planning when you fall behind", "Spaced-repetition suggestions", "Study-session timer with focus score"],
    recommendedStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma + PostgreSQL", "NextAuth", "OpenAI-compatible API"],
    difficulty: "Beginner-friendly (Intermediate stretch goals)",
    estimatedMilestones: ["Foundation", "Database", "Authentication", "Core Features", "Testing", "Deployment"],
    skillsToLearn: ["React", "TypeScript", "API Design", "PostgreSQL", "Authentication", "AI Integration", "Testing", "Deployment"],
    risks: ["Scope creep on AI features", "Auth session edge cases", "Under-testing the planner logic"],
    firstMilestone: "Project Foundation — scaffold the app, design the data model, and ship a syllabus input form."
  },
  milestones: [
    { id: "m1", title: "Project Foundation", objective: "Scaffold Next.js app, design schema, ship syllabus input UI.", skills: ["React", "TypeScript"], difficulty: "Easy", criteria: ["App runs locally", "Syllabus form saves input"], status: "completed", resources: [{ label: "Next.js App Router docs", url: "https://nextjs.org/docs" }], tasks: [
      { id: "m1t1", title: "Scaffold Next.js + Tailwind", description: "Create app, configure Tailwind, verify build.", difficulty: "Easy", estimatedTime: "1h", skills: ["React"], status: "COMPLETED" },
      { id: "m1t2", title: "Design data model", description: "Plan tables: Plan, Task, Session.", difficulty: "Medium", estimatedTime: "2h", skills: ["PostgreSQL"], status: "COMPLETED" },
      { id: "m1t3", title: "Build syllabus input form", description: "Textarea + validation + preview.", difficulty: "Easy", estimatedTime: "2h", skills: ["React", "TypeScript"], status: "COMPLETED" },
      { id: "m1t4", title: "Add empty/loading states", description: "Polish first-run UX.", difficulty: "Easy", estimatedTime: "1h", skills: ["React"], status: "COMPLETED" }
    ]},
    { id: "m2", title: "Database", objective: "Persist plans, tasks and sessions with Prisma.", skills: ["PostgreSQL", "API Design"], difficulty: "Medium", criteria: ["CRUD works", "Relations correct"], status: "completed", resources: [{ label: "Prisma schema reference", url: "https://www.prisma.io/docs" }], tasks: [
      { id: "m2t1", title: "Define Prisma schema", description: "User, Project, Plan, StudyTask models.", difficulty: "Medium", estimatedTime: "2h", skills: ["PostgreSQL"], status: "COMPLETED" },
      { id: "m2t2", title: "Seed demo data", description: "Realistic syllabus + weekly plan.", difficulty: "Easy", estimatedTime: "1h", skills: ["PostgreSQL"], status: "COMPLETED" },
      { id: "m2t3", title: "Build plan API routes", description: "GET/POST plans with validation.", difficulty: "Medium", estimatedTime: "3h", skills: ["API Design"], status: "COMPLETED" },
      { id: "m2t4", title: "Learn relationships", description: "One-to-many Plan→Tasks exercise.", difficulty: "Medium", estimatedTime: "2h", skills: ["PostgreSQL"], status: "COMPLETED" }
    ]},
    { id: "m3", title: "Authentication", objective: "Users sign in; plans are private.", skills: ["Authentication"], difficulty: "Medium", criteria: ["Protected routes work", "Only own data visible"], status: "current", resources: [{ label: "Auth.js guide", url: "https://authjs.dev" }], tasks: [
      { id: "m3t1", title: "Add sign-in / sign-out", description: "OAuth + session display.", difficulty: "Medium", estimatedTime: "3h", skills: ["Authentication"], status: "COMPLETED" },
      { id: "m3t2", title: "Protect plan routes", description: "Middleware + server checks.", difficulty: "Medium", estimatedTime: "2h", skills: ["Authentication"], status: "IN_PROGRESS" },
      { id: "m3t3", title: "Scope queries by user", description: "where: { userId } everywhere.", difficulty: "Easy", estimatedTime: "1h", skills: ["PostgreSQL"], status: "TODO" },
      { id: "m3t4", title: "Handle expired sessions", description: "Friendly re-login UX.", difficulty: "Easy", estimatedTime: "1h", skills: ["Authentication"], status: "TODO" },
      { id: "m3t5", title: "Debug session on protected route", description: "Use Debug With Me checklist.", difficulty: "Hard", estimatedTime: "2h", skills: ["Authentication", "API Design"], status: "BLOCKED", notes: "Session present but userId undefined on /api/plans." }
    ]},
    { id: "m4", title: "Core Features", objective: "Plan generator + checklist + streaks.", skills: ["AI Integration", "React"], difficulty: "Medium", criteria: ["Plan generates", "Checklist persists"], status: "locked", resources: [{ label: "Structured output prompting", url: "https://platform.openai.com/docs" }], tasks: [
      { id: "m4t1", title: "Syllabus → plan prompt", description: "Structured JSON plan output.", difficulty: "Medium", estimatedTime: "3h", skills: ["AI Integration"], status: "TODO" },
      { id: "m4t2", title: "Checklist UI", description: "Complete tasks, update progress.", difficulty: "Easy", estimatedTime: "2h", skills: ["React"], status: "TODO" },
      { id: "m4t3", title: "Streaks + XP", description: "Subtle gamification.", difficulty: "Easy", estimatedTime: "2h", skills: ["React"], status: "TODO" },
      { id: "m4t4", title: "Re-plan when behind", description: "AI re-balances remaining tasks.", difficulty: "Hard", estimatedTime: "4h", skills: ["AI Integration"], status: "TODO" }
    ]},
    { id: "m5", title: "Testing", objective: "Trust the planner logic.", skills: ["Testing"], difficulty: "Medium", criteria: ["Key flows tested"], status: "locked", resources: [{ label: "Vitest docs", url: "https://vitest.dev" }], tasks: [
      { id: "m5t1", title: "Unit-test plan splitter", description: "Edge cases: empty syllabus, overload.", difficulty: "Medium", estimatedTime: "2h", skills: ["Testing"], status: "TODO" },
      { id: "m5t2", title: "API route tests", description: "Auth + validation cases.", difficulty: "Medium", estimatedTime: "2h", skills: ["Testing"], status: "TODO" },
      { id: "m5t3", title: "Manual QA checklist", description: "Mobile + a11y pass.", difficulty: "Easy", estimatedTime: "1h", skills: ["Testing"], status: "TODO" }
    ]},
    { id: "m6", title: "Deployment", objective: "Ship it and share the report.", skills: ["Deployment"], difficulty: "Easy", criteria: ["Live URL", "Env vars set"], status: "locked", resources: [{ label: "Vercel deploy guide", url: "https://vercel.com/docs" }], tasks: [
      { id: "m6t1", title: "Deploy to Vercel", description: "Set env vars, verify build.", difficulty: "Easy", estimatedTime: "1h", skills: ["Deployment"], status: "TODO" },
      { id: "m6t2", title: "Add Postgres in prod", description: "Migrate + seed.", difficulty: "Medium", estimatedTime: "2h", skills: ["Deployment"], status: "TODO" },
      { id: "m6t3", title: "Write graduation report", description: "Generate final summary.", difficulty: "Easy", estimatedTime: "1h", skills: ["Deployment"], status: "TODO" }
    ]}
  ],
  journal: [
    { id: "j1", date: "Day 2", milestoneId: "m1", learned: "Scaffolded Next.js and built my first form with validation.", difficult: "Understanding server vs client components.", different: "Sketch the data model first.", surprise: "How fast a real UI comes together with Tailwind.", summary: "You set up the foundation and learned the App Router basics." },
    { id: "j2", date: "Day 4", milestoneId: "m2", learned: "Request validation, Prisma relations, and error handling.", difficult: "One-to-many relations clicked only after seeding real data.", different: "Write the seed script earlier.", surprise: "Seeded data made debugging 10x easier.", summary: "You started with limited API experience and learned validation, auth middleware concepts, and error handling." }
  ],
  timeline: [
    { id: "e1", day: "DAY 1", date: "Day 1", title: "Project idea created", detail: "Defined the AI Study Planner problem and users.", skill: "Problem framing" },
    { id: "e2", day: "DAY 2", date: "Day 2", title: "Learned App Router fundamentals", detail: "Server vs client components, routing, forms.", skill: "React" },
    { id: "e3", day: "DAY 4", date: "Day 4", title: "Completed Database milestone", detail: "Prisma schema, seed, plan APIs.", skill: "PostgreSQL" },
    { id: "e4", day: "DAY 7", date: "Day 7", title: "Solved session bug", detail: "Fixed userId not reaching protected route.", skill: "Authentication" },
    { id: "e5", day: "DAY 9", date: "Day 9", title: "Auth milestone in progress", detail: "Route protection + session handling.", skill: "Authentication" }
  ],
  skillProgress: [
    { skill: "React", pct: 80 }, { skill: "TypeScript", pct: 60 },
    { skill: "PostgreSQL", pct: 50 }, { skill: "API Design", pct: 70 },
    { skill: "Authentication", pct: 45 }, { skill: "AI Integration", pct: 30 },
    { skill: "Testing", pct: 15 }, { skill: "Deployment", pct: 10 }
  ],
  achievements: ["First Commit", "First API", "Database Explorer", "Debugging Detective"],
  xp: 1250,
  streak: 6,
  createdAt: new Date().toISOString()
};
