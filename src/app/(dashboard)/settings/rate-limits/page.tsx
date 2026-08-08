'use client';

import React from 'react';
import { ShieldCheck, Activity, Zap, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import { RateLimitGauge } from '@/components/safety/RateLimitGauge';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';
import { WebhookTesterModal } from '@/components/settings/WebhookTesterModal';

export default function RateLimitsSettingsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Rate Limits & Safety Gatekeeper
            </h1>
            <SafetyScoreBadge score={98} size="md" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Conservative limits (250/hr, 1,500/day), 8s recipient cooldown, and Viral Mode spike protection.
          </p>
        </div>
      </div>

      {/* Live Rate Limit Progress Meters */}
      <RateLimitGauge
        hourlyCurrent={24}
        hourlyMax={250}
        dailyCurrent={142}
        dailyMax={1500}
        viralThreshold={12}
        currentInboundVelocity={3}
      />

      {/* BullMQ Priority Queue Monitor */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">BullMQ Priority Queue Backlog</h2>
            <p className="text-xs text-slate-500">Intelligent hierarchy: Human handoffs processed immediately.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Activity className="h-3.5 w-3.5" /> All Queues Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="text-[11px] font-bold uppercase text-rose-700 tracking-wider">
              P0: Human Takeover
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-[11px] text-slate-400">Instant dispatch (0ms queue latency)</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="text-[11px] font-bold uppercase text-amber-700 tracking-wider">
              P1: Lead & Opt-Out
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-[11px] text-slate-400">Instant STOP interception</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="text-[11px] font-bold uppercase text-blue-700 tracking-wider">
              P2: Standard Flows
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">2</div>
            <p className="mt-1 text-[11px] text-slate-400">8s per-recipient cooldown active</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="text-[11px] font-bold uppercase text-purple-700 tracking-wider">
              P3: Viral Comments
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">5</div>
            <p className="mt-1 text-[11px] text-slate-400">Paced with 10s-60s randomized jitter</p>
          </div>
        </div>
      </div>

      {/* Interactive Webhook Simulator */}
      <WebhookTesterModal />
    </div>
  );
}
