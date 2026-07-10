import React, { useState, useEffect } from "react";
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
  const [loadingAuth, setLoadingAuth] = useState(true);

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

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }
      setSession(session);
      setLoadingAuth(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      const userId = session.user.id;

      // Fetch workspaces
      const { data: workspaceData, error: workspaceError } = await supabase
        .from<Workspace>("workspaces")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (workspaceError) {
        console.error("Error fetching workspaces:", workspaceError);
        showError("Failed to load workspaces");
      } else {
        setWorkspaces(workspaceData || []);
        setActiveWorkspace(workspaceData?.[0] || null);
      }

      // Fetch tags
      const { data: tagData, error: tagError } = await supabase
        .from<Tag>("tags")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (tagError) {
        console.error("Error fetching tags:", tagError);
      } else {
        setTags(tagData || []);
      }

      // Fetch tasks for active workspace
      const { data: taskData, error: taskError } = await supabase
        .from<Task>("tasks")
        .select("*")
        .eq("workspace_id", activeWorkspace?.id)
        .order("created_at", { ascending: false });

      if (taskError) {
        console.error("Error fetching tasks:", taskError);
      } else {
        setTasks(taskData || []);
      }

      // Fetch activities
      const { data: activityData, error: activityError } = await supabase
        .from<Activity>("activities")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (activityError) {
        console.error("Error fetching activities:", activityError);
      } else {
        setActivities(activityData || []);
      }

      // Fetch users (team members)
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId);

      if (userError) {
        console.error("Error fetching user profile:", userError);
      } else if (userData?.[0]) {
        setUsers([{
          id: userId,
          name: userData[0].first_name || session.user?.email?.split("@")[0] || "User",
          avatar: userData[0].avatar_url || `https://api.dicebear.com/7.x/initialism/svg?seed=${session.user?.email}`,
          color: `bg-${accentColor}-500`,
          role: "Team Member",
        }]);
      }
    };

    fetchData();
  }, [session, activeWorkspace?.id]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!session?.user || !activeWorkspace?.id) return;

    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `workspace_id=eq.${activeWorkspace.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) => prev.map((t) => (t.id === (payload.new as Task).id ? (payload.new as Task) : t)));
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, activeWorkspace?.id]);

  // Set up activities subscription
  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel("public:activities")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activities" },
        (payload) => {
          setActivities((prev) => [payload.new as Activity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  // Local storage persistence for settings
  useEffect(() => {
    localStorage.setItem("cotask_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("cotask_accent_color", accentColor);
  }, [accentColor]);

  const currentUser: User = session?.user
    ? {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        avatar: session.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/initialism/svg?seed=${session.user.email}`,
        color: `bg-${accentColor}-500`,
        role: session.user.user_metadata?.role || "Team Member",
      }
    : mockUsers[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showSuccess("Logged out");
  };

  const handleAddWorkspace = async (name: string, description: string) => {
    if (!session?.user) return;
    
    const { data, error } = await supabase
      .from<Workspace>("workspaces")
      .insert({ name, description, owner_id: session.user.id })
      .select()
      .single();

    if (error) {
      showError(error.message);
      return;
    }

    setWorkspaces((prev) => [data, ...prev]);
    setActiveWorkspace(data);
    showSuccess(`Workspace "${name}" created!`);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!session?.user) return;
    
    // Check if this is the last workspace
    if (workspaces.length <= 1) {
      showError("Cannot delete the last workspace");
      return;
    }
    
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this workspace? This will delete all tasks and data in this workspace.")) {
      return;
    }
    
    try {
      // Delete tasks in this workspace first (due to foreign key constraints)
      await supabase.from("tasks").delete().eq("workspace_id", workspaceId);
      
      // Delete the workspace
      const { error } = await supabase.from("workspaces").delete().eq("id", workspaceId);
      
      if (error) {
        throw error;
      }
      
      // Update state
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      
      // Set active workspace to the first remaining workspace
      const newActiveWorkspace = workspaces.find(ws => ws.id !== workspaceId) || null;
      setActiveWorkspace(newActiveWorkspace);
      
      // Reset tasks and activities for the new workspace
      setTasks([]);
      setActivities([]);
      
      // Fetch data for the new workspace
      if (newActiveWorkspace) {
        const { data: taskData } = await supabase
          .from<Task>("tasks")
          .select("*")
          .eq("workspace_id", newActiveWorkspace.id)
          .order("created_at", { ascending: false });
          
        setTasks(taskData || []);
        
        const { data: activityData } = await supabase
          .from<Activity>("activities")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(50);
          
        setActivities(activityData || []);
      }
      
      showSuccess("Workspace deleted successfully");
    } catch (error: any) {
      console.error("Error deleting workspace:", error);
      showError(error.message || "Failed to delete workspace");
    }
  };

  const handleAddTag = async (name: string, color: string) => {
    if (!session?.user) return;
    
    const { data, error } = await supabase
      .from<Tag>("tags")
      .insert({ name, color, created_by: session.user.id })
      .select()
      .single();

    if (error) {
      showError(error.message);
      return;
    }

    setTags((prev) => [...prev, data]);
    showSuccess(`Tag "${name}" created!`);
  };

  const handleDeleteTag = async (tagId: string) => {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) {
      showError(error.message);
      return;
    }
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    setTasks((prev) => prev.map((t) => ({ ...t, tag_ids: t.tag_ids?.filter((id) => id !== tagId) || [] })));
    showSuccess("Tag deleted");
  };

  const handleAddTask = async (taskData: Omit<Task, "id" | "comments" | "created_at">) => {
    if (!session?.user || !activeWorkspace) return;

    const { data, error } = await supabase
      .from<Task>("tasks")
      .insert({
        ...taskData,
        workspace_id: activeWorkspace.id,
        owner_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      showError(error.message);
      return;
    }

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user_id: session.user.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      action: "created task",
      target_name: data.title,
      timestamp: "Just now",
    };
    await supabase.from("activities").insert(newActivity);

    showSuccess(`Task "${data.title}" created!`);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const { error } = await supabase
      .from<Task>("tasks")
      .update(updatedTask)
      .eq("id", updatedTask.id);

    if (error) {
      showError(error.message);
      return;
    }

    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user_id: session?.user?.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      action: "updated details of",
      target_name: updatedTask.title,
      timestamp: "Just now",
    };
    await supabase.from("activities").insert(newActivity);
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      showError(error.message);
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);

    if (taskToDelete) {
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user_id: session?.user?.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar,
        action: "deleted task",
        target_name: taskToDelete.title,
        timestamp: "Just now",
      };
      await supabase.from("activities").insert(newActivity);
      showSuccess("Task deleted");
    }
  };

  const handleMoveStatus = async (taskId: string, direction: "left" | "right") => {
    const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentStatus = task.status === "review" ? "in_progress" : task.status;
    const currentIndex = statuses.indexOf(currentStatus);
    let nextIndex = currentIndex + (direction === "right" ? 1 : -1);

    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      const updatedTask = { ...task, status: nextStatus };

      const { error } = await supabase
        .from<Task>("tasks")
        .update({ status: nextStatus })
        .eq("id", taskId);

      if (error) {
        showError(error.message);
        return;
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

      const statusLabels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user_id: session?.user?.id,
        user_name: currentUser.name,
        user_avatar: currentUser.avatar,
        action: `moved to ${statusLabels[nextStatus]}`,
        target_name: task.title,
        timestamp: "Just now",
      };
      await supabase.from("activities").insert(newActivity);
    }
  };

  const handleAvatarUpdate = (newAvatar: string) => {
    setUsers((prev) => prev.map((u) => ({ ...u, avatar: newAvatar })));
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

  if (!activeWorkspace) {
    return (
      <FirstWorkspaceScreen
        onCreateWorkspace={handleAddWorkspace}
        accentColor={accentColor}
      />
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (t.workspace_id !== activeWorkspace.id) return false;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 ${isDarkMode ? "dark" : ""} transition-colors duration-200 font-sans`}>
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
                          <div className={`absolute bottom-0 left-2 right-2 h-0.5 ${accent.bg} rounded-t-full`} />
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
    </div>
  );
};

export default Index;