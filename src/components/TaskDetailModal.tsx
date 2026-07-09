import React, { useState } from 'react';
import { Task, User, Comment, SubTask, Priority, TaskStatus } from '../types/task';
import { 
  X, 
  Calendar, 
  User as UserIcon, 
  Tag, 
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
import { Badge } from './ui/badge';

interface TaskDetailModalProps {
  task: Task;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  users,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate);
  
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Details</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              ID: {task.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDeleteTask(task.id);
                }
              }}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title & Description Inputs */}
          <div className="space-y-4">
            <input 
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onUpdateTask({ ...task, title: e.target.value });
              }}
              onBlur={handleSave}
              className="w-full text-2xl font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none pb-1 transition-colors"
              placeholder="Task Title"
            />
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  onUpdateTask({ ...task, description: e.target.value });
                }}
                onBlur={handleSave}
                placeholder="Add a detailed description for this task..."
                className="min-h-[100px] resize-none border-slate-200 focus:ring-indigo-500 rounded-xl"
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* Status & Priority */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" /> Status
                </span>
                <select 
                  value={status}
                  onChange={(e) => {
                    const val = e.target.value as TaskStatus;
                    setStatus(val);
                    onUpdateTask({ ...task, status: val });
                  }}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-slate-400" /> Priority
                </span>
                <select 
                  value={priority}
                  onChange={(e) => {
                    const val = e.target.value as Priority;
                    setPriority(val);
                    onUpdateTask({ ...task, priority: val });
                  }}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Assignee & Due Date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-slate-400" /> Assignee
                </span>
                <select 
                  value={assigneeId}
                  onChange={(e) => {
                    setAssigneeId(e.target.value);
                    onUpdateTask({ ...task, assigneeId: e.target.value });
                  }}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" /> Due Date
                </span>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    onUpdateTask({ ...task, dueDate: e.target.value });
                  }}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4" /> Subtasks
            </h5>
            
            <div className="space-y-2">
              {task.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input 
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={`text-sm font-medium ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {sub.title}
                    </span>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="h-7 w-7 text-slate-400 hover:text-rose-500 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <Input 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a new subtask..."
                className="flex-1 border-slate-200 focus:ring-indigo-500 rounded-xl"
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" /> Discussion
            </h5>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-3 items-start">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover border border-slate-200" />
              <div className="flex-1 flex gap-2">
                <Input 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border-slate-200 focus:ring-indigo-500 rounded-xl"
                />
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {task.comments.map(comment => (
                <div key={comment.id} className="flex gap-3 items-start bg-slate-50/30 p-3 rounded-2xl border border-slate-100">
                  <img src={comment.userAvatar} alt={comment.userName} className="h-8 w-8 rounded-full object-cover border border-slate-200" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{comment.userName}</span>
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
              {task.comments.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No comments yet. Start the conversation!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};