'use client';

import React from 'react';
import { Shield, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface SafeModeBannerProps {
  isSafeMode: boolean;
  totalAutomatedDMs: number;
  maxGraduationDMs?: number;
  onToggleSafeMode?: (newVal: boolean) => void;
}

export function SafeModeBanner({
  isSafeMode,
  totalAutomatedDMs,
  maxGraduationDMs = 50,
  onToggleSafeMode,
}: SafeModeBannerProps) {
  const isGraduated = totalAutomatedDMs >= maxGraduationDMs;
  const progressPercent = Math.min(100, Math.round((totalAutomatedDMs / maxGraduationDMs) * 100));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Safe Mode Protection</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                  isSafeMode
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isSafeMode ? 'ACTIVE & ENFORCED' : 'OFF'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 max-w-xl">
              {isSafeMode ? (
                <>
                  Mandatory human review active for the first <strong>{maxGraduationDMs} automated DMs</strong> to establish flawless account reputation with Meta.
                </>
              ) : (
                'Standard conservative rate limiting active (250/hr, 1,500/day).'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress bar */}
          <div className="flex flex-col items-end min-w-[140px]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <span>{totalAutomatedDMs} / {maxGraduationDMs} Reviewed</span>
              {isGraduated ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <UserCheck className="h-3.5 w-3.5 text-amber-600" />
              )}
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Toggle Button */}
          {onToggleSafeMode && (
            <button
              onClick={() => onToggleSafeMode(!isSafeMode)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                isSafeMode
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSafeMode ? 'Disable Safe Mode' : 'Enable Safe Mode'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
