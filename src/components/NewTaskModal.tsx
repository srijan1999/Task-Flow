import React, { useState } from 'react';
import { Task, User, Priority, TaskStatus } from '../types/task';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface NewTaskModalProps {
  users: User[];
  workspaceId: string;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'comments' | 'createdAt'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  users,
  workspaceId,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      priority,
      status,
      assigneeId,
      workspaceId,
      dueDate,
      subtasks: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-end justify-center z-50 select-none">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Android Bottom Sheet Container */}
      <div className="bg-white dark:bg-slate-900 rounded-t-[32px] w-full max-w-md shadow-2xl border-t border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300 relative z-10 transition-colors duration-200">
        
        {/* Android Drag Handle */}
        <div className="w-full flex justify-center py-3 shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Create New Task</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 text-slate-500 dark:text-slate-400">
            <X className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Task Title</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-2xl text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="min-h-[80px] resize-none border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-2xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assignee</label>
              <select 
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-3 font-bold mt-4 shadow-lg shadow-indigo-600/20">
            Create Task
          </Button>
        </form>
      </div>
    </div>
  );
};