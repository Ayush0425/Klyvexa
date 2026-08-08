'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GitFork, Plus, Sparkles, Play, Pause, MoreVertical, ShieldCheck, ArrowRight } from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';

interface FlowItem {
  id: string;
  name: string;
  triggerType: string;
  keywords: string[];
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  executionsCount: number;
  safetyScore: number;
  updatedAt: string;
}

export default function FlowsOverviewPage() {
  const [flows, setFlows] = useState<FlowItem[]>([
    {
      id: 'flow_1',
      name: 'Reel Comment to VIP Guide Delivery',
      triggerType: 'Comment-to-DM',
      keywords: ['GUIDE', 'ACCESS', 'INFO'],
      status: 'ACTIVE',
      executionsCount: 142,
      safetyScore: 98,
      updatedAt: '10 mins ago',
    },
    {
      id: 'flow_2',
      name: 'Story Mention Auto-Reward & Coupon',
      triggerType: 'Story Mention',
      keywords: ['@mention'],
      status: 'ACTIVE',
      executionsCount: 68,
      safetyScore: 100,
      updatedAt: '1 hour ago',
    },
    {
      id: 'flow_3',
      name: 'Inbound DM Lead Qualification & Booking',
      triggerType: 'Inbound DM Keyword',
      keywords: ['PRICING', 'DEMO', 'BOOK'],
      status: 'DRAFT',
      executionsCount: 0,
      safetyScore: 98,
      updatedAt: 'Yesterday',
    },
  ]);

  const toggleFlow = (id: string) => {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Automation Flow Builder
            </h1>
            <SafetyScoreBadge score={98} size="md" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Multi-step visual DM automations with 24-hour window compliance, 5+ copy variations, and automatic keyword opt-outs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/flows/templates"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-subtle"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Browse Templates</span>
          </Link>

          <Link
            href="/flows/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Flow</span>
          </Link>
        </div>
      </div>

      {/* Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    flow.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : flow.status === 'PAUSED'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {flow.status}
                </span>

                <SafetyScoreBadge score={flow.safetyScore} size="sm" showLabel={false} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{flow.name}</h2>
                <p className="mt-1 text-xs text-slate-500">Trigger: {flow.triggerType}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {flow.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Total Executions:</span>
                <span className="font-bold text-slate-900">{flow.executionsCount} sent</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/flows/${flow.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>Edit Canvas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => toggleFlow(flow.id)}
                className={`rounded-lg p-2 text-xs border ${
                  flow.status === 'ACTIVE'
                    ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
                title={flow.status === 'ACTIVE' ? 'Pause Flow' : 'Activate Flow'}
              >
                {flow.status === 'ACTIVE' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
