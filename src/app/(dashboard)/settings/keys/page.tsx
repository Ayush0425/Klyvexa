'use client';

import React, { useState } from 'react';
import { Key, Shield, Copy, Check, ExternalLink, Lock, HelpCircle } from 'lucide-react';

interface KeyGuideItem {
  keyName: string;
  category: 'Meta Official' | 'Security & Encryption' | 'Database & Storage' | 'AI Brand Voice';
  description: string;
  howToGet: string;
  example: string;
  isSecret: boolean;
}

const REQUIRED_KEYS: KeyGuideItem[] = [
  {
    keyName: 'META_APP_ID',
    category: 'Meta Official',
    description: 'The unique App ID of your Meta App configured for Instagram Graph API.',
    howToGet: 'Go to developers.facebook.com > My Apps > Create App > Select "Business" type > Copy App ID.',
    example: '184920491823901',
    isSecret: false,
  },
  {
    keyName: 'META_APP_SECRET',
    category: 'Meta Official',
    description: 'The secret key for your Meta App used to verify webhooks and exchange OAuth tokens.',
    howToGet: 'In developers.facebook.com > App Settings > Basic > App Secret (Click "Show").',
    example: '9f830a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    isSecret: true,
  },
  {
    keyName: 'META_WEBHOOK_VERIFY_TOKEN',
    category: 'Meta Official',
    description: 'A custom secret string you define to verify webhook handshake requests from Meta.',
    howToGet: 'Generate any random string (e.g. "klyvexa_secret_token_secure_2026") and paste the exact same string in Meta Webhook configuration.',
    example: 'klyvexa_secret_token_secure_2026',
    isSecret: true,
  },
  {
    keyName: 'TOKEN_VAULT_MASTER_SECRET',
    category: 'Security & Encryption',
    description: '32-character master cryptographic secret used by Klyvexa AES-256-GCM Token Vault to encrypt all Page Access Tokens at rest.',
    howToGet: 'Generate a secure 32+ character random string or use the one generated below.',
    example: 'v8N!k9#mP2$xL5@qW7*zR1&yT4^bC6+e',
    isSecret: true,
  },
  {
    keyName: 'NEXTAUTH_SECRET',
    category: 'Security & Encryption',
    description: 'Used by NextAuth.js to encrypt session JWT tokens and state cookies.',
    howToGet: 'Generate any 32-character secret string.',
    example: 'klyvexa_super_secret_jwt_session_token_32c',
    isSecret: true,
  },
  {
    keyName: 'DATABASE_URL',
    category: 'Database & Storage',
    description: 'PostgreSQL connection URL (Supports Supabase, Neon, AWS RDS, or local Postgres).',
    howToGet: 'Copy from your Supabase / Neon / Postgres database settings.',
    example: 'postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require',
    isSecret: true,
  },
  {
    keyName: 'REDIS_URL',
    category: 'Database & Storage',
    description: 'Redis connection string for BullMQ priority queues and rate limiting (Upstash or Redis Cloud).',
    howToGet: 'Create a free database on Upstash.com or Redis Cloud and copy the connection URL.',
    example: 'rediss://default:token@sparkling-redis.upstash.io:6379',
    isSecret: true,
  },
  {
    keyName: 'GEMINI_API_KEY',
    category: 'AI Brand Voice',
    description: 'Google Gemini API key for Brand Voice synthesis, context-aware RAG, and live inbox summarization.',
    howToGet: 'Get a free key from aistudio.google.com > "Get API key".',
    example: 'AIzaSyD-YourGeminiApiKeyHere',
    isSecret: true,
  },
];

export default function ApiKeysSettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Klyvexa API Keys & Resources
          </h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            Phase 1 Setup Guide
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Paste these credentials into your <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">.env.local</code> file to connect your official Meta App and run Klyvexa.
        </p>
      </div>

      {/* Meta App Setup Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Meta Developer Portal Configuration (Official API)</span>
          </div>
          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            Open Meta Developer Portal <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">1. Create Business App</span>
            Select <strong>Business</strong> as App Type. Add products: <strong>Instagram Graph API</strong> and <strong>Facebook Login for Business</strong>.
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">2. Add OAuth Redirect URI</span>
            In Facebook Login Settings, add: <code className="font-mono text-[10px] block mt-1 text-slate-800 bg-white p-1 rounded border">http://localhost:3000/api/auth/meta/callback</code>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">3. Configure Webhooks</span>
            Set Callback URL to <code className="font-mono text-[10px] text-slate-800">/api/webhooks/meta</code> and subscribe to <code className="font-mono text-[10px] text-slate-800">messages, messaging_postbacks, feed</code>.
          </div>
        </div>
      </div>

      {/* Required Environment Variables Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Environment Variables Breakdown</h2>
          <span className="text-xs text-slate-500">8 required keys</span>
        </div>

        <div className="divide-y divide-slate-100">
          {REQUIRED_KEYS.map((item) => (
            <div key={item.keyName} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.keyName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {item.category}
                  </span>
                  {item.isSecret && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <Lock className="h-2.5 w-2.5" /> Secret
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{item.description}</p>
                <div className="flex items-start gap-1 text-[11px] text-slate-400">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <span>{item.howToGet}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(item.example, item.keyName)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-subtle"
                >
                  {copiedKey === item.keyName ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied Example</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
