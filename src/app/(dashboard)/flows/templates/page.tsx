'use client';

import React from 'react';
import Link from 'next/link';
import { GitFork, Sparkles, ArrowRight, ShieldCheck, ShoppingBag, GraduationCap, Home, Gift, Headphones } from 'lucide-react';

interface NicheTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  trigger: string;
  stepsCount: number;
  safetyScore: number;
  tags: string[];
}

const TEMPLATES: NicheTemplate[] = [
  {
    id: 'tpl_coaches',
    title: 'Coach & Course Creator Lead Magnet',
    category: 'Coaching & Education',
    description: 'Trigger on "GUIDE" comment on Reels. Sends free PDF link, captures validated email, and logs lead score.',
    icon: GraduationCap,
    trigger: 'Comment contains "GUIDE"',
    stepsCount: 4,
    safetyScore: 100,
    tags: ['Comment-to-DM', 'Email Capture', '5 Paraphrases'],
  },
  {
    id: 'tpl_ecom',
    title: 'E-Commerce VIP Flash Discount',
    category: 'E-Commerce & Retail',
    description: 'Trigger on "VIP" in comments or DMs. Delivers exclusive coupon code and tracks click-through revenue attribution.',
    icon: ShoppingBag,
    trigger: 'Comment or DM contains "VIP"',
    stepsCount: 3,
    safetyScore: 98,
    tags: ['Discount Delivery', 'Revenue Attribution'],
  },
  {
    id: 'tpl_realestate',
    title: 'Real Estate Property Tour Qualification',
    category: 'Real Estate',
    description: 'Trigger on property listing post. Collects buyer budget, preferred move-in timeline, and schedules agent callback.',
    icon: Home,
    trigger: 'Comment on Listing Post',
    stepsCount: 5,
    safetyScore: 98,
    tags: ['Lead Qualification', 'Human Handoff'],
  },
  {
    id: 'tpl_creator',
    title: 'Creator Giveaway & Contest Entry',
    category: 'Creators & Influencers',
    description: 'Trigger on Story mentions or giveaway comments. Automatically verifies follower and sends confirmation entry ticket.',
    icon: Gift,
    trigger: 'Story Mention / Reel Comment',
    stepsCount: 3,
    safetyScore: 96,
    tags: ['Story Mention', 'Spike Protected'],
  },
  {
    id: 'tpl_support',
    title: 'Safe Customer Support & FAQ Assistant',
    category: 'Customer Support',
    description: 'Answers pricing, shipping, and order status questions. Automatically routes to live human inbox if user says "HUMAN".',
    icon: Headphones,
    trigger: 'Any Inbound Direct Message',
    stepsCount: 4,
    safetyScore: 100,
    tags: ['Brand Voice AI', 'One-Click Takeover'],
  },
];

export default function FlowTemplatesPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Niche Agent Templates
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              100% Meta Compliant
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pre-built, battle-tested multi-step DM flows for Coaches, E-Commerce, Real Estate, and Creators.
          </p>
        </div>

        <Link
          href="/flows"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-subtle"
        >
          <span>View Custom Flows</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {tpl.category}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">{tpl.title}</h2>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Trigger: {tpl.trigger}</div>
                  <div className="text-slate-500">{tpl.stepsCount} conversational steps • 5 paraphrases active</div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/flows/builder?template=${tpl.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Use This Template</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
