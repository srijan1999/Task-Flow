import React, { useState } from 'react';
import { Task, User, Comment, SubTask, Priority, TaskStatus, Tag } from '../types/task';
import { 
  X, 
  Calendar, 
  User as UserIcon, 
  Tag as TagIcon, 
  CheckSquare, 
  MessageSquare, 
  Plus, 
  Trash2,
  Clock,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface TaskDetailModalProps {
  task: Task;
  users: User[];
  tags: Tag[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const tagColorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  users,
  tags,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status === 'review' ? 'in_progress' : task.status);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(task.tagIds || []);
  
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title,
      description,
      priority,
      status,
      assigneeId,
      dueDate,
      tagIds: selectedTagIds,
    });
  };

  const handleToggleTag = (tagId: string) => {
    const updatedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    setSelectedTagIds(updatedTagIds);
    onUpdateTask({
      ...task,
      tagIds: updatedTagIds,
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    const sub: SubTask = {
      id: `sub-${Date.now()}`,
      title: newSubtask,
      completed: false,
    };

    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, sub],
    });
    setNewSubtask('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(s => 
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: newComment,
      createdAt: 'Just now',
    };

    onUpdateTask({
      ...task,
      comments: [comment, ...task.comments],
    });
    setNewComment('');
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Task Details</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
              ID: {task.id}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDeleteTask(task.id);
                }
              }}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full h-9 w-9"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 text-slate-500 dark:text-slate-400">
              <X className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title & Description Inputs */}
          <div className="space-y-3">
            <input 
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onUpdateTask({ ...task, title: e.target.value });
              }}
              onBlur={handleSave}
              className="w-full text-xl font-extrabold text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-indigo-500 focus:outline-none pb-1 transition-colors"
              placeholder="Task Title"
            />
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  onUpdateTask({ ...task, description: e.target.value });
                }}
                onBlur={handleSave}
                placeholder="Add a detailed description..."
                className="min-h-[80px] text-sm resize-none border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-2xl"
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {/* Status */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" /> Status
              </span>
              <select 
                value={status}
                onChange={(e) => {
                  const val = e.target.value as TaskStatus;
                  setStatus(val);
                  onUpdateTask({ ...task, status: val });
                }}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <TagIcon className="h-3 w-3" /> Priority
              </span>
              <select 
                value={priority}
                onChange={(e) => {
                  const val = e.target.value as Priority;
                  setPriority(val);
                  onUpdateTask({ ...task, priority: val });
                }}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <UserIcon className="h-3 w-3" /> Assignee
              </span>
              <select 
                value={assigneeId}
                onChange={(e) => {
                  setAssigneeId(e.target.value);
                  onUpdateTask({ ...task, assigneeId: e.target.value });
                }}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due Date
              </span>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  onUpdateTask({ ...task, dueDate: e.target.value });
                }}
                className="w-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags Selection Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TagIcon className="h-3.5 w-3.5" /> Task Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      isSelected 
                        ? `${tagColorMap[tag.color]} border-indigo-500/40 ring-2 ring-indigo-500/20` 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
              {tags.length === 0 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500">No tags created yet. Create some in the Workspaces tab!</p>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5" /> Subtasks
            </h5>
            
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {task.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950/80 p-2 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input 
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                    />
                    <span className={`text-xs font-semibold ${sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {sub.title}
                    </span>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="h-6 w-6 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-1.5">
              <Input 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-xl text-xs h-9"
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-9 px-3">
                Add
              </Button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 pt-1">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> Discussion
            </h5>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 items-center">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              <div className="flex-1 flex gap-1.5">
                <Input 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border-slate-200 dark:border-slate-800 bg-transparent dark:text-slate-200 focus:ring-indigo-500 rounded-xl text-xs h-9"
                />
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 w-9 p-0 shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {task.comments.map(comment => (
                <div key={comment.id} className="flex gap-2 items-start bg-slate-50/30 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <img src={comment.userAvatar} alt={comment.userName} className="h-6 w-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{comment.userName}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">{comment.text}</p>
                  </div>
                </div>
              ))}
              {task.comments.length === 0 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-2">No comments yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};