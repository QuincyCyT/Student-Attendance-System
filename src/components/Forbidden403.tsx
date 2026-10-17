import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { PantherLogo } from './PantherLogo';

interface Forbidden403Props {
  attemptedRole?: string;
  onReturn?: () => void;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({ attemptedRole, onReturn }) => {
  const { currentUser, logout } = useApp();

  const currentRoleLabel =
    currentUser?.role === 'super_admin'
      ? 'Super Admin'
      : currentUser?.role === 'registrar'
      ? 'Registrar'
      : 'Instructor';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in duration-200">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            HTTP 403 · Access Denied
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#27182C]">
            Restricted System Area
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You do not have the required permissions to access the{' '}
            <span className="font-bold text-[#5B3765]">
              {attemptedRole ? `${attemptedRole} Portal` : 'requested page'}
            </span>
            .
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-left space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Signed In As:</span>
            <span className="font-bold text-[#27182C]">{currentUser?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Role:</span>
            <span className="font-bold text-[#5B3765] capitalize">{currentRoleLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Access Policy:</span>
            <span className="font-mono text-[11px] text-rose-700 font-semibold">ROLE_AUTHORIZATION_REQUIRED</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={onReturn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#5B3765] hover:bg-[#43234D] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Authorized Dashboard</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};
