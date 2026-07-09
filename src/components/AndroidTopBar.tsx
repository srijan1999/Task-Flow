import React from 'react';
import { Search, Wifi, Battery, Signal, Sparkles, Sun, Moon } from 'lucide-react';
import { User, Workspace, AccentColor, accentColorMap } from '../types/task';

interface AndroidTopBarProps {
  activeWorkspace: Workspace;
  currentUser: User;
  onSearchClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: AccentColor;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  activeWorkspace,
  currentUser,
  onSearchClick,
  isDarkMode,
  onToggleDarkMode,
  accentColor,
}) => {
  const [time, setTime] = React.useState('');
  const accent = accentColorMap[accentColor];

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-white shrink-0 select-none">
      {/* Simulated Android Status Bar */}
      <div className="flex items-center justify-between px-6 py-1.5 text-[11px] font-medium text-slate-400 bg-slate-950/40">
        <span>{time || '12:30'}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-3.5 w-3.5 rotate-90" />
        </div>
      </div>

      {/* Material Top App Bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className={`${accent.bg} p-2 rounded-xl text-white shadow-md ${accent.shadow}`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-100">
              {activeWorkspace.name}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
              {activeWorkspace.description || 'Collaborative Workspace'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-300" />}
          </button>
          <button 
            onClick={onSearchClick}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className={`h-8 w-8 rounded-full object-cover ring-2 ring-offset-1 ring-offset-slate-900 ml-1`}
            style={{ borderColor: accentColor }}
            title={`Logged in as ${currentUser.name}`}
          />
        </div>
      </div>
    </div>
  );
};