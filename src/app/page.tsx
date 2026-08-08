'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Zap,
  Lock,
  ArrowUpRight,
  Sparkles,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';
import { SafeModeBanner } from '@/components/safety/SafeModeBanner';
import { RateLimitGauge } from '@/components/safety/RateLimitGauge';
import { MetaConnectButton } from '@/components/accounts/MetaConnectButton';

export default function OverviewDashboard() {
  const [isSafeMode, setIsSafeMode] = useState(true);
  const [totalReviewedDMs] = useState(18);

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Connect */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Klyvexa Compliance & Safety Center
            </h1>
            <SafetyScoreBadge score={98} size="lg" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Enterprise Instagram DM automation powered strictly by the official Meta Graph API v20.0.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings/keys"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-subtle"
          >
            <Key className="h-4 w-4 text-slate-400" />
            <span>API Keys Required</span>
          </Link>
          <MetaConnectButton size="default" />
        </div>
      </div>

      {/* Safe Mode Active Protection Banner */}
      <SafeModeBanner
        isSafeMode={isSafeMode}
        totalAutomatedDMs={totalReviewedDMs}
        maxGraduationDMs={50}
        onToggleSafeMode={(val) => setIsSafeMode(val)}
      />

      {/* Rate Limits & Spike Protection Gauges */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Live Rate Limits & Safety Caps
          </h2>
          <span className="text-xs text-slate-400">Auto-resets hourly/daily</span>
        </div>
        <RateLimitGauge
          hourlyCurrent={24}
          hourlyMax={250}
          dailyCurrent={142}
          dailyMax={1500}
          viralThreshold={12}
          currentInboundVelocity={3}
        />
      </div>

      {/* Connected Instagram Accounts Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Connected Instagram Accounts</h2>
            <p className="text-xs text-slate-500">Official Graph API tokens encrypted with AES-256-GCM at rest via Klyvexa Vault.</p>
          </div>
          <Link
            href="/accounts"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            Manage Accounts <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Connected Account Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] p-0.5 shadow-sm">
                <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center font-bold text-slate-800 text-sm">
                  @KX
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">@klyvexa.official</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    Active • Webhooks Subscribed
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span>IGSID: 178414053092819</span>
                  <span>•</span>
                  <span>Page ID: 10928374619</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Klyvexa AES-256 Vault Encrypted</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">98/100 Safety Score</span>
                </div>
              </div>
            </div>

            <Link
              href="/flows"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-subtle"
            >
              Configure Flows
            </Link>
          </div>

          {/* Quick Connect Helper Card */}
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 flex flex-col justify-center items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 mb-2">
              <Instagram className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-900">Connect Additional Business Account</h3>
            <p className="mt-0.5 text-[11px] text-slate-400 max-w-xs mb-3">
              Requires Instagram Professional (Business or Creator) account linked to a Facebook Page.
            </p>
            <MetaConnectButton size="default" />
          </div>
        </div>
      </div>

      {/* Safety & Compliance Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>24-Hr Window Compliance</span>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">100% Locked</div>
          <p className="mt-1 text-[11px] text-slate-400">Zero policy violations. Hard drop on expired windows.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Message Variation Engine</span>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">5+ Paraphrases</div>
          <p className="mt-1 text-[11px] text-slate-400">Anti-spam randomizer active on all outbound steps.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Zap className="h-4 w-4 text-amber-600" />
            <span>Circuit Breaker Status</span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-700">Healthy (0.0% Error)</div>
          <p className="mt-1 text-[11px] text-slate-400">Auto-pauses if Meta API errors exceed 3%.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>AES-256 Token Vault</span>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">Encrypted at Rest</div>
          <p className="mt-1 text-[11px] text-slate-400">PBKDF2 key derivation with unique 12-byte IVs.</p>
        </div>
      </div>
    </div>
  );
}
