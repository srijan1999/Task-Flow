import { User, Workspace, Task, Activity, Tag } from '../types/task';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    color: 'bg-indigo-500',
    role: 'Product Designer'
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    color: 'bg-emerald-500',
    role: 'Frontend Engineer'
  },
  {
    id: 'u3',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    color: 'bg-amber-500',
    role: 'Backend Lead'
  },
  {
    id: 'u4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    color: 'bg-rose-500',
    role: 'QA Engineer'
  }
];

export const mockWorkspaces: Workspace[] = [
  {
    id: 'w1',
    name: 'Acme Redesign',
    description: 'Overhauling the main marketing website and dashboard.',
    icon: 'Sparkles'
  },
  {
    id: 'w2',
    name: 'Mobile App v2',
    description: 'Developing the next generation iOS & Android applications.',
    icon: 'Smartphone'
  },
  {
    id: 'w3',
    name: 'Growth & Marketing',
    description: 'Campaigns, SEO optimization, and user acquisition strategies.',
    icon: 'TrendingUp'
  }
];

export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Design', color: 'indigo' },
  { id: 'tag-2', name: 'Bug', color: 'rose' },
  { id: 'tag-3', name: 'Feature', color: 'emerald' },
  { id: 'tag-4', name: 'Marketing', color: 'amber' },
  { id: 'tag-5', name: 'Refactor', color: 'sky' }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Design new landing page hero section',
    description: 'Create high-fidelity mockups for the hero section with a focus on the new value proposition and interactive product demo.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'u1',
    workspaceId: 'w1',
    dueDate: '2025-03-15',
    subtasks: [
      { id: 's1', title: 'Wireframe layouts', completed: true },
      { id: 's2', title: 'Select typography & colors', completed: true },
      { id: 's3', title: 'Create 3D illustration asset', completed: false }
    ],
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        text: 'Can we make sure the 3D asset is optimized for fast loading times?',
        createdAt: '2 hours ago'
      }
    ],
    tagIds: ['tag-1', 'tag-3'],
    createdAt: '2025-03-01'
  },
  {
    id: 't2',
    title: 'Implement authentication flow',
    description: 'Set up Supabase Auth with Google and GitHub OAuth providers. Ensure proper redirect routes and session persistence.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'u3',
    workspaceId: 'w1',
    dueDate: '2025-03-18',
    subtasks: [
      { id: 's4', title: 'Configure Supabase dashboard', completed: false },
      { id: 's5', title: 'Build login/signup UI components', completed: false },
      { id: 's6', title: 'Add route guards', completed: false }
    ],
    comments: [],
    tagIds: ['tag-3'],
    createdAt: '2025-03-02'
  },
  {
    id: 't3',
    title: 'Write end-to-end testing suite',
    description: 'Set up Playwright and write basic integration tests for the onboarding and checkout flows.',
    status: 'review',
    priority: 'medium',
    assigneeId: 'u4',
    workspaceId: 'w1',
    dueDate: '2025-03-12',
    subtasks: [
      { id: 's7', title: 'Install Playwright', completed: true },
      { id: 's8', title: 'Write onboarding test', completed: true },
      { id: 's9', title: 'Write checkout test', completed: false }
    ],
    comments: [
      {
        id: 'c2',
        userId: 'u3',
        userName: 'Marcus Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'I noticed some flakiness in the checkout test on slower connections. Might need a longer timeout.',
        createdAt: '1 day ago'
      }
    ],
    tagIds: ['tag-2'],
    createdAt: '2025-03-03'
  },
  {
    id: 't4',
    title: 'Optimize database queries',
    description: 'Analyze slow queries on the dashboard metrics endpoint and add appropriate indexes to speed up load times.',
    status: 'done',
    priority: 'low',
    assigneeId: 'u3',
    workspaceId: 'w1',
    dueDate: '2025-03-08',
    subtasks: [
      { id: 's10', title: 'Identify slow queries', completed: true },
      { id: 's11', title: 'Add indexes to tasks table', completed: true }
    ],
    comments: [],
    tagIds: ['tag-5'],
    createdAt: '2025-03-04'
  },
  {
    id: 't5',
    title: 'Create promotional video storyboard',
    description: 'Draft a 60-second storyboard highlighting the collaborative features of our new platform.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'u1',
    workspaceId: 'w3',
    dueDate: '2025-03-20',
    subtasks: [],
    comments: [],
    tagIds: ['tag-4'],
    createdAt: '2025-03-05'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    userId: 'u1',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    action: 'moved to In Progress',
    targetName: 'Design new landing page hero section',
    timestamp: '10 mins ago'
  },
  {
    id: 'a2',
    userId: 'u3',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    action: 'completed task',
    targetName: 'Optimize database queries',
    timestamp: '1 hour ago'
  },
  {
    id: 'a3',
    userId: 'u2',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    action: 'commented on',
    targetName: 'Design new landing page hero section',
    timestamp: '2 hours ago'
  }
];