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
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 select-none">
      {/* Workspaces Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspaces</span>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full">
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
                    : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-100 shadow-sm'
                }`}
              >
                <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="text-left min-w-0 flex-1">
                  <p className="truncate leading-none">{ws.name}</p>
                  {!isActive && ws.description && (
                    <p className="text-[10px] text-slate-400 truncate mt-1 font-medium">{ws.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active User Switcher */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <UserCheck className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Identity</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
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
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' 
                      : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover border border-slate-200" />
                    <div className="text-left">
                      <p className="font-extrabold">{u.name}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{u.role}</p>
                    </div>
                  </div>
                  {isMe && (
                    <span className="bg-indigo-100 text-indigo-600 text-[8px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
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
        <div className="mb-3 flex items-center gap-2 px-1">
          <Radio className={`h-4 w-4 ${isSimulating ? 'text-emerald-500 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Simulation</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Simulate Team Activity</span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                isSimulating ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isSimulating ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            When enabled, other team members will periodically perform actions (move tasks, add comments, complete subtasks) in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};