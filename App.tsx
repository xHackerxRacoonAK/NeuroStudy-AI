import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { SummaryView } from './components/SummaryView';
import { QuizView, QuizResult } from './components/QuizView';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { MainDashboard } from './components/MainDashboard';
import { SnowParticles } from './components/ui/SnowParticles';
import { TestVersionPopup } from './components/ui/TestVersionPopup';
import { extractTextFromPDF } from './services/pdfService';
import { generateSummary, generateQuiz } from './services/geminiService';
import { useGamification, MAX_FREE_UPLOADS } from './hooks/useGamification';
import { AppView, QuizQuestion, QuizSession } from './types';
import { Button } from './components/ui/Button';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userEmail, setUserEmail] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // State for quiz progress restoration
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { stats, addXP, completeQuiz, setLanguage, incrementUsage, togglePro } = useGamification(userEmail);

  // Initialize: Check Login and Active Session
  useEffect(() => {
    setIsLoadingStats(true); // Start loading state
    const savedEmail = localStorage.getItem('neurostudy_email');
    
    // Simulate data fetching delay for "real website" feel
    const timer = setTimeout(() => {
      setIsLoadingStats(false);
      if (savedEmail) {
        setUserEmail(savedEmail);
        
        // Check for saved quiz session
        const savedSession = localStorage.getItem('neurostudy_quiz_progress');
        if (savedSession) {
          try {
            const sessionData = JSON.parse(savedSession) as QuizSession;
            setQuizSession(sessionData);
          } catch (e) {
            console.error("Failed to parse saved session", e);
            localStorage.removeItem('neurostudy_quiz_progress');
          }
        }
        
        setView(AppView.MAIN_DASHBOARD);
      } else {
        setView(AppView.LANDING);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('neurostudy_email', email);
    setUserEmail(email);
    setIsLoadingStats(true);
    setTimeout(() => {
      setIsLoadingStats(false);
      setView(AppView.MAIN_DASHBOARD);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('neurostudy_email');
    localStorage.removeItem('neurostudy_quiz_progress'); // Clear active session on logout
    setUserEmail('');
    setQuizSession(null);
    setView(AppView.LANDING);
  };

  const handleNavigateToLogin = () => {
    setAuthMode('login');
    setView(AppView.LOGIN);
  };

  const handleNavigateToSignup = () => {
    setAuthMode('signup');
    setView(AppView.LOGIN);
  };

  const handleResumeSession = () => {
    if (quizSession) {
      setQuiz(quizSession.questions);
      setQuizScore(null);
      if (quizSession.summaryContext) {
        setSummary(quizSession.summaryContext);
      }
      setView(AppView.QUIZ);
    }
  };

  const handleFileSelect = async (file: File) => {
    // Check limitations
    if (!stats.isPro && stats.usageCount >= MAX_FREE_UPLOADS) {
      handleUpgrade();
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 50) {
        throw new Error("Could not extract enough text from PDF.");
      }

      const aiSummary = await generateSummary(text, stats.preferredLanguage);
      setSummary(aiSummary);
      
      sessionStorage.setItem('current_pdf_text', text);
      addXP(10); 
      incrementUsage(); // Record usage
      
      localStorage.removeItem('neurostudy_quiz_progress');
      setQuizSession(null);
      
      setView(AppView.DASHBOARD);
    } catch (error) {
      console.error(error);
      alert('Error processing file. Please ensure it is a text-based PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const text = sessionStorage.getItem('current_pdf_text') || '';
      const questions = await generateQuiz(text, stats.preferredLanguage);
      if (questions.length === 0) {
        throw new Error("Failed to generate quiz");
      }
      setQuiz(questions);
      setQuizScore(null);

      const newSession: QuizSession = {
        questions,
        currentIndex: 0,
        score: 0,
        summaryContext: summary
      };
      setQuizSession(newSession);
      localStorage.setItem('neurostudy_quiz_progress', JSON.stringify(newSession));
      
      setView(AppView.QUIZ);
    } catch (error) {
      console.error(error);
      alert('Could not generate quiz. Please try again.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizProgress = (currentIndex: number, currentScore: number) => {
    if (quizSession) {
      const updatedSession = { ...quizSession, currentIndex, score: currentScore };
      setQuizSession(updatedSession);
      localStorage.setItem('neurostudy_quiz_progress', JSON.stringify(updatedSession));
    }
  };

  const handleQuizComplete = (score: number, timeTaken: number, maxStreak: number) => {
    completeQuiz(score, quiz.length, timeTaken, maxStreak);
    setQuizScore(score);
    localStorage.removeItem('neurostudy_quiz_progress');
    setQuizSession(null);
  };

  const handleRetryQuiz = () => {
    setQuizScore(null);
    const retrySession: QuizSession = {
        questions: quiz,
        currentIndex: 0,
        score: 0,
        summaryContext: summary
    };
    setQuizSession(retrySession);
    localStorage.setItem('neurostudy_quiz_progress', JSON.stringify(retrySession));
    setView(AppView.QUIZ);
  };

  const handleHome = () => {
    if (userEmail) {
      setView(AppView.MAIN_DASHBOARD);
    } else {
      setView(AppView.LANDING);
    }
  };

  const handleStartNew = () => {
    setView(AppView.UPLOAD);
    setSummary('');
    setQuiz([]);
    setQuizScore(null);
  };

  const handleUpgrade = () => {
    alert("🚀 NeuroStudy AI Premium Mode Coming Soon!\n\nUpgrade today to unlock:\n• Unlimited Daily Uploads\n• Sinhala (සිංහල) Language Support\n• Advanced AI Model (Gemini 3 Pro)\n• Ad-free Experience\n\nStay tuned for the official launch!");
  };

  const handleLanguageChange = (lang: 'en' | 'si') => {
    if (lang === 'si' && !stats.isPro) {
      handleUpgrade();
      return;
    }
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      <SnowParticles />
      <TestVersionPopup />
      
      <Header 
        stats={stats} 
        onHomeClick={handleHome} 
        isLoggedIn={!!userEmail} 
        onLogout={handleLogout}
        onLoginClick={handleNavigateToLogin}
        onSignupClick={handleNavigateToSignup}
        onLanguageToggle={handleLanguageChange}
        onProClick={handleUpgrade}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative z-10">
        
        {view === AppView.LANDING && (
          <LandingPage 
            onGetStarted={handleNavigateToSignup} 
            onLogin={handleNavigateToLogin}
          />
        )}

        {view === AppView.LOGIN && (
          <AuthPage 
            initialMode={authMode}
            onLoginSuccess={handleLoginSuccess} 
            onBack={() => setView(AppView.LANDING)} 
          />
        )}

        {view === AppView.MAIN_DASHBOARD && (
          <MainDashboard 
            stats={stats} 
            userEmail={userEmail} 
            hasActiveSession={!!quizSession}
            isLoading={isLoadingStats}
            onStartNew={handleStartNew}
            onResume={handleResumeSession}
          />
        )}

        {view === AppView.UPLOAD && (
          <div className="w-full animate-fade-in-up">
            <div className="text-center mb-12">
              <Button variant="glass" onClick={handleHome} className="mb-8 text-sm py-2 px-4">
                 &larr; Back to Dashboard
              </Button>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                Study Smarter, Not Harder
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Upload your course material and let AI transform it into concise summaries and interactive quizzes instantly in your preferred language.
              </p>
            </div>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isLoading={isProcessing} 
              usageCount={stats.usageCount}
              maxFree={MAX_FREE_UPLOADS}
              isPro={stats.isPro}
              onUpgradeClick={handleUpgrade}
            />
          </div>
        )}

        {view === AppView.DASHBOARD && (
          <SummaryView 
            summary={summary} 
            onStartQuiz={handleStartQuiz} 
            isGeneratingQuiz={isGeneratingQuiz} 
          />
        )}

        {view === AppView.QUIZ && (
          quizScore === null ? (
            <QuizView 
              questions={quiz} 
              initialIndex={quizSession?.currentIndex || 0}
              initialScore={quizSession?.score || 0}
              onProgress={handleQuizProgress}
              onComplete={handleQuizComplete} 
            />
          ) : (
            <QuizResult 
              score={quizScore} 
              total={quiz.length} 
              onRetry={handleRetryQuiz} 
              onHome={handleHome} 
            />
          )
        )}

      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5 bg-[#0f111a] relative z-10">
        <div className="flex flex-col items-center gap-2">
          <p className="font-medium text-gray-400">Made by AK</p>
          <p className="text-xs opacity-50">© {new Date().getFullYear()} NeuroStudy AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}