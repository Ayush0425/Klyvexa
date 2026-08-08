'use client';

import React, { useState, useEffect } from 'react';
import { Instagram, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { getMetaOAuthUrl } from '@/lib/meta/oauth';

interface MetaConnectButtonProps {
  className?: string;
  size?: 'default' | 'lg';
}

export function MetaConnectButton({ className = '', size = 'default' }: MetaConnectButtonProps) {
  const [currentOrigin, setCurrentOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const handleConnect = () => {
    const state = Math.random().toString(36).substring(7);
    
    // Always use the current browser origin for redirect_uri
    const redirectUri = `${window.location.origin}/api/auth/meta/callback`;
    const url = getMetaOAuthUrl(state, redirectUri);
    
    window.location.href = url;
  };

  const handleSandboxConnect = () => {
    // 1-Click Sandbox Connect for instant local testing
    window.location.href = '/accounts?connected=1&success=true&sandbox=true';
  };

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleConnect}
          className={`group relative inline-flex items-center justify-center gap-2.5 rounded-xl font-medium text-white transition-all shadow-subtle hover:shadow-card-hover ${
            size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2.5 text-xs'
          } bg-slate-900 hover:bg-slate-800`}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white">
            <Instagram className="h-3.5 w-3.5" />
          </div>
          <span>Connect Instagram Professional</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 text-slate-400" />
        </button>

        <button
          onClick={handleSandboxConnect}
          className="inline-flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50/70 px-3 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors shadow-subtle"
          title="Instant 1-Click Sandbox Account for Local Testing"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Quick Sandbox Demo</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span>Graph API v20.0 (AES-256 Vault)</span>
        </div>
        {currentOrigin && (
          <span className="font-mono text-slate-400">
            URI: {currentOrigin.replace(/^https?:\/\//, '')}/...
          </span>
        )}
      </div>
    </div>
  );
}
