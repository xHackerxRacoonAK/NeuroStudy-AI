import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="glass-panel p-6 rounded-2xl border border-white/5">
    <div className="flex items-start justify-between">
      <div className="space-y-3 w-full">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  </div>
);