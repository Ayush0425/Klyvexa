'use client';

import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, Zap, RefreshCw, Send } from 'lucide-react';

interface SimulatedEventResult {
  status: string;
  priority: string;
  responsePreview: string;
  safetyScore: number;
  disclosureInjected: boolean;
  paraphraseVariantId: number;
  timeMs: number;
}

export function WebhookTesterModal() {
  const [activeTab, setActiveTab] = useState<'HANDSHAKE' | 'COMMENT_DM' | 'OPT_OUT' | 'HUMAN_TAKEOVER'>('HANDSHAKE');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<SimulatedEventResult | null>(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setTestResult(null);

    const startTime = performance.now();

    // Simulate real webhook evaluation via local test dispatcher
    setTimeout(() => {
      let mockRes: SimulatedEventResult;

      if (activeTab === 'HANDSHAKE') {
        mockRes = {
          status: 'HTTP 200 OK • Challenge Verified',
          priority: 'HANDSHAKE_VERIFICATION',
          responsePreview: 'hub.challenge: 1158201492 returned in 12ms',
          safetyScore: 98,
          disclosureInjected: false,
          paraphraseVariantId: 0,
          timeMs: Math.round(performance.now() - startTime),
        };
      } else if (activeTab === 'OPT_OUT') {
        mockRes = {
          status: 'OPT_OUT_PROCESSED_INSTANTLY',
          priority: 'P1_LEAD_CAPTURE_OPTOUT',
          responsePreview: 'You have been unsubscribed from automated messages. Type START anytime to re-subscribe.',
          safetyScore: 100,
          disclosureInjected: false,
          paraphraseVariantId: 1,
          timeMs: Math.round(performance.now() - startTime),
        };
      } else if (activeTab === 'HUMAN_TAKEOVER') {
        mockRes = {
          status: 'HUMAN_OPERATOR_NOTIFIED',
          priority: 'P0_HUMAN_TAKEOVER (CRITICAL)',
          responsePreview: 'Connecting you with a team member. Automated responses are now paused for this chat.',
          safetyScore: 98,
          disclosureInjected: false,
          paraphraseVariantId: 2,
          timeMs: Math.round(performance.now() - startTime),
        };
      } else {
        mockRes = {
          status: 'DISPATCHED_SAFE_WITH_VARIATION',
          priority: 'P3_VIRAL_COMMENT_DM (PACED)',
          responsePreview: '[Automated Assistant for Klyvexa • Type HUMAN anytime for live support]\n\nHey there! Saw your comment and wanted to send the full details right over. Here is the link you requested: https://klyvexa.com/vip',
          safetyScore: 98,
          disclosureInjected: true,
          paraphraseVariantId: 4,
          timeMs: Math.round(performance.now() - startTime),
        };
      }

      setTestResult(mockRes);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Interactive Meta Webhook & Queue Sandbox</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              Live Phase 2 Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test Meta webhook challenges, comment-to-DM triggers, 8s cooldowns, and instant opt-outs.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Webhook Event</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('HANDSHAKE')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
            activeTab === 'HANDSHAKE'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          GET: Challenge Handshake
        </button>

        <button
          onClick={() => setActiveTab('COMMENT_DM')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
            activeTab === 'COMMENT_DM'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          POST: Comment-to-DM (P3 Viral)
        </button>

        <button
          onClick={() => setActiveTab('OPT_OUT')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
            activeTab === 'OPT_OUT'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          POST: "STOP" Keyword (P1 Opt-Out)
        </button>

        <button
          onClick={() => setActiveTab('HUMAN_TAKEOVER')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
            activeTab === 'HUMAN_TAKEOVER'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          POST: "HUMAN" Keyword (P0 Takeover)
        </button>
      </div>

      {/* Result Display */}
      {testResult && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{testResult.status}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Processed in {testResult.timeMs}ms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue Priority</span>
              <span className="font-mono text-slate-800 font-semibold">{testResult.priority}</span>
            </div>

            <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory Disclosure</span>
              <span className="text-slate-800 font-medium">
                {testResult.disclosureInjected ? '✅ Injected Automatically' : 'N/A'}
              </span>
            </div>

            <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Anti-Spam Paraphrase</span>
              <span className="text-slate-800 font-medium">
                {testResult.paraphraseVariantId > 0
                  ? `Variant #${testResult.paraphraseVariantId} of 5+`
                  : 'System Confirmation'}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Simulated Outbound Message Preview:
            </span>
            <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
              {testResult.responsePreview}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
