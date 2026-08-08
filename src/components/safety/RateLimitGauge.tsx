'use client';

import React from 'react';
import { Activity, Clock, Zap } from 'lucide-react';

interface RateLimitGaugeProps {
  hourlyCurrent: number;
  hourlyMax?: number;
  dailyCurrent: number;
  dailyMax?: number;
  viralThreshold?: number;
  currentInboundVelocity?: number;
}

export function RateLimitGauge({
  hourlyCurrent,
  hourlyMax = 250,
  dailyCurrent,
  dailyMax = 1500,
  viralThreshold = 12,
  currentInboundVelocity = 3,
}: RateLimitGaugeProps) {
  const hourlyPercent = Math.min(100, Math.round((hourlyCurrent / hourlyMax) * 100));
  const dailyPercent = Math.min(100, Math.round((dailyCurrent / dailyMax) * 100));
  const isViralMode = currentInboundVelocity >= viralThreshold;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hourly Gauge */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Hourly Safe Cap</span>
          </div>
          <span>{hourlyPercent}%</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-slate-900">{hourlyCurrent}</span>
          <span className="text-xs text-slate-400 font-normal">/ {hourlyMax} msgs</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              hourlyPercent > 80 ? 'bg-amber-500' : 'bg-slate-900'
            }`}
            style={{ width: `${hourlyPercent}%` }}
          />
        </div>
      </div>

      {/* Daily Gauge */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Daily Soft Limit</span>
          </div>
          <span>{dailyPercent}%</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-slate-900">{dailyCurrent}</span>
          <span className="text-xs text-slate-400 font-normal">/ {dailyMax} msgs</span>
        </div>
        <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              dailyPercent > 80 ? 'bg-rose-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
      </div>

      {/* Viral Mode Spike Status */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            <span>Viral Spike Protection</span>
          </div>
          <span
            className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              isViralMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isViralMode ? 'VIRAL PACING ACTIVE' : 'NOMINAL'}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold text-slate-900">{currentInboundVelocity}</span>
          <span className="text-xs text-slate-400 font-normal">inbound / min (Threshold: {viralThreshold})</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {isViralMode
            ? 'Spreading dispatches over 10-60s jitter batches.'
            : '8s per-recipient cooldown active.'}
        </p>
      </div>
    </div>
  );
}
