import React, { useState, useEffect } from 'react';
import { WorkspaceSidebar } from '../components/WorkspaceSidebar';
import { TaskCard } from '../components/TaskCard';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { NewTaskModal } from '../components/NewTaskModal';
import { ActivityFeed } from '../components/ActivityFeed';
import { Task, User, Workspace, Activity, TaskStatus } from '../types/task';
import { 
  mockUsers, 
  mockWorkspaces, 
  mockTasks, 
  mockActivities 
} from '../utils/mockData';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { showSuccess } from '../utils/toast';

const Index = () => {
  // State
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('cotask_workspaces');
    return saved ? JSON.parse(saved) : mockWorkspaces;
  });
  
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0]);
  
  const [users] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cotask_tasks');
    return saved ? JSON.parse(saved) : mockTasks;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('cotask_activities');
    return saved ? JSON.parse(saved) : mockActivities;
  });

  const [isSimulating, setIsSimulating] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  
  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cotask_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('cotask_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('cotask_activities', JSON.stringify(activities));
  }, [activities]);

  // Live Simulation Effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random user other than current user
      const otherUsers = users.filter(u => u.id !== currentUser.id);
      if (otherUsers.length === 0) return;
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];

      // Pick a random task in the active workspace
      const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspace.id);
      if (workspaceTasks.length === 0) return;
      const randomTask = workspaceTasks[Math.floor(Math.random() * workspaceTasks.length)];

      // Decide on a random action
      const actions = ['move', 'comment', 'subtask'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      if (randomAction === 'move') {
        const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
        const currentStatusIndex = statuses.indexOf(randomTask.status);
        let nextStatusIndex = currentStatusIndex + (Math.random() > 0.5 ? 1 : -1);
        if (nextStatusIndex < 0) nextStatusIndex = 1;
        if (nextStatusIndex >= statuses.length) nextStatusIndex = statuses.length - 2;
        
        const nextStatus = statuses[nextStatusIndex];
        
        setTasks(prev => prev.map(t => 
          t.id === randomTask.id ? { ...t, status: nextStatus } : t
        ));

        const statusLabels = {
          todo: 'To Do',
          in_progress: 'In Progress',
          review: 'In Review',
          done: 'Done'
        };

        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          userId: randomUser.id,
          userName: randomUser.name,
          userAvatar: randomUser.avatar,
          action: `moved to ${statusLabels[nextStatus]}`,
          targetName: randomTask.title,
          timestamp: 'Just now'
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 20));
        showSuccess(`${randomUser.name} moved "${randomTask.title}" to ${statusLabels[nextStatus]}`);
      } else if (randomAction === 'comment') {
        const commentsList = [
          "I'm on it! Let me know if you need help.",
          "Looks great, ready for review.",
          "Can we double check the requirements on this?",
          "Just finished my part of the work.",
          "Let's discuss this in the next sync."
        ];
        const randomCommentText = commentsList[Math.floor(Math.random() * commentsList.length)];

        const newComment = {
          id: `comment-${Date.now()}`,
          userId: randomUser.id,
          userName: randomUser.name,
          userAvatar: randomUser.avatar,
          text: randomCommentText,
          createdAt: 'Just now'
        };

        setTasks(prev => prev.map(t => 
          t.id === randomTask.id ? { ...t, comments: [newComment, ...t.comments] } : t
        ));

        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          userId: randomUser.id,
          userName: randomUser.name,
          userAvatar: randomUser.avatar,
          action: 'commented on',
          targetName: randomTask.title,
          timestamp: 'Just now'
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 20));
        showSuccess(`${randomUser.name} commented on "${randomTask.title}"`);
      } else if (randomAction === 'subtask' && randomTask.subtasks.length > 0) {
        const randomSubtaskIndex = Math.floor(Math.random() * randomTask.subtasks.length);
        const updatedSubtasks = [...randomTask.subtasks];
        const targetSubtask = updatedSubtasks[randomSubtaskIndex];
        targetSubtask.completed = !targetSubtask.completed;

        setTasks(prev => prev.map(t => 
          t.id === randomTask.id ? { ...t, subtasks: updatedSubtasks } : t
        ));

        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          userId: randomUser.id,
          userName: randomUser.name,
          userAvatar: randomUser.avatar,
          action: targetSubtask.completed ? 'completed subtask in' : 'reopened subtask in',
          targetName: randomTask.title,
          timestamp: 'Just now'
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 20));
      }

    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, [isSimulating, tasks, activeWorkspace, users, currentUser]);

  // Handlers
  const handleAddWorkspace = (name: string, description: string) => {
    const newWs: Workspace = {
      id: `w-${Date.now()}`,
      name,
      description,
      icon: 'Sparkles'
    };
    setWorkspaces(prev => [...prev, newWs]);
    setActiveWorkspace(newWs);
    showSuccess(`Workspace "${name}" created!`);
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'comments' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [newTask, ...prev]);

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'created task',
      targetName: newTask.title,
      timestamp: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev]);
    showSuccess(`Task "${newTask.title}" created!`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }

    // Log activity for updates
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'updated details of',
      targetName: updatedTask.title,
      timestamp: 'Just now'
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);

    if (taskToDelete) {
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: 'deleted task',
        targetName: taskToDelete.title,
        timestamp: 'Just now'
      };
      setActivities(prev => [newActivity, ...prev]);
      showSuccess(`Task deleted`);
    }
  };

  const handleMoveStatus = (taskId: string, direction: 'left' | 'right') => {
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex + (direction === 'right' ? 1 : -1);
    
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      const updatedTask = { ...task, status: nextStatus };
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

      const statusLabels = {
        todo: 'To Do',
        in_progress: 'In Progress',
        review: 'In Review',
        done: 'Done'
      };

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `moved to ${statusLabels[nextStatus]}`,
        targetName: task.title,
        timestamp: 'Just now'
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (t.workspaceId !== activeWorkspace.id) return false;
    
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const columns: { id: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
    { 
      id: 'todo', 
      title: 'To Do', 
      color: 'border-t-slate-400 bg-slate-50/50',
      icon: <HelpCircle className="h-4 w-4 text-slate-500" />
    },
    { 
      id: 'in_progress', 
      title: 'In Progress', 
      color: 'border-t-indigo-500 bg-indigo-50/10',
      icon: <Clock className="h-4 w-4 text-indigo-500" />
    },
    { 
      id: 'review', 
      title: 'In Review', 
      color: 'border-t-amber-500 bg-amber-50/10',
      icon: <AlertCircle className="h-4 w-4 text-amber-500" />
    },
    { 
      id: 'done', 
      title: 'Done', 
      color: 'border-t-emerald-500 bg-emerald-50/10',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <WorkspaceSidebar 
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        onAddWorkspace={handleAddWorkspace}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{activeWorkspace.name}</h2>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {filteredTasks.length} Tasks
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">{activeWorkspace.description}</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl text-sm"
              />
            </div>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-600"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Button 
              onClick={() => setIsNewTaskOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/10"
            >
              <Plus className="h-4 w-4 mr-1.5" /> New Task
            </Button>
          </div>
        </header>

        {/* Kanban Board Grid */}
        <main className="flex-1 overflow-x-auto p-8">
          <div className="flex gap-6 h-full min-w-[1000px]">
            {columns.map((col) => {
              const columnTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div 
                  key={col.id} 
                  className={`flex-1 flex flex-col rounded-2xl border-t-4 ${col.color} p-4 max-h-full overflow-hidden`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      {col.icon}
                      <h3 className="font-bold text-slate-700 text-sm">{col.title}</h3>
                    </div>
                    <span className="bg-slate-200/60 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Column Tasks List */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                    {columnTasks.map((task) => (
                      <TaskCard 
                        key={task.id}
                        task={task}
                        users={users}
                        onClick={() => setSelectedTask(task)}
                        onMoveStatus={handleMoveStatus}
                      />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
                        <p className="text-xs font-medium text-slate-400">No tasks here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Activity Feed Panel */}
      <ActivityFeed activities={activities} />

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {isNewTaskOpen && (
        <NewTaskModal 
          users={users}
          workspaceId={activeWorkspace.id}
          onClose={() => setIsNewTaskOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
};

export default Index;