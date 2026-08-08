'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Play,
  Sparkles,
  ShieldCheck,
  Plus,
  MessageSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  Link2,
} from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';

interface VisualNode {
  id: string;
  type: 'TRIGGER' | 'MESSAGE' | 'CONDITION' | 'LEAD_CAPTURE' | 'DELAY';
  title: string;
  description: string;
  config: Record<string, any>;
}

export default function FlowCanvasPage() {
  const [nodes, setNodes] = useState<VisualNode[]>([
    {
      id: 'node_1',
      type: 'TRIGGER',
      title: '1. Inbound Trigger: Comment on Reel',
      description: 'Listens for comments containing keywords: "GUIDE", "VIP", "ACCESS"',
      config: { keywords: ['GUIDE', 'VIP', 'ACCESS'], publicReply: 'Check your DM! 📩' },
    },
    {
      id: 'node_2',
      type: 'CONDITION',
      title: '2. Compliance Gate: 24h Window & Opt-Out',
      description: 'Checks contact.optOutStatus == false AND windowExpiresAt > now',
      config: { autoDropIfExpired: true },
    },
    {
      id: 'node_3',
      type: 'MESSAGE',
      title: '3. Outbound DM (5 Paraphrases + Media Image Attachment)',
      description: 'Delivers text copy + picture attachment directly to user DM.',
      config: {
        variationsActive: 5,
        disclosureMandatory: true,
        text: 'Saw your comment and wanted to send the full details right over!',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    },
    {
      id: 'node_4',
      type: 'DELAY',
      title: '4. Safe Cooldown & Anti-Spam Pacing',
      description: 'Enforces 8-second minimum interval + randomized jitter before next step.',
      config: { delaySeconds: 8, jitterEnabled: true },
    },
    {
      id: 'node_5',
      type: 'LEAD_CAPTURE',
      title: '5. Lead Capture: Validated Email Request',
      description: 'Prompts user for email with regex validation before delivering PDF.',
      config: { fieldType: 'EMAIL', validationRegex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
    },
  ]);

  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/flows"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-subtle"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Reel Comment to VIP Guide Delivery
              </h1>
              <SafetyScoreBadge score={100} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual low-code canvas with 24h messaging window lock & media image attachment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle"
          >
            {isSaved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
            <span>{isSaved ? 'Flow Published & Safe!' : 'Publish Live Flow'}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Nodes Flow Stack */}
      <div className="space-y-4 max-w-3xl mx-auto py-2">
        {nodes.map((node, index) => {
          let badgeColor = 'bg-slate-100 text-slate-700';
          let borderAccent = 'border-slate-200';

          if (node.type === 'TRIGGER') {
            badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
            borderAccent = 'border-purple-200';
          } else if (node.type === 'CONDITION') {
            badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            borderAccent = 'border-emerald-200';
          } else if (node.type === 'MESSAGE') {
            badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
            borderAccent = 'border-blue-200';
          } else if (node.type === 'DELAY') {
            badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
            borderAccent = 'border-amber-200';
          } else if (node.type === 'LEAD_CAPTURE') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
            borderAccent = 'border-rose-200';
          }

          return (
            <div key={node.id} className="relative">
              {/* Connector line */}
              {index > 0 && (
                <div className="w-0.5 h-4 bg-slate-200 mx-auto -mt-2 mb-2" />
              )}

              <div
                className={`rounded-2xl border ${borderAccent} bg-white p-5 shadow-subtle hover:shadow-card-hover transition-all space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                    {node.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Safe Guarded</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">{node.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{node.description}</p>
                </div>

                {/* Editable Picture Attachment Field for Node 3 */}
                {node.type === 'MESSAGE' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        <span>Media Picture Attachment URL</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Meta Graph API Payload</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL (https://...)"
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {imageUrl && (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt="VIP Guide Attachment"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Node Details / Badges */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                  {node.type === 'MESSAGE' && (
                    <>
                      <span className="font-medium text-emerald-700">✅ 5 Paraphrases + Image Payload Active</span>
                      <span className="text-slate-400 font-mono">100% Unique copy per send</span>
                    </>
                  )}
                  {node.type === 'DELAY' && (
                    <>
                      <span className="font-medium text-amber-700">⏱ 8s Cooldown + Jitter</span>
                      <span className="text-slate-400">Meta anti-burst protection</span>
                    </>
                  )}
                  {node.type === 'TRIGGER' && (
                    <>
                      <span className="font-mono text-purple-700 font-semibold">Keywords: GUIDE, VIP, ACCESS</span>
                      <span className="text-slate-400">Public reply: "Check your DM! 📩"</span>
                    </>
                  )}
                  {node.type === 'CONDITION' && (
                    <>
                      <span className="font-medium text-emerald-700">🔒 24-Hr Window Hard Lock</span>
                      <span className="text-slate-400">Drops expired non-human DMs</span>
                    </>
                  )}
                  {node.type === 'LEAD_CAPTURE' && (
                    <>
                      <span className="font-medium text-rose-700">📧 Email Regex Validation</span>
                      <span className="text-slate-400">CRM Lead Sync Ready</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
