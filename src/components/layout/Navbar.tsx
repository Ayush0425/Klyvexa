'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Key, Instagram } from 'lucide-react';
import { SafetyScoreBadge } from '../safety/SafetyScoreBadge';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      {/* Brand & Workspace Switcher */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white shadow-sm">
            <Instagram className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Klyvexa<span className="text-slate-400 font-normal ml-1">Enterprise</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5">100% Official Meta Safe API</span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-4">
          <span className="text-xs text-slate-400">Workspace:</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            Klyvexa HQ
          </span>
        </div>
      </div>

      {/* Safety Score, Key Guide, Profile */}
      <div className="flex items-center gap-3.5">
        <SafetyScoreBadge score={98} />

        <Link
          href="/settings/keys"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-subtle"
        >
          <Key className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">API Keys & Setup</span>
        </Link>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">
          KX
        </div>
      </div>
    </header>
  );
}
