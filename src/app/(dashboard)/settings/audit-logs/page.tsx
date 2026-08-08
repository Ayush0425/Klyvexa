'use client';

import React from 'react';
import { FileText, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface MockAuditEntry {
  id: string;
  timestamp: string;
  eventType: string;
  priority: string;
  targetIgsid: string;
  payloadHash: string;
  status: string;
}

const MOCK_LOGS: MockAuditEntry[] = [
  {
    id: 'audit_01',
    timestamp: 'Just now',
    eventType: 'POST_COMMENT',
    priority: 'P3_VIRAL_COMMENT_DM',
    targetIgsid: '178414053092819',
    payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'DISPATCHED_SAFE (Variant #3)',
  },
  {
    id: 'audit_02',
    timestamp: '2 mins ago',
    eventType: 'INBOUND_DM_STOP',
    priority: 'P1_LEAD_CAPTURE_OPTOUT',
    targetIgsid: '178414099238120',
    payloadHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'OPT_OUT_PROCESSED',
  },
  {
    id: 'audit_03',
    timestamp: '5 mins ago',
    eventType: 'MANDATORY_DISCLOSURE',
    priority: 'P2_STANDARD_FLOW',
    targetIgsid: '178414011289381',
    payloadHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    status: 'DISCLOSURE_INJECTED',
  },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Compliance Audit Logs
          </h1>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Immutable SHA-256 Hashes
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Cryptographic proof of Meta policy adherence, 24-hour window checks, and mandatory disclosures without storing plain customer PII indefinitely.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Audit Trail & Cryptographic Log</span>
          </div>
          <span className="text-xs text-slate-500">Zero log leakage guaranteed</span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {MOCK_LOGS.map((log) => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.eventType}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">
                    {log.priority}
                  </span>
                  <span className="text-emerald-700 font-medium">{log.status}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>IGSID: {log.targetIgsid}</span>
                  <span>•</span>
                  <span>SHA-256: {log.payloadHash.substring(0, 24)}...</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
