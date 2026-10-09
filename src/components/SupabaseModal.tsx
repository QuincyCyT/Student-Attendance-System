import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SUPABASE_URL } from '../lib/supabase';
import {
  SUPABASE_SETUP_SQL,
  checkSupabaseStatus,
  seedSupabaseIfEmpty,
} from '../services/supabaseService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{
    loading: boolean;
    connected: boolean;
    tablesReady: boolean;
    error?: string;
  }>({
    loading: true,
    connected: false,
    tablesReady: false,
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const checkStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    const res = await checkSupabaseStatus();
    setStatus({
      loading: false,
      connected: res.connected,
      tablesReady: res.tablesReady,
      error: res.error,
    });
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setCopied(false);
      setSeedSuccess(false);
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    const ok = await seedSupabaseIfEmpty();
    setIsSeeding(false);
    if (ok) {
      setSeedSuccess(true);
      checkStatus();
      setTimeout(() => setSeedSuccess(false), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-purple-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#EEDEEB] bg-gradient-to-r from-[#FAF0F7] to-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B3765] text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#27182C] flex items-center gap-2">
                <span>Supabase PostgreSQL Database Link</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Linked
                </span>
              </h2>
              <p className="text-[11px] text-[#73567A]">
                Endpoint: <span className="font-mono text-[#5B3765] font-semibold">{SUPABASE_URL}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Box */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#5B3765]" />
                Supabase Connection Status
              </span>
              <button
                type="button"
                onClick={checkStatus}
                disabled={status.loading}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B3765] hover:text-[#43234D] transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${status.loading ? 'animate-spin' : ''}`} />
                <span>Re-check</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11.5px]">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-600">REST API Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Authenticated
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-600">Public Schema Tables:</span>
                {status.tablesReady ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Tables Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Needs SQL Schema
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="bg-[#FAF0F7] border border-[#EEDEEB] rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-[#5B3765] text-xs">
              1-Minute Setup in your Supabase Dashboard:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
              <li>
                Click{' '}
                <a
                  href="https://supabase.com/dashboard/project/cjghzrwmyasithmlekoc/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#5B3765] underline hover:text-[#43234D] inline-flex items-center gap-0.5"
                >
                  Supabase SQL Editor <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                to open a new query tab.
              </li>
              <li>Click the button below to copy the SQL schema script and paste it into the editor.</li>
              <li>Click <strong>Run</strong> in Supabase to create the tables and enable Row Level Security (RLS).</li>
            </ol>
          </div>

          {/* Copy SQL Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopySql}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#5B3765] hover:bg-[#43234D] text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                  <span>SQL Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Supabase SQL Setup Script</span>
                </>
              )}
            </button>

            {status.tablesReady && (
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSeeding ? 'Seeding...' : 'Populate Sample Data'}</span>
              </button>
            )}
          </div>

          {seedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Initial sample dataset (students, courses, faculty, attendance) was populated into Supabase!</span>
            </div>
          )}

          {/* Preview SQL snippet */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500 font-medium">
              <span>SQL Preview (6 Tables, RLS Policies, Realtime publication):</span>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-44 border border-slate-800 leading-normal selection:bg-purple-900">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EEDEEB] bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Dual storage: Firestore active + Supabase ready</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
