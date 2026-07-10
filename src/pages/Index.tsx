import React, { useState, useEffect, useRef } from "react";
import { AppHeader } from "../components/AppHeader";
import { WorkspaceSidebar } from "../components/WorkspaceSidebar";
import { TaskCard } from "../components/TaskCard";
import { TaskDetailModal } from "../components/TaskDetailModal";
import { NewTaskModal } from "../components/NewTaskModal";
import { ActivityFeed } from "../components/ActivityFeed";
import { AuthScreen } from "../components/AuthScreen";
import { FirstWorkspaceScreen } from "../components/FirstWorkspaceScreen";
import { Task, User, Workspace, Activity, TaskStatus, Tag, AccentColor, accentColorMap } from "../types/task";
import { mockUsers, mockWorkspaces, mockTasks, mockActivities, mockTags } from "../utils/mockData";
import { CheckCircle2, Clock, HelpCircle, Radio } from "lucide-react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { showSuccess, showError } from "../utils/toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(() => {
    const saved = localStorage.getItem("cotask_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
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

  // Auth state management
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingAuth(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase
  useEffect(() => {
    if (!session?.user) return;

    const loadWorkspaces = async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", session.user.id);
      
      if (error) {
        console.error("Error loading workspaces:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setWorkspaces(data);
        setActiveWorkspace(data[0]);
      }
    };

    const loadTags = async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("created_by", session.user.id);
      
      if (error) {
        console.error("Error loading tags:", error);
        return;
      }
      
      if (data) {
        setTags(data);
      }
    };

    const loadTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("owner_id", session.user.id);
      
      if (error) {
        console.error("Error loading tasks:", error);
        return;
      }
      
      if (data) {
        setTasks(data);
      }
    };

    const loadActivities = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", session.user.id);
      
      if (error) {
        console.error("Error loading activities:", error);
        return;
      }
      
      if (data) {
        setActivities(data);
      }
    };

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) {
        console.error("Error loading profile:", error);
        return;
      }
      
      if (data) {
        setUsers([{
          id: data.id,
          name: data.first_name || "User",
          avatar: data.avatar_url || `https://api.dicebear.com/7.x/initialism/svg?seed=${data.first_name}`,
          color: "bg-indigo-500",
          role: "Team Member",
        }]);
      }
    };

    loadWorkspaces();
    loadTags();
    loadTasks();
    loadActivities();
    loadProfile();
  }, [session]);

  // Load mock data as fallback
  useEffect(() => {
    if (workspaces.length === 0) {
      setWorkspaces(mockWorkspaces);
      setActiveWorkspace(mockWorkspaces[0]);
    }
    if (users.length === 0) {
      setUsers(mockUsers);
    }
    if (tags.length === 0) {
      setTags(mockTags);
    }
    if (tasks.length === 0) {
      setTasks(mockTasks);
    }
    if (activities.length === 0) {
      setActivities(mockActivities);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setWorkspaces([]);
    setTags([]);
    setTasks([]);
    setActivities([]);
    setActiveWorkspace(null);
  };

  const handleAddWorkspace = async (name: string, description: string) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("workspaces")
      .insert({
        name,
        description,
        owner_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      showError("Failed to create workspace");
      return;
    }

    if (data) {
      setWorkspaces([...workspaces, data]);
      setActiveWorkspace(data);
      showSuccess("Workspace created!");
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId);

    if (error) {
      showError("Failed to delete workspace");
      return;
    }

    setWorkspaces(workspaces.filter((w) => w.id !== workspaceId));
    if (activeWorkspace?.id === workspaceId) {
      setActiveWorkspace(workspaces[0] || null);
    }
    showSuccess("Workspace deleted");
  };

  const handleAddTag = async (name: string, color: string) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("tags")
      .insert({
        name,
        color,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      showError("Failed to create tag");
      return;
    }

    if (data) {
      setTags([...tags, data]);
      showSuccess("Tag created!");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", tagId);

    if (error) {
      showError("Failed to delete tag");
      return;
    }

    setTags(tags.filter((t) => t.id !== tagId));
    showSuccess("Tag deleted");
  };

  const handleAddTask = async (task: Omit<Task, "id" | "comments" | "created_at">) => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...task,
        owner_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      showError("Failed to create task");
      return;
    }

    if (data) {
      setTasks([...tasks, data]);
      showSuccess("Task created!");
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("tasks")
      .update({
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assignee_id: updatedTask.assignee_id,
        due_date: updatedTask.due_date,
        tag_ids: updatedTask.tag_ids,
      })
      .eq("id", updatedTask.id);

    if (error) {
      showError("Failed to update task");
      return;
    }

    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      showError("Failed to delete task");
      return;
    }

    setTasks(tasks.filter((t) => t.id !== taskId));
    setSelectedTask(null);
    showSuccess("Task deleted");
  };

  const handleMoveStatus = (taskId: string, direction: "left" | "right") => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const statusOrder: TaskStatus[] = ["todo", "in_progress", "review", "done"];
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const newStatus = statusOrder[newIndex];
      handleUpdateTask({ ...task, status: newStatus });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (task.workspace_id !== activeWorkspace?.id) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeColumnTasks = filteredTasks.filter((t) => {
    if (activeColumn === "in_progress") {
      return t.status === "in_progress" || t.status === "review";
    }
    return t.status === activeColumn;
  });

  const columns: { id: TaskStatus; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const currentUser = users[0] || {
    id: "user-1",
    name: "User",
    avatar: "https://api.dicebear.com/7.x/initialism/svg?seed=User",
    color: "bg-indigo-500",
    role: "Team Member",
  };

  const sidebarContent = (
    <WorkspaceSidebar
      workspaces={workspaces}
      activeWorkspace={activeWorkspace}
      setActiveWorkspace={setActiveWorkspace}
      onAddWorkspace={handleAddWorkspace}
      onDeleteWorkspace={handleDeleteWorkspace}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      tags={tags}
      onAddTag={handleAddTag}
      onDeleteTag={handleDeleteTag}
      accentColor={accentColor}
      onAccentColorChange={setAccentColor}
      currentUser={currentUser}
    />
  );

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen accentColor={accentColor} />;
  }

  if (workspaces.length === 0) {
    return (
      <FirstWorkspaceScreen
        onCreateWorkspace={handleAddWorkspace}
        accentColor={accentColor}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${isDarkMode ? "dark" : ""} transition-colors duration-200 font-sans flex flex-col`}>
      <div className="flex h-screen overflow-hidden flex-1">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === "board" && (
              <div className="space-y-3">
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
                          <div className={`absolute bottom-0 left-2 right-2 h-0.5 ${accent.bg} rounded-t-full`} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
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
            {activeTab === "activity" && (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <ActivityFeed activities={activities} accentColor={accentColor} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {selectedTask && activeWorkspace && (
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

      {isNewTaskOpen && activeWorkspace && (
        <NewTaskModal
          users={users}
          tags={tags}
          workspaceId={activeWorkspace.id}
          onClose={() => setIsNewTaskOpen(false)}
          onAddTask={handleAddTask}
          accentColor={accentColor}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        Developed with ❤️ by Srijan
      </footer>
    </div>
  );
};

export default Index;