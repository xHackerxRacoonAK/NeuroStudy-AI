export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // The correct option string
  type: 'multiple-choice' | 'true-false';
}

export interface QuizHistoryItem {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastLogin: string;
  quizzesCompleted: number;
  history: QuizHistoryItem[];
  achievements: string[]; // Array of unlocked achievement IDs
  usageCount: number; // Number of documents processed
  isPro: boolean; // Subscription status
  preferredLanguage: 'en' | 'si'; // English or Sinhala
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: 'Target' | 'Flame' | 'Zap' | 'Trophy' | 'Crown' | 'BookOpen';
  requirement: string;
  xpReward: number;
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  MAIN_DASHBOARD = 'MAIN_DASHBOARD',
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD', // This is the Summary view
  QUIZ = 'QUIZ',
}

export interface ParsedDocument {
  name: string;
  text: string;
  summary?: string;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  summaryContext?: string;
}