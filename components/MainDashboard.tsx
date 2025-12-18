import React, { useState, useMemo } from 'react';
import { UserStats, Achievement } from '../types';
import { Button } from './ui/Button';
import { Skeleton, CardSkeleton } from './ui/Skeleton';
import { AVAILABLE_ACHIEVEMENTS } from '../hooks/useGamification';
import { 
  Flame, Trophy, Target, Plus, Play, History, GraduationCap, 
  BookOpen, Crown, Zap, Calendar, TrendingUp, Lock, Sparkles, Medal
} from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, subtext, color }) => (
  <div className={`glass-panel p-6 rounded-2xl border transition-transform hover:scale-[1.02] duration-300 bg-gradient-to-br ${color}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
        {icon}
      </div>
    </div>
    <p className="text-xs text-gray-400 font-medium bg-black/20 inline-block px-2 py-1 rounded-lg">
      {subtext}
    </p>
  </div>
);

interface MainDashboardProps {
  stats: UserStats;
  userEmail: string;
  hasActiveSession: boolean;
  isLoading: boolean;
  onStartNew: () => void;
  onResume: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ 
  stats, 
  userEmail, 
  hasActiveSession, 
  isLoading,
  onStartNew, 
  onResume 
}) => {
  const userName = userEmail.split('@')[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');

  // Daily Motivation Logic
  const motivation = useMemo(() => {
    const quotes = [
      "Success is the sum of small efforts, repeated day in and day out.",
      "The expert in anything was once a beginner.",
      "Don't let yesterday take up too much of today.",
      "You don't have to be great to start, but you have to start to be great.",
      "The beautiful thing about learning is that no one can take it away from you.",
      "Your limitation—it's only your imagination.",
      "Push yourself, because no one else is going to do it for you."
    ];
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return quotes[dayOfYear % quotes.length];
  }, []);

  // Dynamic Leaderboard Generation based on Local Storage Users
  const leaderboard = useMemo(() => {
    // 1. Get all registered users
    const usersMap = JSON.parse(localStorage.getItem('neurostudy_users') || '{}');
    const emails = Object.keys(usersMap);
    
    const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
    
    // 2. Fetch stats for each user
    const allPlayers = emails.map((email) => {
       const statsKey = `neurostudy_stats_${email}`;
       let userXP = 0;
       try {
         const storedStats = localStorage.getItem(statsKey);
         if (storedStats) {
           const parsed = JSON.parse(storedStats);
           userXP = parsed.xp || 0;
         }
       } catch (e) {
         console.warn("Could not parse stats for leaderboard", email);
       }
       
       // Simple hash for color
       const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
       const colorClass = colors[hash % colors.length];

       return {
         name: email.split('@')[0],
         xp: userXP,
         isUser: email === userEmail,
         avatarColor: colorClass
       };
    });

    // 3. Sort by XP descending
    return allPlayers.sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [userEmail, stats.xp]);

  const getIcon = (name: string, className: string) => {
    const icons: Record<string, React.ReactNode> = {
      Flame: <Flame className={className} />,
      Trophy: <Trophy className={className} />,
      Target: <Target className={className} />,
      Crown: <Crown className={className} />,
      BookOpen: <BookOpen className={className} />,
      Zap: <Zap className={className} />,
    };
    return icons[name] || <Trophy className={className} />;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up px-4">
        <div className="flex flex-col gap-4">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Skeleton className="h-40 w-full rounded-3xl" />
             <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up px-4 relative z-10">
      {/* Welcome & Tabs */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 capitalize">{userName}</span>
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
             <Calendar className="w-4 h-4" /> 
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'overview' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
             onClick={() => setActiveTab('achievements')}
             className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'achievements' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:text-white'}`}
          >
            Achievements
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              icon={<Flame className="w-6 h-6 text-orange-500" />}
              label="Day Streak"
              value={`${stats.streak} Days`}
              subtext="Don't break the chain!"
              color="from-orange-500/10 to-red-500/5 border-orange-500/20"
            />
            <StatsCard 
              icon={<Trophy className="w-6 h-6 text-yellow-500" />}
              label="Total XP"
              value={stats.xp.toLocaleString()}
              subtext="Level: Scholar"
              color="from-yellow-500/10 to-amber-500/5 border-yellow-500/20"
            />
            <StatsCard 
              icon={<BookOpen className="w-6 h-6 text-blue-500" />}
              label="Quizzes Done"
              value={stats.quizzesCompleted.toString()}
              subtext="Knowledge check"
              color="from-blue-500/10 to-cyan-500/5 border-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
            
            {/* Main Action Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Action Card */}
              <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-md">
                     <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <Plus className="w-6 h-6 text-indigo-400" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Start a New Study Session</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Upload your course material (PDF) and let our AI generate a personalized study plan, summary, and quiz instantly.
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <Button onClick={onStartNew}>
                          Create Study Set
                        </Button>
                        {hasActiveSession && (
                          <Button variant="secondary" onClick={onResume}>
                             Resume
                          </Button>
                        )}
                     </div>
                  </div>
                  
                  {/* Visual Element */}
                  <div className="hidden md:flex flex-col gap-3">
                     <div className="w-48 p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md transform rotate-6 translate-x-2">
                        <div className="h-2 w-12 bg-indigo-500 rounded-full mb-2" />
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                     </div>
                     <div className="w-48 p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md transform -rotate-3 z-10 shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 rounded-full bg-green-500" />
                           <div className="h-2 w-16 bg-white/20 rounded-full" />
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full" />
                     </div>
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-gray-400" /> Recent Activity
                   </h3>
                </div>
                
                <div className="space-y-3">
                  {stats.history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                       No study history yet. Start your first session!
                    </div>
                  ) : (
                    stats.history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                         <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                               <BookOpen className="w-4 h-4 text-indigo-300" />
                            </div>
                            <div>
                               <div className="text-sm font-medium text-white">Study Session</div>
                               <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} • {item.totalQuestions} Questions</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-bold text-white">{Math.round((item.score / item.totalQuestions) * 100)}%</div>
                            <div className="text-xs text-emerald-400">+{item.xpEarned} XP</div>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Daily Motivation */}
              <div className="glass-panel rounded-3xl p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-bold text-white text-sm uppercase tracking-wide">Daily Motivation</h3>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-1 text-4xl text-white/10 font-serif">"</span>
                  <p className="text-sm text-gray-200 italic leading-relaxed px-3 relative z-10">
                     {motivation}
                  </p>
                  <span className="absolute -bottom-4 right-0 text-4xl text-white/10 font-serif">"</span>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-white">Global Leaderboard</h3>
                   </div>
                   <span className="text-xs text-gray-500">Real-Time</span>
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                     No users yet. Be the first!
                  </div>
                ) : (
                  <div className="space-y-4">
                     {leaderboard.map((user, index) => (
                        <div key={index} className={`flex items-center justify-between ${user.isUser ? 'bg-white/10 -mx-2 px-2 py-1 rounded-lg border border-white/5' : ''}`}>
                           <div className="flex items-center gap-3">
                              <div className="relative">
                                 <div className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center text-xs font-bold text-white border-2 border-[#13151f]`}>
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                 {index === 0 && (
                                    <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                                       <Crown className="w-2 h-2 text-black" />
                                    </div>
                                 )}
                              </div>
                              <span className={`text-sm font-medium ${user.isUser ? 'text-white' : index === 0 ? 'text-yellow-400' : 'text-gray-300'}`}>
                                 {user.name} {user.isUser && "(You)"}
                              </span>
                           </div>
                           <span className={`text-xs font-bold ${user.isUser ? 'text-white' : 'text-gray-400'}`}>{user.xp.toLocaleString()} XP</span>
                        </div>
                     ))}
                  </div>
                )}
              </div>

              {/* Mini Achievements Preview */}
              <div className="glass-panel rounded-3xl p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">My Badges</h3>
                    <button onClick={() => setActiveTab('achievements')} className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
                 </div>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {stats.achievements.slice(0, 3).map(achId => {
                       const ach = AVAILABLE_ACHIEVEMENTS.find(a => a.id === achId);
                       if (!ach) return null;
                       return (
                          <div key={achId} className="min-w-[60px] flex flex-col items-center gap-1 group cursor-default" title={ach.title}>
                             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                {getIcon(ach.iconName, "w-6 h-6 text-white")}
                             </div>
                             <span className="text-[10px] text-gray-400 truncate w-full text-center">{ach.title}</span>
                          </div>
                       );
                    })}
                    {stats.achievements.length === 0 && (
                       <div className="text-xs text-gray-500">No badges yet. Start quizzing!</div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-fade-in-up">
           <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Achievements Gallery</h2>
              <p className="text-gray-400 text-sm">Track your milestones and earned badges</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {AVAILABLE_ACHIEVEMENTS.map((ach) => {
                 const isUnlocked = stats.achievements.includes(ach.id);
                 return (
                    <div key={ach.id} className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${isUnlocked ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5 opacity-60 grayscale hover:grayscale-0'}`}>
                       <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20' : 'bg-white/10'}`}>
                             {getIcon(ach.iconName, "w-6 h-6 text-white")}
                          </div>
                          {isUnlocked ? (
                             <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Unlocked</span>
                          ) : (
                             <Lock className="w-4 h-4 text-gray-600" />
                          )}
                       </div>
                       <h3 className="font-bold text-white mb-1">{ach.title}</h3>
                       <p className="text-xs text-gray-400 mb-4 h-8">{ach.description}</p>
                       <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isUnlocked ? 'w-full bg-green-500' : 'w-0'}`} />
                       </div>
                       <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                          <span>{ach.requirement}</span>
                          <span>+{ach.xpReward} XP</span>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      )}
    </div>
  );
};