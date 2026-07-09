import React from 'react';
import { Activity } from '../types/task';
import { Radio, Clock, Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="w-80 bg-white border-l border-slate-100 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-indigo-600 animate-pulse" />
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Live Activity</h3>
        </div>
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Real-time
        </span>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activities.map((act) => (
          <div 
            key={act.id} 
            className="flex gap-3 items-start p-3 rounded-2xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
          >
            <img 
              src={act.userAvatar} 
              alt={act.userName} 
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">{act.userName}</span>{' '}
                <span className="text-slate-500">{act.action}</span>{' '}
                <span className="font-semibold text-indigo-600 block truncate mt-0.5">{act.targetName}</span>
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Sparkles className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400">No activity yet. Try moving a task or adding a comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};