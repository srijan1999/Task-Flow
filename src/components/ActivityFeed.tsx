import React from "react";
import { Activity } from "../types/task";
import { Clock, User } from "lucide-react";
import { AccentColor, accentColorMap } from "../types/task";

interface ActivityFeedProps {
  activities: Activity[];
  accentColor: AccentColor;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, accentColor }) => {
  const accent = accentColorMap[accentColor];

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6 space-y-3">
        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full text-slate-400 dark:text-slate-600">
          <Clock className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No recent activity
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-10 mt-1">
            Activity will appear here as you and your team work on tasks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full ${accent.bg} ${accent.bgLight} flex items-center justify-center text-white text-sm font-medium`}>
              {activity.user_name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {activity.user_name}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {activity.timestamp}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {activity.action} <span className="font-medium">{activity.target_name}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};