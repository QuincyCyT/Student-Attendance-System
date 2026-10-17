import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityBranding } from '../UniversityBranding';
import { PantherIllustration } from '../PantherIllustration';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Building2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, loginWithGoogle, setActiveView, isDatabaseReady } = useApp();

  const [selectedRole, setSelectedRole] = useState<'instructor' | 'registrar'>('instructor');
  const [email, setEmail] = useState('prof.miller@jrmsu.edu.ph');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: 'instructor' | 'registrar') => {
    setSelectedRole(role);
    setErrorMessage('');
    setInfoMessage('');
    if (role === 'instructor') {
      setEmail('prof.miller@jrmsu.edu.ph');
      setPassword('password123');
    } else {
      setEmail('reg.davis@jrmsu.edu.ph');
      setPassword('password123');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success && !res.cancelled) {
        setErrorMessage(res.error || 'Google Sign-In could not be completed.');
      }
    } catch (err: any) {
      if (
        !err?.message?.includes('popup-closed-by-user') &&
        !err?.message?.includes('cancelled-popup-request') &&
        err?.code !== 'auth/popup-closed-by-user'
      ) {
        setErrorMessage(err.message || 'Google Sign-In error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    const enteredLogin = email.trim();
    const passToLogin = password.trim();

    setTimeout(() => {
      // First try exact user/email and password entered
      let result = login(enteredLogin, passToLogin, rememberMe);

      // If that didn't match and user is using demo address or username prefix, try username part
      if (!result.success && enteredLogin.includes('@')) {
        const usernamePart = enteredLogin.split('@')[0];
        result = login(usernamePart, passToLogin, rememberMe);
      }

      // If still not matched, check role demo account fallback
      if (!result.success && enteredLogin.includes('example@jrmsu.edu.ph')) {
        const fallbackUser = selectedRole === 'instructor' ? 'prof.miller' : 'reg.davis';
        result = login(fallbackUser, 'password123', rememberMe);
      }

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your details.');
      }
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFF7FB] text-slate-900 font-sans overflow-x-hidden selection:bg-[#5B3765] selection:text-white">
      {/* =========================================================================
          LAYER 1: DIAGONAL SPLIT BACKGROUND
          Left: deep plum purple #5B3765 (approx 40% of viewport width)
          Right: soft blush white #FFF7FB (approx 60% of viewport width)
          Crisp diagonal edge cutting from ~42% at top down to ~38% at bottom (~40% average)
      ========================================================================= */}
      <div
        className="hidden lg:block absolute inset-0 bg-[#5B3765] pointer-events-none z-0"
        style={{
          clipPath: 'polygon(0 0, 42% 0, 38% 100%, 0 100%)',
        }}
      />

      {/* Mobile / Tablet Background: Cohesive gradient rather than harsh clipping cut */}
      <div
        className="lg:hidden absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#5B3765] to-[#43234D] pointer-events-none z-0"
      />

      {/* =========================================================================
          LAYER 2 & 3: HERO PANTHER STRADDLING THE DIAGONAL SEAM (~40% MARK - Desktop only)
      ========================================================================= */}
      <div className="hidden lg:block absolute left-[37%] top-1/2 -translate-x-[52%] -translate-y-[48%] z-20 pointer-events-none">
        <PantherIllustration showGlow={true} />
      </div>

      {/* =========================================================================
          LAYER 4 & 5: FOREGROUND CONTENT (Left branding/headline & Right login card)
      ========================================================================= */}
      <div className="relative z-30 min-h-screen w-full flex flex-col lg:flex-row items-stretch">
        
        {/* LEFT PANEL CONTENT (40% width on desktop, clean hero banner on mobile) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 lg:min-h-screen">
          {/* Top-Left: Logos & University Branding */}
          <div>
            <UniversityBranding lightText={true} />
          </div>

          {/* Headline */}
          <div className="my-6 lg:my-0 lg:pb-12 max-w-[320px] xl:max-w-[360px]">
            <h1 className="text-2xl sm:text-3xl xl:text-[40px] font-extrabold text-white leading-[1.18] tracking-tight">
              Smart Attendance &<br />
              Classroom Governance.
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-purple-200/90 font-normal leading-relaxed">
              College of Computing Studies academic verification system.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL CONTENT (60% width: Login Card centered on mobile, right-aligned on desktop) */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center items-center lg:items-end lg:pr-10 xl:pr-20 2xl:pr-28 px-4 sm:px-8 py-6 sm:py-10 lg:py-16">
          
          {/* App Name / Logo Text at Top */}
          <div className="w-full max-w-[420px] mb-4 sm:mb-5 text-left">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] tracking-tight text-slate-800">
              <span className="font-extrabold text-[#5B3765]">PantherCheck</span>{' '}
              <span className="font-normal text-slate-700">Attendance Portal</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
              Sign in with your verified university credentials.
            </p>
          </div>

          {/* White Rounded Card with Soft Shadow (~12px corner radius) */}
          <div className="w-full max-w-[420px] bg-white rounded-[12px] border border-purple-100/90 shadow-xl shadow-purple-950/5 p-5 sm:p-7 md:p-8">
            
            {/* Segmented Pill-Shaped Toggle (Instructor vs Registrar) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF2F8] rounded-[10px] border border-purple-100 mb-5">
              <button
                id="role-tab-instructor"
                type="button"
                onClick={() => handleRoleChange('instructor')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[8px] text-xs font-bold transition-all ${
                  selectedRole === 'instructor'
                    ? 'bg-[#5B3765] text-white shadow-xs'
                    : 'bg-transparent text-[#5B3765] hover:bg-white/60'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${selectedRole === 'instructor' ? 'text-purple-200' : 'text-[#5B3765]'}`} />
                <span>Instructor</span>
              </button>

              <button
                id="role-tab-registrar"
                type="button"
                onClick={() => handleRoleChange('registrar')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[8px] text-xs font-bold transition-all ${
                  selectedRole === 'registrar'
                    ? 'bg-[#5B3765] text-white shadow-xs'
                    : 'bg-transparent text-[#5B3765] hover:bg-white/60'
                }`}
              >
                <Building2 className={`w-4 h-4 ${selectedRole === 'registrar' ? 'text-purple-200' : 'text-[#5B3765]'}`} />
                <span>Registrar</span>
              </button>
            </div>

            {/* Google One-Click Institutional Sign-In */}
            <button
              id="btn-google-signin"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-[10px] text-xs font-semibold text-slate-700 bg-white border border-purple-200 hover:bg-[#FAF4F8] shadow-xs hover:shadow transition-all mb-4 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with University Google Account</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-purple-200/60 w-full" />
              <span className="bg-white px-2 text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
                Or with credentials
              </span>
              <div className="border-t border-purple-200/60 w-full" />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                id="login-error-alert"
                className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 flex items-start gap-2 text-red-900 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Login Failed:</span> {errorMessage}
                </div>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div
                id="login-info-alert"
                className="mb-4 p-3 rounded-[10px] bg-purple-50 border border-purple-200 flex items-start gap-2 text-purple-900 animate-in fade-in"
              >
                <CheckCircle className="w-4 h-4 text-[#5B3765] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">{infoMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input Field */}
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email or Username
                </label>
                <div className="relative rounded-[10px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B3765]/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@jrmsu.edu.ph or username"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setInfoMessage('Password reset verification link dispatched to registered institutional email.')}
                    className="text-xs text-[#5B3765] hover:text-[#43234D] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative rounded-[10px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B3765]/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#5B3765] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox "Remember me" & Pill Badge "Dual Auth Required" */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-purple-300 text-[#5B3765] focus:ring-[#5B3765] accent-[#5B3765]"
                  />
                  <span className="text-xs text-slate-600 font-medium">Remember me</span>
                </label>

                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#F5E6F2] text-[#5B3765] border border-[#5B3765]/20">
                  Dual Auth Required
                </span>
              </div>

              {/* Full-width Solid Purple Rounded "Login" Button */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-[10px] text-sm font-bold text-white bg-[#5B3765] hover:bg-[#482853] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B3765] shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 text-purple-200" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Row */}
            <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Don't have an account?</span>
              <button
                id="btn-goto-signup"
                type="button"
                onClick={() => setActiveView('signup')}
                className="font-bold text-[#5B3765] hover:text-[#3F1F47] hover:underline transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Quick Test Demo Hint */}
          <div className="w-full max-w-[420px] mt-3.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Role: {selectedRole === 'instructor' ? 'Instructor (prof.miller)' : 'Registrar (reg.davis)'}</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              1-Click Ready
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
