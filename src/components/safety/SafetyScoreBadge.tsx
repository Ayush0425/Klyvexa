'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface SafetyScoreBadgeProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SafetyScoreBadge({ score, size = 'md', showLabel = true }: SafetyScoreBadgeProps) {
  let colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'Pristine Safe';
  let icon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;

  if (score < 70) {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
    badgeText = 'High Risk';
    icon = <ShieldAlert className="w-4 h-4 text-rose-600" />;
  } else if (score < 90) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeText = 'Guarded';
    icon = <ShieldCheck className="w-4 h-4 text-amber-600" />;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-all duration-200 ${colorClass} ${sizeClasses[size]}`}
      title={`Meta API Safety Score: ${score}/100 based on official policy compliance and error rate monitoring.`}
    >
      {icon}
      <span>{score}/100</span>
      {showLabel && <span className="opacity-80 font-normal">({badgeText})</span>}
    </div>
  );
}
