'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Send,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import { SafetyScoreBadge } from '@/components/safety/SafetyScoreBadge';

interface ConversationItem {
  id: string;
  username: string;
  name: string;
  lastSnippet: string;
  hoursRemaining: number;
  isHumanHandoff: boolean;
  optOutStatus: boolean;
  aiSummary: string;
  messages: Array<{
    sender: 'user' | 'bot' | 'human_agent';
    text: string;
    time: string;
    isDisclosure?: boolean;
    tag?: string;
  }>;
}

export default function LiveSharedInboxPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'conv_1',
      username: 'sarah_creator',
      name: 'Sarah Jenkins',
      lastSnippet: 'I need to talk to a human about high-ticket coaching.',
      hoursRemaining: 23.4,
      isHumanHandoff: true,
      optOutStatus: false,
      aiSummary: 'High-intent lead. Inquired about VIP 1-on-1 coaching package ($3,500). Requested human consultation.',
      messages: [
        {
          sender: 'user',
          text: 'Saw your Reel about scaling to 10k/mo! Can you send more info?',
          time: '10:14 AM',
        },
        {
          sender: 'bot',
          text: '[Automated Assistant for Klyvexa • Type HUMAN anytime for live support]\n\nHey Sarah! Thanks for reaching out on our recent post! As promised, here is the information: https://klyvexa.com/vip',
          time: '10:14 AM',
          isDisclosure: true,
        },
        {
          sender: 'user',
          text: 'I want to speak with a HUMAN about the high-ticket tier.',
          time: '10:18 AM',
        },
        {
          sender: 'bot',
          text: 'Connecting you with a team member. Automated responses are now paused for this chat.',
          time: '10:18 AM',
        },
      ],
    },
    {
      id: 'conv_2',
      username: 'mark_ecommerce',
      name: 'Mark Davis',
      lastSnippet: 'Where can I get the 20% discount code?',
      hoursRemaining: 18.2,
      isHumanHandoff: false,
      optOutStatus: false,
      aiSummary: 'Customer seeking flash discount coupon. Standard flow completed successfully.',
      messages: [
        {
          sender: 'user',
          text: 'VIP discount please!',
          time: 'Yesterday',
        },
        {
          sender: 'bot',
          text: '[Automated Assistant for Klyvexa • Type HUMAN anytime for live support]\n\nHey Mark! You got it! Here is the exclusive 20% VIP code: FLASH20',
          time: 'Yesterday',
          isDisclosure: true,
        },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState('conv_1');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSend = () => {
    if (!inputText.trim()) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                sender: 'human_agent',
                text: inputText.trim(),
                time: 'Just now',
                tag: 'HUMAN_AGENT (Meta 7-Day Window Tag)',
              },
            ],
          };
        }
        return c;
      })
    );

    setInputText('');
  };

  const toggleTakeover = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isHumanHandoff: !c.isHumanHandoff } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Shared Inbox & Human Handoff
            </h1>
            <SafetyScoreBadge score={98} size="md" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time conversations with AI summaries, 24-hour window locks, and official Meta <code>HUMAN_AGENT</code> tag takeover.
          </p>
        </div>
      </div>

      {/* Inbox Split View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-subtle min-h-[600px]">
        {/* Left: Conversations List */}
        <div className="border-r border-slate-200 divide-y divide-slate-100 flex flex-col">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Threads</span>
            <span className="text-[11px] font-semibold text-slate-500">{conversations.length} conversations</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 ${
                  selectedId === conv.id ? 'bg-slate-100/70 border-l-4 border-l-slate-900' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">@{conv.username}</span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {conv.hoursRemaining}h left
                  </span>
                </div>

                <p className="text-xs text-slate-600 truncate">{conv.lastSnippet}</p>

                <div className="flex items-center gap-2 mt-1">
                  {conv.isHumanHandoff && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      <UserCheck className="h-3 w-3" /> Human Takeover Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle & Right: Active Thread + AI Summary & Human Takeover Bar */}
        <div className="col-span-2 flex flex-col justify-between p-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">@{activeConv.username}</h2>
                <span className="text-xs text-slate-400 font-normal">({activeConv.name})</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Clock className="h-3.5 w-3.5" /> 24-Hr Window: {activeConv.hoursRemaining} Hours Remaining
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleTakeover(activeConv.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors border shadow-subtle ${
                activeConv.isHumanHandoff
                  ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>{activeConv.isHumanHandoff ? 'Release Human Takeover' : 'Take Over Chat (Human Agent Tag)'}</span>
            </button>
          </div>

          {/* AI Intelligence Summary Card */}
          <div className="my-4 rounded-xl bg-purple-50/60 p-4 border border-purple-100 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-purple-900 block">AI Conversation Summary & Intent:</span>
              <p className="text-xs text-purple-800/90 mt-0.5 leading-relaxed">{activeConv.aiSummary}</p>
            </div>
          </div>

          {/* Message Bubbles Thread */}
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-2 my-2">
            {activeConv.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-100 text-slate-900 rounded-bl-none'
                      : msg.sender === 'human_agent'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-gradient-to-tr from-purple-50 to-blue-50 text-slate-900 border border-purple-100 rounded-br-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.tag && (
                    <div className="mt-2 pt-1 border-t border-white/20 text-[10px] text-amber-300 font-mono">
                      🏷️ {msg.tag}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[10px] text-slate-400">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="border-t border-slate-100 pt-4 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                activeConv.isHumanHandoff
                  ? 'Type your message as Human Agent (Official Meta Tag attached)...'
                  : 'Take over chat to reply directly to this customer...'
              }
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-subtle"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send DM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
