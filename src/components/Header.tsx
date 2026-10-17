import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogOut,
  RotateCcw,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Building2,
} from 'lucide-react';

import { PantherLogo } from './PantherLogo';

export const Header: React.FC = () => {
  const { currentUser, logout, resetToSampleData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const roleLabel =
    currentUser.role === 'super_admin'
      ? 'Super Admin'
      : currentUser.role === 'registrar'
      ? 'Registrar'
      : 'Instructor';

  const roleIcon =
    currentUser.role === 'super_admin' ? (
      <ShieldCheck className="w-3 h-3 text-amber-600" />
    ) : currentUser.role === 'registrar' ? (
      <Building2 className="w-3 h-3 text-purple-600" />
    ) : (
      <UserCheck className="w-3 h-3 text-[#5B3765]" />
    );

  const roleBadgeStyle =
    currentUser.role === 'super_admin'
      ? 'bg-amber-50 text-amber-900 border-amber-200'
      : currentUser.role === 'registrar'
      ? 'bg-purple-50 text-purple-900 border-purple-200'
      : 'bg-[#FAF0F7] text-[#5B3765] border-[#EEDEEB]';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#EEDEEB] sticky top-0 z-30 shadow-xs shadow-purple-950/5">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Brand matching image.png */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <PantherLogo size="sm" showBorder={false} />
            <div className="truncate">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base font-medium tracking-tight text-slate-900 leading-tight truncate">
                  <span className="font-extrabold text-[#5B3765]">PantherCheck</span>{' '}
                  <span className="text-[#27182C] font-semibold hidden xs:inline">Attendance Portal</span>
                </h1>
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#86688D] font-normal leading-none mt-0.5 hidden md:block">
                Smart Attendance & Classroom Governance
              </p>
            </div>
          </div>

          {/* Center: Semester Pill & Global Search */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 flex-1 max-w-xl mx-2 lg:mx-4">
            {/* Semester Pill */}
            <div className="shrink-0 px-2.5 py-1 rounded-full bg-[#FAF0F7] border border-[#EEDEEB] text-[10.5px] lg:text-[11px] font-bold text-[#5B3765] tracking-wide uppercase">
              First Sem 2026
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#86688D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search student, ID or course..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF4F8] border border-[#EEDEEB] text-[#27182C] placeholder-[#9D7D9F] focus:outline-none focus:border-[#5B3765] focus:bg-white focus:ring-2 focus:ring-[#5B3765]/15 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Role Authenticated Pill (Read-Only) */}
            <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${roleBadgeStyle}`}>
              {roleIcon}
              <span>{roleLabel}</span>
            </div>

            {/* Reset Data (Desktop / Tablet) */}
            <button
              id="btn-reset-demo"
              type="button"
              onClick={() => resetToSampleData()}
              className="p-1.5 text-[#86688D] hover:text-[#5B3765] hover:bg-[#FAF0F7] rounded-xl transition-colors hidden sm:block"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell */}
            <div className="p-1.5 text-[#86688D] hover:text-[#5B3765] hover:bg-[#FAF0F7] rounded-xl transition-colors relative cursor-pointer hidden md:block">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#5B3765] rounded-full" />
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2.5 border-l border-[#EEDEEB]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF0F7] border border-[#5B3765]/20 flex items-center justify-center text-[#5B3765] font-bold text-[11px] sm:text-xs shadow-xs shrink-0">
                {currentUser.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden sm:block text-left max-w-[130px] truncate">
                <div className="text-xs font-bold text-[#27182C] leading-tight truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-[#86688D] font-medium capitalize">
                  {roleLabel}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="btn-logout-header"
              type="button"
              onClick={logout}
              className="p-1.5 text-[#86688D] hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#5B3765] hover:bg-[#FAF0F7] rounded-xl transition-colors lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Submenu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EEDEEB] bg-white px-4 py-3 space-y-3 shadow-md animate-in slide-in-from-top-2">
          {/* User info on mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-[#FAF0F7]">
            <div className="text-left">
              <div className="text-xs font-bold text-[#27182C]">{currentUser.fullName}</div>
              <div className="text-[10px] text-[#86688D] font-medium flex items-center gap-1 mt-0.5">
                {roleIcon}
                <span>Role: {roleLabel}</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FAF0F7] text-[#5B3765] border border-[#EEDEEB]">
              Sem 1 · 2026
            </span>
          </div>

          {/* Reset Sample Data on mobile */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                resetToSampleData();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-[#73567A] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
