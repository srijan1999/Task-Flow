import React from 'react';
import { Task, User } from '../types/task';
import { 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
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
      className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer flex flex-col gap-3 relative overflow-hidden"
    >
      {/* Top Row: Priority & Quick Actions */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`capitalize font-bold text-[10px] px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </Badge>
        
        {/* Quick Move Buttons */}
        <div className="flex items-center gap-1">
          {task.status !== 'todo' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, 'left');
              }}
              className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
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
              className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              title="Move Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1">
        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-150 text-sm line-clamp-2 leading-snug">
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
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3 text-slate-400" />
              Subtasks
            </span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between mt-1">
        {/* Due Date & Comments */}
        <div className="flex items-center gap-2.5 text-slate-400 text-[11px]">
          {task.dueDate && (
            <div className="flex items-center gap-1 font-semibold">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 font-semibold">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignee && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400">{assignee.name.split(' ')[0]}</span>
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-100 shadow-sm"
              title={assignee.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};