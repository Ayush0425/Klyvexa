'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Instagram, ShieldCheck, Lock, Power, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { MetaConnectButton } from '@/components/accounts/MetaConnectButton';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';
import { SafeModeBanner } from '@/components/safety/SafeModeBanner';

interface MockAccount {
  id: string;
  username: string;
  name: string;
  igsid: string;
  pageId: string;
  isSafeMode: boolean;
  safetyScore: number;
  totalAutomatedDMs: number;
  hourlyCount: number;
  dailyCount: number;
  isActive: boolean;
  webhookSubscribed: boolean;
}

export default function AccountsManagementPage() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams?.get('success') === 'true';
  const isSandbox = searchParams?.get('sandbox') === 'true';

  const [accounts, setAccounts] = useState<MockAccount[]>([
    {
      id: 'acc_1',
      username: 'klyvexa.official',
      name: 'Klyvexa Business HQ',
      igsid: '178414053092819',
      pageId: '10928374619',
      isSafeMode: true,
      safetyScore: 98,
      totalAutomatedDMs: 18,
      hourlyCount: 24,
      dailyCount: 142,
      isActive: true,
      webhookSubscribed: true,
    },
  ]);

  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      setBannerNotice(
        isSandbox
          ? '🎉 Sandbox Instagram Account Connected & Protected under Safe Mode!'
          : '🎉 Official Meta Instagram Professional Account Connected Successfully!'
      );
    }
  }, [isSuccess, isSandbox]);

  const toggleSafeMode = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isSafeMode: !acc.isSafeMode } : acc))
    );
  };

  const toggleActive = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isActive: !acc.isActive } : acc))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {bannerNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between text-emerald-800 text-xs font-semibold shadow-subtle">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{bannerNotice}</span>
          </div>
          <button onClick={() => setBannerNotice(null)} className="text-slate-400 hover:text-slate-600">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Connected Instagram Accounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Link Instagram Professional accounts via official Meta Business OAuth. All tokens encrypted at rest via AES-256-GCM.
          </p>
        </div>

        <MetaConnectButton />
      </div>

      {/* Account List */}
      <div className="space-y-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] p-0.5 shadow-sm">
                  <div className="h-full w-full rounded-[14px] bg-white flex items-center justify-center font-bold text-slate-800 text-base">
                    @{acc.username.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-slate-900">@{acc.username}</h2>
                    <span className="text-xs text-slate-400 font-normal">({acc.name})</span>
                    <SafetyScoreBadge score={acc.safetyScore} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span>IGSID: {acc.igsid}</span>
                    <span>•</span>
                    <span>Facebook Page ID: {acc.pageId}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3" /> AES-256 Vault Encrypted
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(acc.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
                    acc.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{acc.isActive ? 'Active & Listening' : 'Paused'}</span>
                </button>
              </div>
            </div>

            {/* Safe Mode Banner per Account */}
            <SafeModeBanner
              isSafeMode={acc.isSafeMode}
              totalAutomatedDMs={acc.totalAutomatedDMs}
              maxGraduationDMs={50}
              onToggleSafeMode={() => toggleSafeMode(acc.id)}
            />

            {/* Quota & Limits row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Hourly Usage
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900">{acc.hourlyCount}</span>
                  <span className="text-xs text-slate-400">/ 250 max soft cap</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Daily Usage
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900">{acc.dailyCount}</span>
                  <span className="text-xs text-slate-400">/ 1,500 max soft cap</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Safety Gatekeeper
                </span>
                <span className="text-xs font-semibold text-emerald-700 block">
                  8s Cooldown • 12/min Viral Mode Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
