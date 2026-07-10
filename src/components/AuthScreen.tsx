import React, { useState } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { showSuccess, showError } from "../utils/toast";
import { AccentColor, accentColorMap } from "../types/task";
import { supabase } from "@/integrations/supabase/client";

const avatarOptions = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
];

interface AuthScreenProps {
  accentColor: AccentColor;
  onAuthSuccess?: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ accentColor, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [loading, setLoading] = useState(false);

  const accent = accentColorMap[accentColor];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showError("Please fill in all required fields");
      return;
    }
    if (isSignUp && !name.trim()) {
      showError("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim(), avatar: selectedAvatar },
          },
        });

        if (error) {
          showError(error.message);
        } else {
          // Create profile in the profiles table
          if (data.user) {
            const { error: profileError } = await supabase.from("profiles").insert({
              id: data.user.id,
              first_name: name.trim(),
              last_name: "",
              avatar_url: selectedAvatar,
            });

            if (profileError) {
              console.error("Error creating profile:", profileError);
            }
          }

          if (data.session) {
            showSuccess(`Welcome to CoTask, ${name.trim()}!`);
            if (onAuthSuccess) onAuthSuccess(data.user);
          } else {
            showSuccess("Account created! Please check your email to confirm.");
          }
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          showError(error.message);
        } else {
          showSuccess("Welcome back!");
          if (onAuthSuccess) onAuthSuccess(data.user);
        }
      }
    } catch (err) {
      showError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 text-indigo-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">CoTask Workspace</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Real-time collaborative task management
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              !isSignUp ? `${accent.bg} text-white shadow-md` : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              isSignUp ? `${accent.bg} text-white shadow-md` : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className={`pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-sm h-11 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Choose Avatar
                </label>
                <div className="flex gap-2 justify-between">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative rounded-full shrink-0 transition-all ${
                        selectedAvatar === avatar
                          ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={avatar} alt="Avatar option" className="h-9 w-9 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className={`pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-sm h-11 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`pl-9 bg-slate-950 border-slate-800 text-white rounded-xl text-sm h-11 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full ${accent.bg} ${accent.bgHover} text-white rounded-xl py-3 font-bold text-sm mt-2 flex items-center justify-center gap-1.5 shadow-lg ${accent.shadow} disabled:opacity-60`}
          >
            <span>{loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};