export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  skills: string[];
  status: TaskStatus;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  objective: string;
  skills: string[];
  tasks: Task[];
  resources: { label: string; url: string }[];
  difficulty: string;
  criteria: string[];
  status: "completed" | "current" | "locked";
}

export interface ProjectAnalysis {
  projectTitle: string;
  problem: string;
  targetUsers: string[];
  coreFeatures: string[];
  advancedFeatures: string[];
  recommendedStack: string[];
  difficulty: string;
  estimatedMilestones: string[];
  skillsToLearn: string[];
  risks: string[];
  firstMilestone: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  milestoneId?: string;
  learned: string;
  difficult: string;
  different: string;
  surprise: string;
  summary?: string;
}

export interface ProgressEvent {
  id: string;
  day: string;
  date: string;
  title: string;
  detail: string;
  skill?: string;
}

export interface ForgeProject {
  id: string;
  idea: string;
  level: SkillLevel;
  interests: string[];
  goal: string;
  analysis: ProjectAnalysis;
  milestones: Milestone[];
  journal: JournalEntry[];
  timeline: ProgressEvent[];
  skillProgress: { skill: string; pct: number }[];
  achievements: string[];
  xp: number;
  streak: number;
  createdAt: string;
}
