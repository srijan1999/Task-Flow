import React from 'react';
import { Activity } from '../types/task';
import { Radio, Clock, Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-indigo-600 animate-pulse" />
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Live Activity</h3>
        </div>
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Real-time
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {activities.map((act) => (
          <div 
            key={act.id} 
            className="flex gap-3 items-start p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <img 
              src={act.userAvatar} 
              alt={act.userName} 
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-extrabold text-slate-800">{act.userName}</span>{' '}
                <span className="text-slate-500 font-medium">{act.action}</span>{' '}
                <span className="font-bold text-indigo-600 block truncate mt-0.5">{act.targetName}</span>
              </p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">No activity yet. Try moving a task or adding a comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};