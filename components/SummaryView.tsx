import React, { useState, useEffect } from 'react';
import { Download, PlayCircle, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import jsPDF from 'jspdf';

interface SummaryViewProps {
  summary: string;
  onStartQuiz: () => void;
  isGeneratingQuiz: boolean;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, onStartQuiz, isGeneratingQuiz }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    // Speed up typing for long text
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + summary.charAt(index));
      index++;
      if (index >= summary.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [summary]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("NeuroStudy AI - Summary", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const splitText = doc.splitTextToSize(summary, 170);
    doc.text(splitText, 20, 30);
    doc.save("study-summary.pdf");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Summary</h2>
          </div>
          <button 
            onClick={handleExportPDF}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white" 
            title="Export PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-200 min-h-[100px]">
            {displayedText}
            {isTyping && <span className="animate-pulse ml-1">|</span>}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={onStartQuiz} 
          disabled={isTyping} 
          isLoading={isGeneratingQuiz}
          className="shadow-2xl shadow-indigo-500/20"
        >
          <span className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Generate & Start Quiz
          </span>
        </Button>
      </div>
    </div>
  );
};