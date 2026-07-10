import React, { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AccentColor, accentColorMap } from "../types/task";

interface FirstWorkspaceScreenProps {
  onCreateWorkspace: (name: string, description: string) => void;
  accentColor: AccentColor;
}

export const FirstWorkspaceScreen: React.FC<FirstWorkspaceScreenProps> = ({
  onCreateWorkspace,
  accentColor,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const accent = accentColorMap[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateWorkspace(name.trim(), description.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-3">
          <div className={`inline-flex p-3.5 ${accent.bg} rounded-3xl text-white shadow-md ${accent.shadow}`}>
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Create Your First Workspace
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Workspaces help you organize tasks and collaborate with your team.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Workspace Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Design"
              className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm ${accent.ring}`}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Description (Optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm ${accent.ring}`}
            />
          </div>
          <Button
            type="submit"
            className={`w-full ${accent.bg} ${accent.bgHover} text-white rounded-xl py-3 font-bold shadow-lg ${accent.shadowFab}`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Workspace
          </Button>
        </form>
      </div>
    </div>
  );
};