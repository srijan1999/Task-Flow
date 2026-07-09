import { User, Workspace, Task, Activity, Tag } from "../types/task";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    color: "bg-indigo-500",
    role: "Product Designer",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    color: "bg-rose-500",
    role: "Frontend Engineer",
  },
  {
    id: "user-3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    color: "bg-emerald-500",
    role: "Backend Lead",
  },
];

export const mockWorkspaces: Workspace[] = [
  {
    id: "w-1",
    name: "Product Design",
    description: "UI/UX and product development",
    icon: "Sparkles",
    owner_id: "user-1",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "w-2",
    name: "Mobile App",
    description: "iOS and Android development",
    icon: "Smartphone",
    owner_id: "user-1",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "w-3",
    name: "Analytics",
    description: "Data and metrics tracking",
    icon: "TrendingUp",
    owner_id: "user-1",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

export const mockTags: Tag[] = [
  { id: "tag-1", name: "1st Proof", color: "indigo", created_by: "user-1", created_at: "2024-01-01" },
  { id: "tag-2", name: "2nd Proof", color: "rose", created_by: "user-1", created_at: "2024-01-01" },
  { id: "tag-3", name: "3rd Proof", color: "emerald", created_by: "user-1", created_at: "2024-01-01" },
  { id: "tag-4", name: "Final Proof", color: "amber", created_by: "user-1", created_at: "2024-01-01" },
  { id: "tag-5", name: "Content Writing", color: "sky", created_by: "user-1", created_at: "2024-01-01" },
  { id: "tag-6", name: "Editing", color: "violet", created_by: "user-1", created_at: "2024-01-01" },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design new landing page",
    description: "Create wireframes and high-fidelity mockups for the main landing page",
    status: "todo",
    priority: "high",
    assignee_id: "user-1",
    workspace_id: "w-1",
    owner_id: "user-1",
    due_date: "2024-02-15",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    tag_ids: ["tag-1"],
    comments: [],
    subtasks: [],
  },
  {
    id: "task-2",
    title: "Implement authentication flow",
    description: "Set up Supabase auth with email/password and social providers",
    status: "in_progress",
    priority: "high",
    assignee_id: "user-2",
    workspace_id: "w-1",
    owner_id: "user-1",
    due_date: "2024-02-10",
    created_at: "2024-01-10",
    updated_at: "2024-01-10",
    tag_ids: ["tag-2"],
    comments: [],
    subtasks: [],
  },
  {
    id: "task-3",
    title: "Write product documentation",
    description: "Create comprehensive docs for the API and user guides",
    status: "done",
    priority: "medium",
    assignee_id: "user-3",
    workspace_id: "w-1",
    owner_id: "user-1",
    due_date: "2024-01-20",
    created_at: "2024-01-05",
    updated_at: "2024-01-05",
    tag_ids: ["tag-5", "tag-6"],
    comments: [],
    subtasks: [],
  },
];

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    user_id: "user-1",
    user_name: "Alex Rivera",
    user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    action: "created task",
    target_name: "Design new landing page",
    timestamp: "2 hours ago",
  },
  {
    id: "act-2",
    user_id: "user-2",
    user_name: "Sarah Chen",
    user_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    action: "moved to In Progress",
    target_name: "Implement authentication flow",
    timestamp: "1 day ago",
  },
];