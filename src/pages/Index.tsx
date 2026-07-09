import React, { useState, useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { WorkspaceSidebar } from "../components/WorkspaceSidebar";
import { TaskCard } from "../components/TaskCard";
import { TaskDetailModal } from "../components/TaskDetailModal";
import { NewTaskModal } from "../components/NewTaskModal";
import { ActivityFeed } from "../components/ActivityFeed";
import { AuthScreen } from "../components/AuthScreen";
import { Task, User, Workspace, Activity, TaskStatus, Tag, AccentColor, accentColorMap } from "../types/task";
import { mockUsers, mockWorkspaces, mockTasks, mockActivities, mockTags } from "../utils/mockData";
import { CheckCircle2, Clock, HelpCircle, Radio } from "lucide-react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { showSuccess } from "../utils/toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem("cotask_workspaces");
    return saved ? JSON.parse(saved) : mockWorkspaces;
  });
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0]);
  const [users] = useState<User[]>(mockUsers);
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem("cotask_tags");
    return saved ? JSON.parse(saved) : mockTags;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("cotask_tasks");
    return saved ? JSON.parse(saved) : mockTasks;
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("cotask_activities");
    return saved ? JSON.parse(saved) : mockActivities;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("cotask_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("cotask_accent_color");
    return saved ? (saved as AccentColor) : "indigo";
  });
  const [activeTab, setActiveTab] = useState<"board" | "activity">("board");
  const [activeColumn, setActiveColumn] = useState<TaskStatus>("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const accent = accentColorMap[accentColor];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingAuth(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("cotask_workspaces", JSON.stringify(workspaces));
  }, [workspaces]);
  useEffect(() => {
    localStorage.setItem("cotask_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("cotask_activities", JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem("cotask_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  useEffect(() => {
    localStorage.setItem("cotask_tags", JSON.stringify(tags));
  }, [tags]);
  useEffect(() => {
    localStorage.setItem("cotask_accent_color", accentColor);
  }, [accentColor]);

  const currentUser: User = session
    ? {
        id: session.user.id,
        name:
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "User",
        avatar: session.user.user_metadata?.avatar || mockUsers[0].avatar,
        color: `bg-${accentColor}-500`,
        role: session.user.user_metadata?.role || "Team Member",
      }
    : mockUsers[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showSuccess("Logged out");
  };

  const handleAddWorkspace = (name: string, description: string) => {
    const newWs: Workspace = { id: `w-${Date.now()}`, name, description, icon: "Sparkles" };
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspace(newWs);
    showSuccess(`Workspace "${name}" created!`);
  };

  const handleAddTag = (name: string, color: string) => {
    const newTag: Tag = { id: `tag-${Date.now()}`, name, color };
    setTags((prev) => [...prev, newTag]);
    showSuccess(`Tag "${name}" created!`);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    setTasks((prev) =>
      prev.map((t) => ({ ...t, tagIds: t.tagIds?.filter((id) => id !== tagId) || [] })),
    );
    showSuccess(`Tag deleted`);
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "comments" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      comments: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: "created task",
      targetName: newTask.title,
      timestamp: "Just now",
    };
    setActivities((prev) => [newActivity, ...prev]);
    showSuccess(`Task "${newTask.title}" created!`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: "updated details of",
      targetName: updatedTask.title,
      timestamp: "Just now",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
    if (taskToDelete) {
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: "deleted task",
        targetName: taskToDelete.title,
        timestamp: "Just now",
      };
      setActivities((prev) => [newActivity, ...prev]);
      showSuccess(`Task deleted`);
    }
  };

  const handleMoveStatus = (taskId: string, direction: "left" | "right") => {
    const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const currentStatus = task.status === "review" ? "in_progress" : task.status;
    const currentIndex = statuses.indexOf(currentStatus);
    let nextIndex = currentIndex + (direction === "right" ? 1 : -1);
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      const updatedTask = { ...task, status: nextStatus };
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      const statusLabels = {
        todo: "To Do",
        in_progress: "In Progress",
        review: "In Progress",
        done: "Done",
      };
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `moved to ${statusLabels[nextStatus]}`,
        targetName: task.title,
        timestamp: "Just now",
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AuthScreen accentColor={accentColor} />;
  }

  const filteredTasks = tasks.filter((t) => {
    if (t.workspaceId !== activeWorkspace.id) return false;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode }[] = [
    { id: "todo", title: "To Do", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "in_progress", title: "In Progress", icon: <Clock className="h-4 w-4" /> },
    { id: "done", title: "Done", icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const activeColumnTasks = filteredTasks.filter((t) => {
    const currentStatus = t.status === "review" ? "in_progress" : t.status;
    return currentStatus === activeColumn;
  });

  const sidebarContent = (
    <WorkspaceSidebar
      workspaces={workspaces}
      activeWorkspace={activeWorkspace}
      setActiveWorkspace={(ws) => {
        setActiveWorkspace(ws);
        setIsSidebarOpen(false);
      }}
      onAddWorkspace={handleAddWorkspace}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      tags={tags}
      onAddTag={handleAddTag}
      onDeleteTag={handleDeleteTag}
      accentColor={accentColor}
      onAccentColorChange={setAccentColor}
    />
  );

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${isDarkMode ? "dark" : ""} transition-colors duration-200 font-sans`}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          {sidebarContent}
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader
            activeWorkspace={activeWorkspace}
            currentUser={currentUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            accentColor={accentColor}
            onLogout={handleLogout}
            onNewTask={() => setIsNewTaskOpen(true)}
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shrink-0">
            <button
              onClick={() => setActiveTab("board")}
              className={`py-3 px-4 text-sm font-bold transition-colors ${
                activeTab === "board" ? accent.text : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-3 px-4 text-sm font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === "activity" ? accent.text : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Radio className="h-4 w-4" /> Activity
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "board" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 shrink-0">
                  {columns.map((col) => {
                    const isSelected = activeColumn === col.id;
                    const count = filteredTasks.filter((t) => {
                      const s = t.status === "review" ? "in_progress" : t.status;
                      return s === col.id;
                    }).length;
                    return (
                      <button
                        key={col.id}
                        onClick={() => setActiveColumn(col.id)}
                        className="py-3 px-4 text-sm font-bold relative"
                      >
                        <span className={isSelected ? accent.text : "text-slate-500 dark:text-slate-400"}>
                          {col.title}{" "}
                          <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-xs">
                            {count}
                          </span>
                        </span>
                        {isSelected && (
                          <div
                            className={`absolute bottom-0 left-2 right-2 h-0.5 ${accent.bg} rounded-t-full`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full text-slate-400 dark:text-slate-600">
                        <HelpCircle className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          No tasks in this stage
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Click "New Task" to create one.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "activity" && <ActivityFeed activities={activities} accentColor={accentColor} />}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          {sidebarContent}
        </SheetContent>
      </Sheet>

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