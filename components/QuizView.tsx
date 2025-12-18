import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { Button } from './ui/Button';

interface QuizViewProps {
  questions: QuizQuestion[];
  initialIndex?: number;
  initialScore?: number;
  onProgress: (currentIndex: number, currentScore: number) => void;
  onComplete: (score: number, timeTaken: number, maxStreak: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
  questions, 
  initialIndex = 0, 
  initialScore = 0,
  onProgress, 
  onComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [showResult, setShowResult] = useState(false);
  
  // Performance tracking
  const startTimeRef = useRef(Date.now());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Sync internal state if props change (re-hydration)
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScore(initialScore);
  }, [initialIndex, initialScore]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    setIsFlipped(true);
    setShowResult(true);
    let newScore = score;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
    } else {
      setCurrentStreak(0);
    }

    // Save progress immediately after checking
    onProgress(currentIndex, newScore);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowResult(false);
    setSelectedOption(null);

    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        // Save progress for the next question start
        onProgress(nextIndex, score);
      }, 300); // Wait for flip back
    } else {
      // Finished
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      onComplete(score, timeTaken, maxStreak);
    }
  };

  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8 relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="h-[450px] w-full flip-card">
        <div className={`flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT: Question */}
          <div className="flip-card-front glass-panel rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
                  Question {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                   Streak: {currentStreak} 🔥
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mt-2 text-white leading-snug">
                {currentQuestion.question}
              </h3>
              
              <div className="mt-8 space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                      ${selectedOption === option 
                        ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                      }`}
                  >
                    <span className={`text-base font-medium ${selectedOption === option ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {option}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedOption === option ? 'border-white bg-white' : 'border-gray-500'}`}
                    >
                      {selectedOption === option && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleCheckAnswer} 
                disabled={!selectedOption}
                className="w-full sm:w-auto"
              >
                Check Answer
              </Button>
            </div>
          </div>

          {/* BACK: Result */}
          <div className="flip-card-back glass-panel rounded-3xl p-8 flex flex-col justify-center items-center rotate-y-180 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl
              ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {isCorrect ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
            
            <p className="text-center text-gray-300 max-w-md mb-8">
              {isCorrect 
                ? "Great job! You've mastered this concept." 
                : `The correct answer was: ${currentQuestion.correctAnswer}`
              }
            </p>

            <Button onClick={handleNext} variant="glass">
              <span className="flex items-center gap-2">
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} 
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuizResultProps {
  score: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({ score, total, onRetry, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
      <div className="glass-panel rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/10 to-purple-500/10" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <Award className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-400 mb-8">You've earned {score * 10} XP</p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{score}/{total}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Score</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                {percentage}%
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Accuracy</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" onClick={onRetry}>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Retry
              </span>
            </Button>
            <Button onClick={onHome}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};