import React from 'react';
import { UserStats } from '../types';
import { Brain, Flame, Trophy, LogOut, LogIn, UserPlus, Globe, Sparkles, Lock } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  stats: UserStats;
  onHomeClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLanguageToggle: (lang: 'en' | 'si') => void;
  onProClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  stats, 
  onHomeClick, 
  isLoggedIn, 
  onLogout,
  onLoginClick,
  onSignupClick,
  onLanguageToggle,
  onProClick
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHomeClick}
        >
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight hidden md:inline">
            NeuroStudy AI
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <div className="flex bg-black/40 p-1 rounded-full border border-white/10 text-[10px] font-bold">
            <button 
              onClick={() => onLanguageToggle('en')}
              className={`px-3 py-1 rounded-full transition-all ${stats.preferredLanguage === 'en' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              EN
            </button>
            <button 
              onClick={() => onLanguageToggle('si')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${stats.preferredLanguage === 'si' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {!stats.isPro && <Lock className="w-2.5 h-2.5" />} SI
            </button>
          </div>

          {isLoggedIn ? (
            <>
              {/* Pro Badge */}
              <button 
                onClick={onProClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                  stats.isPro 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-400/50 text-white shadow-lg shadow-amber-500/20' 
                    : 'bg-black/20 border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${stats.isPro ? 'text-white' : 'text-indigo-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">{stats.isPro ? 'Pro Member' : 'Get Pro'}</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 hidden sm:flex hover:bg-black/30 transition-colors" title="Streak">
                <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{stats.streak}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 hidden sm:flex hover:bg-black/30 transition-colors" title="XP Points">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-100">{stats.xp}</span>
              </div>
              
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" /> Login
              </button>
              <Button 
                variant="primary" 
                onClick={onSignupClick}
                className="!py-2 !px-4 !rounded-lg text-sm"
              >
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Sign Up
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};