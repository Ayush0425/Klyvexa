'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, ShieldCheck, UserX, CheckCircle2, Clock } from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';

interface ContactItem {
  id: string;
  username: string;
  name: string;
  email: string | null;
  phone: string | null;
  leadScore: number;
  optOutStatus: boolean;
  windowExpiresAt: string;
  lastSeen: string;
}

export default function ContactsCRMPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([
    {
      id: 'c_1',
      username: 'sarah_creator',
      name: 'Sarah Jenkins',
      email: 'sarah.j@growthcreative.co',
      phone: '+1 (555) 392-1092',
      leadScore: 95,
      optOutStatus: false,
      windowExpiresAt: '23h 24m remaining',
      lastSeen: '10 mins ago',
    },
    {
      id: 'c_2',
      username: 'alex_fitness',
      name: 'Alex Rivera',
      email: 'alex@riverafitness.com',
      phone: null,
      leadScore: 80,
      optOutStatus: false,
      windowExpiresAt: '16h remaining',
      lastSeen: '8 hours ago',
    },
    {
      id: 'c_3',
      username: 'david_crypto',
      name: 'David Kim',
      email: null,
      phone: null,
      leadScore: 10,
      optOutStatus: true,
      windowExpiresAt: 'Expired (Window Closed)',
      lastSeen: '3 days ago',
    },
  ]);

  const toggleOptOut = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, optOutStatus: !c.optOutStatus } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Contacts & Lead Qualification
            </h1>
            <SafetyScoreBadge score={100} size="sm" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Validated captured emails, phone numbers, and instant keyword opt-out statuses.
          </p>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Users className="h-4 w-4 text-slate-600" />
            <span>Captured Instagram Leads ({contacts.length})</span>
          </div>
          <span className="text-xs text-slate-500">CRM Sync Ready</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs">
                  {contact.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">@{contact.username}</span>
                    <span className="text-slate-400">({contact.name})</span>
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
                      Score: {contact.leadScore}/100
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {contact.email || 'No email captured'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {contact.phone || 'No phone'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium justify-end">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{contact.windowExpiresAt}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Last seen: {contact.lastSeen}</span>
                </div>

                <button
                  onClick={() => toggleOptOut(contact.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors border ${
                    contact.optOutStatus
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {contact.optOutStatus ? 'Opted Out (STOP)' : 'Subscribed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
