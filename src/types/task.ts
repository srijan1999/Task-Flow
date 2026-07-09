export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'sky';

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string; // Tailwind color class prefix, e.g., 'emerald', 'rose', 'indigo'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  workspaceId: string;
  dueDate: string;
  subtasks: SubTask[];
  comments: Comment[];
  tagIds?: string[]; // Array of Tag IDs assigned to this task
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  targetName: string;
  timestamp: string;
}

export interface AccentClasses {
  bg: string;
  bgHover: string;
  text: string;
  textDark: string;
  bgLight: string;
  bgLightDark: string;
  ring: string;
  shadow: string;
  shadowFab: string;
  border: string;
  borderDark: string;
  textMuted: string;
}

export const accentColorMap: Record<AccentColor, AccentClasses> = {
  indigo: {
    bg: 'bg-indigo-600',
    bgHover: 'hover:bg-indigo-700',
    text: 'text-indigo-600',
    textDark: 'dark:text-indigo-400',
    bgLight: 'bg-indigo-50',
    bgLightDark: 'dark:bg-indigo-950/50',
    ring: 'focus:ring-indigo-500',
    shadow: 'shadow-indigo-600/20',
    shadowFab: 'shadow-indigo-600/30',
    border: 'border-indigo-100',
    borderDark: 'dark:border-indigo-900/50',
    textMuted: 'text-indigo-400',
  },
  emerald: {
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-700',
    text: 'text-emerald-600',
    textDark: 'dark:text-emerald-400',
    bgLight: 'bg-emerald-50',
    bgLightDark: 'dark:bg-emerald-950/50',
    ring: 'focus:ring-emerald-500',
    shadow: 'shadow-emerald-600/20',
    shadowFab: 'shadow-emerald-600/30',
    border: 'border-emerald-100',
    borderDark: 'dark:border-emerald-900/50',
    textMuted: 'text-emerald-400',
  },
  rose: {
    bg: 'bg-rose-600',
    bgHover: 'hover:bg-rose-700',
    text: 'text-rose-600',
    textDark: 'dark:text-rose-400',
    bgLight: 'bg-rose-50',
    bgLightDark: 'dark:bg-rose-950/50',
    ring: 'focus:ring-rose-500',
    shadow: 'shadow-rose-600/20',
    shadowFab: 'shadow-rose-600/30',
    border: 'border-rose-100',
    borderDark: 'dark:border-rose-900/50',
    textMuted: 'text-rose-400',
  },
  amber: {
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-700',
    text: 'text-amber-600',
    textDark: 'dark:text-amber-400',
    bgLight: 'bg-amber-50',
    bgLightDark: 'dark:bg-amber-950/50',
    ring: 'focus:ring-amber-500',
    shadow: 'shadow-amber-600/20',
    shadowFab: 'shadow-amber-600/30',
    border: 'border-amber-100',
    borderDark: 'dark:border-amber-900/50',
    textMuted: 'text-amber-400',
  },
  violet: {
    bg: 'bg-violet-600',
    bgHover: 'hover:bg-violet-700',
    text: 'text-violet-600',
    textDark: 'dark:text-violet-400',
    bgLight: 'bg-violet-50',
    bgLightDark: 'dark:bg-violet-950/50',
    ring: 'focus:ring-violet-500',
    shadow: 'shadow-violet-600/20',
    shadowFab: 'shadow-violet-600/30',
    border: 'border-violet-100',
    borderDark: 'dark:border-violet-900/50',
    textMuted: 'text-violet-400',
  },
  sky: {
    bg: 'bg-sky-600',
    bgHover: 'hover:bg-sky-700',
    text: 'text-sky-600',
    textDark: 'dark:text-sky-400',
    bgLight: 'bg-sky-50',
    bgLightDark: 'dark:bg-sky-950/50',
    ring: 'focus:ring-sky-500',
    shadow: 'shadow-sky-600/20',
    shadowFab: 'shadow-sky-600/30',
    border: 'border-sky-100',
    borderDark: 'dark:border-sky-900/50',
    textMuted: 'text-sky-400',
  }
};