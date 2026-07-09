export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee_id?: string;
  workspace_id: string;
  owner_id: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  tag_ids: string[];
  comments?: Comment[];
  subtasks?: SubTask[];
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  text: string;
  created_at: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  action: string;
  target_name: string;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_by: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
}

export type TaskStatus = "todo" | "in_progress" | "done" | "review";
export type Priority = "low" | "medium" | "high";

export type AccentColor = "indigo" | "emerald" | "rose" | "amber" | "violet" | "sky";

export const accentColorMap: Record<AccentColor, {
  bg: string;
  bgHover: string;
  text: string;
  textDark: string;
  bgLight: string;
  bgLightDark: string;
  ring: string;
  shadow: string;
  shadowFab: string;
}> = {
  indigo: {
    bg: "bg-indigo-600",
    bgHover: "bg-indigo-700",
    text: "text-indigo-600",
    textDark: "text-indigo-800",
    bgLight: "bg-indigo-50",
    bgLightDark: "bg-indigo-100",
    ring: "ring-indigo-500",
    shadow: "shadow-lg shadow-indigo-500/30",
    shadowFab: "shadow-xl shadow-indigo-500/40",
  },
  emerald: {
    bg: "bg-emerald-600",
    bgHover: "bg-emerald-700",
    text: "text-emerald-600",
    textDark: "text-emerald-800",
    bgLight: "bg-emerald-50",
    bgLightDark: "bg-emerald-100",
    ring: "ring-emerald-500",
    shadow: "shadow-lg shadow-emerald-500/30",
    shadowFab: "shadow-xl shadow-emerald-500/40",
  },
  rose: {
    bg: "bg-rose-600",
    bgHover: "bg-rose-700",
    text: "text-rose-600",
    textDark: "text-rose-800",
    bgLight: "bg-rose-50",
    bgLightDark: "bg-rose-100",
    ring: "ring-rose-500",
    shadow: "shadow-lg shadow-rose-500/30",
    shadowFab: "shadow-xl shadow-rose-500/40",
  },
  amber: {
    bg: "bg-amber-600",
    bgHover: "bg-amber-700",
    text: "text-amber-600",
    textDark: "text-amber-800",
    bgLight: "bg-amber-50",
    bgLightDark: "bg-amber-100",
    ring: "ring-amber-500",
    shadow: "shadow-lg shadow-amber-500/30",
    shadowFab: "shadow-xl shadow-amber-500/40",
  },
  violet: {
    bg: "bg-violet-600",
    bgHover: "bg-violet-700",
    text: "text-violet-600",
    textDark: "text-violet-800",
    bgLight: "bg-violet-50",
    bgLightDark: "bg-violet-100",
    ring: "ring-violet-500",
    shadow: "shadow-lg shadow-violet-500/30",
    shadowFab: "shadow-xl shadow-violet-500/40",
  },
  sky: {
    bg: "bg-sky-600",
    bgHover: "bg-sky-700",
    text: "text-sky-600",
    textDark: "text-sky-800",
    bgLight: "bg-sky-50",
    bgLightDark: "bg-sky-100",
    ring: "ring-sky-500",
    shadow: "shadow-lg shadow-sky-500/30",
    shadowFab: "shadow-xl shadow-sky-500/40",
  },
};