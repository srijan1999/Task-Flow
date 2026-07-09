import React, { useState } from 'react';
import { User, AccentColor, accentColorMap } from '../types/task';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { showSuccess, showError } from '../utils/toast';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegisterUser: (newUser: User) => void;
  accentColor: AccentColor;
}

const avatarOptions = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  users,
  onRegisterUser,
  accentColor,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Product Designer');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const accent = accentColorMap[accentColor];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        showError('Please enter your name');
        return;
      }

      // Create a new user
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        avatar: selectedAvatar,
        color: `bg-${accentColor}-500`,
        role: role,
      };

      onRegisterUser(newUser);
      onLogin(newUser);
      showSuccess(`Welcome to CoTask, ${newUser.name}!`);
    } else {
      // Simple login simulation: check if user exists by name/email prefix or just log in
      const existingUser = users.find(
        (u) => u.name.toLowerCase().includes(email.split('@')[0].toLowerCase())
      );

      if (existingUser) {
        onLogin(existingUser);
        showSuccess(`Welcome back, ${existingUser.name}!`);
      } else {
        // If no matching user, create a quick one so they aren't blocked
        const quickUser: User = {
          id: `u-${Date.now()}`,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: selectedAvatar,
          color: `bg-${accentColor}-500`,
          role: 'Team Member',
        };
        onRegisterUser(quickUser);
        onLogin(quickUser);
        showSuccess(`Created new account for ${quickUser.name}!`);
      }
    }
  };

  return (
    <div className="w-full max-w-md h-screen sm:h-[840px] bg-slate-950 sm:rounded-[40px] sm:shadow-2xl border-0 sm:border-[10px] border-slate-900 overflow-hidden flex flex-col justify-between p-6 relative select-none">
      
      {/* Top Decorative Header */}
      <div className="text-center pt-8 space-y-3">
        <div className="inline-flex p-3.5 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 text-indigo-400 animate-bounce">
          <Sparkles className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">CoTask Workspace</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Real-time collaborative task management</p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-[32px] p-6 space-y-5 backdrop-blur-md">
        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/40">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? `${accent.bg} text-white shadow-md` : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? `${accent.bg} text-white shadow-md` : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Product Designer">Product Designer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Lead">Backend Lead</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              {/* Avatar Picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choose Avatar</label>
                <div className="flex gap-2 overflow-x-auto pb-1 justify-between">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative rounded-full shrink-0 transition-all ${
                        selectedAvatar === avatar ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt="Avatar option" className="h-9 w-9 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <Button type="submit" className={`w-full ${accent.bg} ${accent.bgHover} text-white rounded-xl py-2.5 font-bold text-xs mt-2 flex items-center justify-center gap-1.5 shadow-lg ${accent.shadow}`}>
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Quick Demo Login Panel */}
      <div className="space-y-2.5 pb-4">
        <div className="flex items-center gap-1.5 justify-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Quick Demo Login (Click to enter)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {users.slice(0, 4).map((u) => (
            <button
              key={u.id}
              onClick={() => {
                onLogin(u);
                showSuccess(`Logged in as ${u.name} (Demo)`);
              }}
              className="flex items-center gap-2 p-2 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700 rounded-xl text-left transition-all"
            >
              <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover border border-slate-800" />
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-200 truncate leading-tight">{u.name}</p>
                <p className="text-[8px] text-slate-500 truncate font-medium">{u.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Android Home Indicator Bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800/40 rounded-full pointer-events-none hidden sm:block" />
    </div>
  );
};