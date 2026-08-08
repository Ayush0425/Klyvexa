'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Instagram,
  GitFork,
  MessageSquare,
  Users,
  Sparkles,
  ShieldCheck,
  FileText,
  Key,
  HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/accounts', label: 'Instagram Accounts', icon: Instagram, badge: 'Official' },
  { href: '/flows', label: 'Flow Builder', icon: GitFork },
  { href: '/inbox', label: 'Live Shared Inbox', icon: MessageSquare },
  { href: '/contacts', label: 'Contacts & Leads', icon: Users },
  { href: '/ai-agent', label: 'Brand Voice AI', icon: Sparkles },
  { href: '/settings/rate-limits', label: 'Rate Limits & Safety', icon: ShieldCheck },
  { href: '/settings/audit-logs', label: 'Compliance Audit Logs', icon: FileText },
  { href: '/settings/keys', label: 'API Keys & Secrets', icon: Key },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Platform Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white shadow-subtle'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Compliance Guarantee Card */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Meta Compliance Verified</span>
        </div>
        <p className="text-[11px] text-emerald-700/80 leading-relaxed">
          100% Graph API only. 24-hr messaging window hard locks & AES-256 encrypted token vault active.
        </p>
      </div>
    </aside>
  );
}
