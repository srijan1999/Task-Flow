import React, { useState } from 'react';
import { User, Workspace } from '../types/task';
import { 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  Plus, 
  Users, 
  Radio, 
  Layers,
  CheckSquare,
  LogOut,
  UserCheck
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
    <aside className="w-80 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CoTask Board
          </h1>
          <p className="text-xs text-slate-400 font-medium">Collaborative Workspace</p>
        </div>
      </div>

      {/* Workspaces Section */}
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspaces</span>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 text-white border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Create Workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateWorkspace} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Workspace Name</label>
                    <Input 
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="e.g., Marketing Launch"
                      className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <Input 
                      value={newWorkspaceDesc}
                      onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                      placeholder="Brief description of the workspace goals"
                      className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create Workspace
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const IconComponent = iconMap[ws.icon] || CheckSquare;
              const isActive = ws.id === activeWorkspace.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{ws.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active User Switcher */}
        <div>
          <div className="px-2 mb-3 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Identity</span>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-3 border border-slate-800/60 space-y-2">
            <p className="text-xs text-slate-400 px-1 mb-1">
              Switch users below to simulate collaborative actions from different perspectives:
            </p>
            <div className="space-y-1.5">
              {users.map((u) => {
                const isMe = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setCurrentUser(u)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                      isMe 
                        ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300' 
                        : 'border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="h-6 w-6 rounded-full object-cover border border-slate-700" />
                      <div className="text-left">
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.role}</p>
                      </div>
                    </div>
                    {isMe && (
                      <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        You
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Simulation Toggle */}
        <div>
          <div className="px-2 mb-3 flex items-center gap-2">
            <Radio className={`h-4 w-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Simulation</span>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Simulate Team Activity</span>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  isSimulating ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isSimulating ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When enabled, other team members will periodically perform actions (move tasks, add comments, complete subtasks) in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div>
            <p className="text-sm font-semibold text-white">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};