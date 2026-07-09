export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

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