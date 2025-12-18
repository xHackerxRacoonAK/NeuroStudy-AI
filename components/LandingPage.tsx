import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, Sparkles, Brain, Zap, Shield, Check } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in-up space-y-16 py-10">
      
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full max-w-6xl">
        
        {/* Left: Copy */}
        <div className="text-left space-y-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3 h-3" /> AI-Powered Learning V2.0
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Master Any Topic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              In Seconds.
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Stop drowning in PDFs. NeuroStudy AI instantly transforms your study materials into concise summaries and gamified quizzes using advanced Gemini AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Button onClick={onGetStarted} className="px-8 py-4 text-lg shadow-xl shadow-indigo-500/20">
                <span className="flex items-center gap-2">
                  Start Learning Now <ArrowRight className="w-5 h-5" />
                </span>
             </Button>
             
             <button onClick={onLogin} className="px-8 py-4 rounded-xl text-gray-300 font-medium border border-white/10 hover:bg-white/5 transition-colors">
                Explore Demo
             </button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-500 font-medium">
             <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" /> Free Tier Available
             </div>
             <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" /> No Credit Card Required
             </div>
          </div>
        </div>

        {/* Right: Visual Mockup */}
        <div className="order-1 lg:order-2 w-full max-w-md mx-auto relative group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-float" />
          
          {/* Mock Quiz Card */}
          <div className="glass-panel p-8 rounded-3xl relative shadow-2xl backdrop-blur-xl bg-[#13151f]/90 border border-white/10 transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Question 1/5</span>
                <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400">Biology 101</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-6">
                What is the primary function of the mitochondria in a cell?
            </h3>

            <div className="space-y-3 opacity-90">
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-400">Storage of genetic material</div>
                <div className="p-3 rounded-xl border border-indigo-500/50 bg-indigo-500/20 text-sm text-white font-medium flex justify-between items-center">
                    Powerhouse of the cell
                    <Check className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-400">Protein synthesis</div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#13151f]" />
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#13151f]" />
                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#13151f]" />
                </div>
                <span className="text-xs text-gray-400">Joined by 10k+ students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Features Strip */}
      <div className="w-full border-t border-white/5 pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">Smart</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">AI Extraction</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">Fast</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Instant Generation</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">Secure</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Local Processing</p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white">Fun</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Gamified Learning</p>
            </div>
        </div>
      </div>

    </div>
  );
};