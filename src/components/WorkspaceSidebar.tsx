import React, { useState } from 'react';
import { User, Workspace, Tag } from '../types/task';
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
  Moon,
  Tag as TagIcon,
  Trash2
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
  tags: Tag[];
  onAddTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Sparkles,
  Smartphone,
  TrendingUp,
};

const tagColors = ['indigo', 'rose', 'emerald', 'amber', 'sky', 'violet', 'fuchsia'];

const tagColorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
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
  tags,
  onAddTag,
  onDeleteTag,
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Tag creation state
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    onAddWorkspace(newWorkspaceName, newWorkspaceDesc);
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
    setIsAddOpen(false);
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    onAddTag(newTagName, selectedColor);
    setNewTagName('');
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

      {/* Custom Task Tags Section */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <TagIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Custom Task Tags</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
          {/* Tag Creation Form */}
          <form onSubmit={handleCreateTag} className="space-y-3">
            <div className="flex gap-1.5">
              <Input 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag name..."
                className="flex-1 border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-xl text-xs h-9"
                required
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-9 px-3">
                Add Tag
              </Button>
            </div>
            {/* Color Picker */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tag Color</span>
              <div className="flex gap-1.5">
                {tagColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-5 w-5 rounded-full border transition-all ${
                      selectedColor === color 
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-110' 
                        : 'opacity-70 hover:opacity-100'
                    } bg-${color}-500`}
                    style={{
                      backgroundColor: color === 'indigo' ? '#6366f1' : 
                                       color === 'rose' ? '#f43f5e' : 
                                       color === 'emerald' ? '#10b981' : 
                                       color === 'amber' ? '#f59e0b' : 
                                       color === 'sky' ? '#0ea5e9' : 
                                       color === 'violet' ? '#8b5cf6' : '#d946ef'
                    }}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Tags List */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Existing Tags</span>
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
              {tags.map(tag => (
                <div 
                  key={tag.id} 
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${tagColorMap[tag.color] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}
                >
                  <span>{tag.name}</span>
                  <button 
                    type="button"
                    onClick={() => onDeleteTag(tag.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500">No tags created yet.</p>
              )}
            </div>
          </div>
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