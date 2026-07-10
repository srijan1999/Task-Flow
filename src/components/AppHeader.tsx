import React from "react";
import { Search, Sun, Moon, Plus, Menu, LogOut, Sparkles } from "lucide-react";
import { User, Workspace, AccentColor, accentColorMap } from "../types/task";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AppHeaderProps {
  activeWorkspace: Workspace;
  currentUser: User;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: AccentColor;
  onLogout: () => void;
  onNewTask: () => void;
  onMenuClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeWorkspace,
  currentUser,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  onToggleDarkMode,
  accentColor,
  onLogout,
  onNewTask,
  onMenuClick,
}) => {
  const accent = accentColorMap[accentColor];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shrink-0 transition-colors duration-200">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-slate-600 dark:text-slate-300"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`${accent.bg} p-2 rounded-xl text-white shadow-sm ${accent.shadow} shrink-0`}>
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate leading-tight">
            {activeWorkspace.name}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate hidden sm:block">
            {activeWorkspace.description || "Collaborative Workspace"}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
          className="text-slate-600 dark:text-slate-300"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button
          onClick={onNewTask}
          className={`${accent.bg} ${accent.bgHover} text-white rounded-xl text-sm font-bold shadow-sm ${accent.shadow}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-8 w-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
          title={currentUser.name}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          title="Log Out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};