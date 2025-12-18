import { useState, useEffect } from 'react';
import { UserStats, Achievement, QuizHistoryItem } from '../types';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  lastLogin: new Date().toISOString(),
  quizzesCompleted: 0,
  history: [],
  achievements: [],
  usageCount: 0,
  isPro: false,
  preferredLanguage: 'en'
};

export const MAX_FREE_UPLOADS = 3;

export const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_step', 
    title: 'First Step', 
    description: 'Complete your first quiz', 
    iconName: 'BookOpen', 
    requirement: '1 Quiz',
    xpReward: 50
  },
  { 
    id: 'streak_3', 
    title: 'On Fire', 
    description: 'Reach a 3-day learning streak', 
    iconName: 'Flame', 
    requirement: '3 Days',
    xpReward: 150
  },
  { 
    id: 'high_score', 
    title: 'Sharpshooter', 
    description: 'Score 100% on a quiz', 
    iconName: 'Target', 
    requirement: 'Perfect Score',
    xpReward: 100
  },
  { 
    id: 'combo_5', 
    title: 'On a Roll', 
    description: 'Answer 5 questions correctly in a row', 
    iconName: 'Zap', 
    requirement: '5 Streak',
    xpReward: 150
  },
  { 
    id: 'speedster', 
    title: 'Speedster', 
    description: 'Complete a quiz in under 60 seconds (min 3 questions)', 
    iconName: 'Zap', 
    requirement: '< 60s',
    xpReward: 200
  },
  { 
    id: 'dedicated', 
    title: 'Dedicated', 
    description: 'Earn 1000 XP total', 
    iconName: 'Trophy', 
    requirement: '1000 XP',
    xpReward: 500
  },
  { 
    id: 'quiz_master', 
    title: 'Quiz Master', 
    description: 'Complete 10 quizzes', 
    iconName: 'Crown', 
    requirement: '10 Quizzes',
    xpReward: 300
  }
];

export const useGamification = (userId: string) => {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

  const storageKey = userId ? `neurostudy_stats_${userId}` : null;

  useEffect(() => {
    if (!storageKey) {
      setStats(DEFAULT_STATS);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const merged: UserStats = { ...DEFAULT_STATS, ...parsed };

        const last = new Date(merged.lastLogin);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - last.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        let newStreak = merged.streak;
        if (diffDays === 1) {
            // Continued streak
        } else if (diffDays > 1) {
            const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === last.toDateString();
            if (!isYesterday && diffDays > 1) {
               newStreak = 0;
            }
        }
        
        const updated = { ...merged, streak: newStreak === 0 && merged.streak === 0 ? 1 : newStreak, lastLogin: new Date().toISOString() };
        
        if (merged.lastLogin === DEFAULT_STATS.lastLogin && diffDays === 0) {
           updated.streak = 1;
        }

        setStats(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Stats parse error", e);
        setStats(DEFAULT_STATS);
      }
    } else {
      const initial = { ...DEFAULT_STATS, streak: 1 };
      setStats(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  }, [storageKey]);

  const setLanguage = (lang: 'en' | 'si') => {
    if (!storageKey) return;
    setStats(prev => {
      const next = { ...prev, preferredLanguage: lang };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const incrementUsage = () => {
    if (!storageKey) return;
    setStats(prev => {
      const next = { ...prev, usageCount: prev.usageCount + 1 };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const togglePro = () => {
    if (!storageKey) return;
    setStats(prev => {
      const next = { ...prev, isPro: !prev.isPro };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const checkForAchievements = (currentStats: UserStats, sessionMetrics: { percentage: number, timeTaken: number, maxStreak: number, totalQuestions: number }) => {
    const unlocks: string[] = [];
    const earnedAchievements: Achievement[] = [];

    AVAILABLE_ACHIEVEMENTS.forEach(ach => {
      if (currentStats.achievements.includes(ach.id)) return;
      let unlocked = false;

      switch (ach.id) {
        case 'first_step': if (currentStats.quizzesCompleted >= 1) unlocked = true; break;
        case 'streak_3': if (currentStats.streak >= 3) unlocked = true; break;
        case 'high_score': if (sessionMetrics.percentage === 1) unlocked = true; break;
        case 'combo_5': if (sessionMetrics.maxStreak >= 5) unlocked = true; break;
        case 'speedster': if (sessionMetrics.timeTaken < 60 && sessionMetrics.totalQuestions >= 3) unlocked = true; break;
        case 'dedicated': if (currentStats.xp >= 1000) unlocked = true; break;
        case 'quiz_master': if (currentStats.quizzesCompleted >= 10) unlocked = true; break;
      }

      if (unlocked) {
        unlocks.push(ach.id);
        earnedAchievements.push(ach);
      }
    });

    return { unlocks, earnedAchievements };
  };

  const addXP = (amount: number) => {
    if (!storageKey) return;
    setStats(prev => {
      const next = { ...prev, xp: prev.xp + amount };
      const { unlocks, earnedAchievements } = checkForAchievements(next, { percentage: 0, timeTaken: 9999, maxStreak: 0, totalQuestions: 0 });
      let finalXP = next.xp;
      if (unlocks.length > 0) {
        const bonusXP = earnedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
        finalXP += bonusXP;
        next.achievements = [...next.achievements, ...unlocks];
        setNewUnlocks(earnedAchievements);
      }
      next.xp = finalXP;
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const completeQuiz = (score: number, total: number, timeTaken: number, maxStreak: number) => {
    if (!storageKey) return;
    setStats(prev => {
      const baseXP = score * 10;
      const completionBonus = 50;
      let totalXP = baseXP + completionBonus;
      if (timeTaken < 60 && total >= 3) totalXP += 20;
      const percentage = total > 0 ? score / total : 0;
      const historyItem: QuizHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score,
        totalQuestions: total,
        xpEarned: totalXP
      };
      const next = {
        ...prev,
        xp: prev.xp + totalXP,
        quizzesCompleted: prev.quizzesCompleted + 1,
        history: [historyItem, ...prev.history].slice(0, 10),
      };
      const { unlocks, earnedAchievements } = checkForAchievements(next, { percentage, timeTaken, maxStreak, totalQuestions: total });
      if (unlocks.length > 0) {
        const bonusXP = earnedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
        next.xp += bonusXP;
        next.achievements = [...next.achievements, ...unlocks];
        setNewUnlocks(earnedAchievements);
      }
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const clearNewUnlocks = () => setNewUnlocks([]);

  return { stats, addXP, completeQuiz, newUnlocks, clearNewUnlocks, setLanguage, incrementUsage, togglePro };
};