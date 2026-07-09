import React, { useState, useEffect } from 'react';
import { AndroidTopBar } from '../components/AndroidTopBar';
import { AndroidBottomNavigation, AndroidTab } from '../components/AndroidBottomNavigation';
import { WorkspaceSidebar } from '../components/WorkspaceSidebar';
import { TaskCard } from '../components/TaskCard';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { NewTaskModal } from '../components/NewTaskModal';
import { ActivityFeed } from '../components/ActivityFeed';
import { Task, User, Workspace, Activity, TaskStatus, Tag, AccentColor, accentColorMap } from '../types/task';
import { 
  mockUsers, 
  mockWorkspaces, 
  mockTasks, 
  mockActivities,
  mockTags
} from '../utils/mockData';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  X
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
  
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem('cotask_tags');
    return saved ? JSON.parse(saved) : mockTags;
  });

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cotask_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Accent Color State
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('cotask_accent_color');
    return saved ? (saved as AccentColor) : 'indigo';
  });
  
  // Android Navigation State
  const [activeTab, setActiveTab] = useState<AndroidTab>('board');
  const [activeColumn, setActiveColumn] = useState<TaskStatus>('todo');
  
  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const accent = accentColorMap[accentColor];

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

  useEffect(() => {
    localStorage.setItem('cotask_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('cotask_tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('cotask_accent_color', accentColor);
  }, [accentColor]);

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
        const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
        const currentStatusIndex = statuses.indexOf(randomTask.status === 'review' ? 'in_progress' : randomTask.status);
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
          review: 'In Progress',
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

  const handleAddTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color
    };
    setTags(prev => [...prev, newTag]);
    showSuccess(`Tag "${name}" created!`);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
    // Also remove this tag from any tasks that have it
    setTasks(prev => prev.map(t => ({
      ...t,
      tagIds: t.tagIds?.filter(id => id !== tagId) || []
    })));
    showSuccess(`Tag deleted`);
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
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Map review status to in_progress if any legacy tasks exist
    const currentStatus = task.status === 'review' ? 'in_progress' : task.status;
    const currentIndex = statuses.indexOf(currentStatus);
    let nextIndex = currentIndex + (direction === 'right' ? 1 : -1);
    
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      const updatedTask = { ...task, status: nextStatus };
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

      const statusLabels = {
        todo: 'To Do',
        in_progress: 'In Progress',
        review: 'In Progress',
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

    return matchesSearch;
  });

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode }[] = [
    { 
      id: 'todo', 
      title: 'To Do', 
      icon: <HelpCircle className="h-4 w-4" />
    },
    { 
      id: 'in_progress', 
      title: 'In Progress', 
      icon: <Clock className="h-4 w-4" />
    },
    { 
      id: 'done', 
      title: 'Done', 
      icon: <CheckCircle2 className="h-4 w-4" />
    },
  ];

  // Map legacy 'review' tasks to 'in_progress' for display
  const activeColumnTasks = filteredTasks.filter(t => {
    const currentStatus = t.status === 'review' ? 'in_progress' : t.status;
    return currentStatus === activeColumn;
  });

  return (
    <div className={`min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-4 font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Simulated Android Device Frame */}
      <div className="w-full max-w-md h-screen sm:h-[840px] bg-slate-50 dark:bg-slate-950 sm:rounded-[40px] sm:shadow-2xl border-0 sm:border-[10px] border-slate-900 overflow-hidden flex flex-col relative transition-colors duration-200">
        
        {/* Android Top App Bar */}
        <AndroidTopBar 
          activeWorkspace={activeWorkspace}
          currentUser={currentUser}
          onSearchClick={() => setIsSearchOpen(!isSearchOpen)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          accentColor={accentColor}
        />

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="bg-slate-900 px-4 pb-3 pt-1 flex items-center gap-2 animate-in slide-in-from-top duration-200 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className={`pl-9 bg-slate-800 border-slate-700 text-white ${accent.ring} rounded-xl text-xs h-9`}
                autoFocus
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="text-slate-400 hover:text-white h-9 w-9 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area based on Active Tab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {activeTab === 'board' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Android Column Tabs */}
              <div className="bg-slate-900 text-white flex border-b border-slate-800/60 shrink-0 select-none">
                {columns.map((col) => {
                  const isSelected = activeColumn === col.id;
                  const count = filteredTasks.filter(t => {
                    const currentStatus = t.status === 'review' ? 'in_progress' : t.status;
                    return currentStatus === col.id;
                  }).length;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setActiveColumn(col.id)}
                      className="flex-1 py-3 flex flex-col items-center gap-1 relative focus:outline-none"
                    >
                      <div className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                        isSelected ? accent.textMuted : 'text-slate-400'
                      }`}>
                        <span>{col.title}</span>
                        <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-300">
                          {count}
                        </span>
                      </div>
                      {/* Active Indicator Line */}
                      {isSelected && (
                        <div className={`absolute bottom-0 left-4 right-4 h-0.5 ${accent.bg} rounded-t-full`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Task List Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {activeColumnTasks.map((task) => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    users={users}
                    tags={tags}
                    onClick={() => setSelectedTask(task)}
                    onMoveStatus={handleMoveStatus}
                    accentColor={accentColor}
                  />
                ))}
                {activeColumnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6 space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full text-slate-400 dark:text-slate-600 transition-colors">
                      <HelpCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No tasks in this stage</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tap the FAB button below to create a new task.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'workspaces' && (
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
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              tags={tags}
              onAddTag={handleAddTag}
              onDeleteTag={handleDeleteTag}
              accentColor={accentColor}
              onAccentColorChange={setAccentColor}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityFeed activities={activities} accentColor={accentColor} />
          )}

          {/* Android Floating Action Button (FAB) */}
          {activeTab === 'board' && (
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className={`absolute bottom-6 right-6 ${accent.bg} ${accent.bgHover} text-white p-4 rounded-[20px] shadow-xl ${accent.shadowFab} active:scale-95 transition-all z-20 flex items-center justify-center`}
              title="Create New Task"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Android Bottom Navigation Bar */}
        <AndroidBottomNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activityCount={activities.length}
          accentColor={accentColor}
        />

        {/* Simulated Android Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800/40 rounded-full pointer-events-none hidden sm:block" />
      </div>

      {/* Modals / Bottom Sheets */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          users={users}
          tags={tags}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          accentColor={accentColor}
        />
      )}

      {isNewTaskOpen && (
        <NewTaskModal 
          users={users}
          tags={tags}
          workspaceId={activeWorkspace.id}
          onClose={() => setIsNewTaskOpen(false)}
          onAddTask={handleAddTask}
          accentColor={accentColor}
        />
      )}
    </div>
  );
};

export default Index;