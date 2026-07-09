import React, { useState } from 'react';
import { User, Workspace } from '../types/task';
import { 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  Plus, 
  Radio, 
  Layers,
  CheckSquare,
  UserCheck,
  Settings,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface WorkspaceSidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
  onAddWorkspace: (name: string, description: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Sparkles,
  Smartphone,
  TrendingUp,
};

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  users,
  currentUser,
  setCurrentUser,
  isSimulating,
  setIsSimulating,
  onAddWorkspace,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    onAddWorkspace(newWorkspaceName, newWorkspaceDesc);
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
    setIsAddOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950 select-none transition-colors duration-200">
      {/* Workspaces Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Workspaces</span>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                <Plus className="h-4.5 w-4.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 text-white border-slate-800 max-w-xs rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-extrabold">Create Workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateWorkspace} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Workspace Name</label>
                  <Input 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g., Marketing Launch"
                    className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Description</label>
                  <Input 
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    placeholder="Brief description"
                    className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500 rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold">
                  Create Workspace
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {workspaces.map((ws) => {
            const IconComponent = iconMap[ws.icon] || CheckSquare;
            const isActive = ws.id === activeWorkspace.id;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-100 dark:border-slate-800 shadow-sm'
                }`}
              >
                <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <div className="text-left min-w-0 flex-1">
                  <p className="truncate leading-none">{ws.name}</p>
                  {!isActive && ws.description && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1 font-medium">{ws.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Identity Switcher */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <UserCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Identity</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 transition-colors duration-200">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
            Switch users below to simulate collaborative actions from different perspectives:
          </p>
          <div className="space-y-2">
            {users.map((u) => {
              const isMe = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                    isMe 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                      : 'border border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <div className="text-left">
                      <p className="font-extrabold">{u.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{u.role}</p>
                    </div>
                  </div>
                  {isMe && (
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[8px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                      You
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Settings Section */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">App Settings</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
          {/* Dark Mode Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Dark Theme</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Live Simulation Toggle */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2">
              <Radio className={`h-4 w-4 ${isSimulating ? 'text-emerald-500 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Simulate Activity</span>
            </div>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isSimulating ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isSimulating ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
            When enabled, other team members will periodically perform actions (move tasks, add comments, complete subtasks) in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};