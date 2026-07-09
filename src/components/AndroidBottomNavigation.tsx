import React from 'react';
import { CheckSquare, Layers, Radio } from 'lucide-react';

export type AndroidTab = 'board' | 'workspaces' | 'activity';

interface AndroidBottomNavigationProps {
  activeTab: AndroidTab;
  setActiveTab: (tab: AndroidTab) => void;
  activityCount?: number;
}

export const AndroidBottomNavigation: React.FC<AndroidBottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  activityCount = 0,
}) => {
  const navItems = [
    { id: 'board' as AndroidTab, label: 'Tasks', icon: CheckSquare },
    { id: 'workspaces' as AndroidTab, label: 'Workspaces', icon: Layers },
    { id: 'activity' as AndroidTab, label: 'Activity', icon: Radio, badge: activityCount > 0 },
  ];

  return (
    <nav className="bg-slate-900 border-t border-slate-800/80 px-4 py-2 pb-5 flex justify-around items-center shrink-0 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center gap-1 py-1 px-3 relative group focus:outline-none"
          >
            {/* Active Indicator Pill (Material Design 3 style) */}
            <div 
              className={`px-6 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute top-1 right-4 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>
            <span 
              className={`text-[10px] font-bold tracking-wide transition-colors duration-200 ${
                isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};