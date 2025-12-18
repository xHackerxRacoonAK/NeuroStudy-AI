import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  usageCount: number;
  maxFree: number;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  isLoading, 
  usageCount, 
  maxFree, 
  isPro,
  onUpgradeClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLimitReached = !isPro && usageCount >= maxFree;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLimitReached) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLimitReached) return;
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
          isLimitReached 
            ? 'border-gray-700 bg-gray-900/50 cursor-not-allowed opacity-80'
            : isDragging
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]'
              : 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLimitReached && inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="application/pdf"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={isLoading || isLimitReached}
        />

        <div className="p-12 flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full bg-gradient-to-tr transition-transform duration-500 ${
            isLimitReached 
              ? 'from-gray-600 to-gray-700'
              : 'from-indigo-500 to-purple-500 shadow-xl group-hover:scale-110'
          } ${isLoading ? 'scale-110' : ''}`}>
             {isLoading ? (
               <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full" />
             ) : isLimitReached ? (
               <Lock className="w-8 h-8 text-white/50" />
             ) : (
               <Upload className="w-8 h-8 text-white" />
             )}
          </div>
          
          <div className="space-y-1">
            <h3 className={`text-xl font-semibold ${isLimitReached ? 'text-gray-500' : 'text-white'}`}>
              {isLoading ? 'Processing Document...' : isLimitReached ? 'Daily Limit Reached' : 'Upload Study Material'}
            </h3>
            <p className="text-gray-400 text-sm">
              {isLoading 
                ? 'AI is analyzing your PDF' 
                : isLimitReached 
                  ? 'Upgrade to Pro for unlimited uploads and Sinhala support' 
                  : 'Drag & drop your PDF here, or click to browse'}
            </p>
          </div>

          {!isLoading && !isLimitReached && (
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> PDF Support
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Secure Parse
              </span>
            </div>
          )}
        </div>
        
        {/* Decorative Gradients */}
        {!isLimitReached && (
          <>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          </>
        )}
      </div>

      {/* Usage Meter */}
      {!isPro && (
        <div className="px-6 py-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
                <p className="text-xs text-gray-400 font-medium">Free Tier Usage</p>
                <p className="text-sm text-white font-bold">{usageCount} / {maxFree} Uploads</p>
             </div>
          </div>
          {isLimitReached ? (
            <Button variant="primary" onClick={onUpgradeClick} className="!py-1.5 !px-4 !text-xs">
              Upgrade Now
            </Button>
          ) : (
            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-500 transition-all duration-1000" 
                 style={{ width: `${(usageCount / maxFree) * 100}%` }} 
               />
            </div>
          )}
        </div>
      )}
    </div>
  );
};