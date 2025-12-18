import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const TestVersionPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up max-w-sm w-full mx-4 sm:mx-0">
      <div className="glass-panel p-4 rounded-2xl border border-yellow-500/30 bg-[#0f111a]/90 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-colors" />
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-yellow-500/20 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex-1 mr-6">
            <h4 className="font-bold text-white text-sm mb-1">Beta Preview</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              This is a test version. Features may change. Full release coming soon!
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};