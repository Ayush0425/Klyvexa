'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, Upload, Play } from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';

export default function AiBrandVoicePage() {
  const [persona, setPersona] = useState(
    'You are the friendly, helpful AI brand assistant for Klyvexa. Always transparently disclose automation. Speak with high energy, concise answers, and provide direct helpful links without pressure.'
  );
  const [toneGuide, setToneGuide] = useState(
    'Warm, authentic, premium, knowledgeable, concise. Never use aggressive sales tactics or generic template spam.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Brand Voice AI Studio & RAG
            </h1>
            <SafetyScoreBadge score={100} size="sm" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Train your AI reply engine on your unique tone of voice, FAQ documents, and persona guidelines.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle"
        >
          {saved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Sparkles className="h-4 w-4" />}
          <span>{saved ? 'Voice Guidelines Saved!' : 'Save Brand Persona'}</span>
        </button>
      </div>

      {/* Brand Voice Editor Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Assistant Persona & System Prompt
          </label>
          <textarea
            rows={3}
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Tone & Style Rules (Anti-Spam Guardrails)
          </label>
          <textarea
            rows={2}
            value={toneGuide}
            onChange={(e) => setToneGuide(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Knowledge Base Uploads for RAG */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Knowledge Base Documents (RAG)</h2>
            <p className="text-xs text-slate-500">Upload PDFs, FAQs, or pricing guides for contextual answers.</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-subtle">
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">2026_Pricing_and_Packages.pdf</h3>
                <span className="text-[10px] text-slate-400">Indexed 14 chunks • pgvector</span>
              </div>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Active</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Brand_FAQ_and_Policies.pdf</h3>
                <span className="text-[10px] text-slate-400">Indexed 22 chunks • pgvector</span>
              </div>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
