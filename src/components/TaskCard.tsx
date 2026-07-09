import React from 'react';
import { Task, User } from '../types/task';
import { 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { Badge } from './ui/badge';

interface TaskCardProps {
  task: Task;
  users: User[];
  onClick: () => void;
  onMoveStatus: (taskId: string, direction: 'left' | 'right') => void;
}

const priorityColors = {
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  high: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onClick, onMoveStatus }) => {
  const assignee = users.find(u => u.id === task.assigneeId);
  
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer flex flex-col gap-4 relative overflow-hidden"
    >
      {/* Top Row: Priority & Quick Actions */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`capitalize font-semibold text-xs px-2.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </Badge>
        
        {/* Quick Move Buttons for Mobile/Easy Access */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {task.status !== 'todo' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, 'left');
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              title="Move Left"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
          )}
          {task.status !== 'done' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, 'right');
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              title="Move Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-150 line-clamp-2 leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Subtasks Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
              Subtasks
            </span>
            <span>{completedSubtasks}/{totalSubtasks} ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between mt-auto">
        {/* Due Date & Comments */}
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          {task.dueDate && (
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignee && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">{assignee.name.split(' ')[0]}</span>
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="h-6 w-6 rounded-full object-cover ring-2 ring-white shadow-sm"
              title={assignee.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};