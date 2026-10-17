import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, User as AppUser } from '../../types';
import { UniversityBranding } from '../UniversityBranding';
import { PantherIllustration } from '../PantherIllustration';
import {
  ArrowLeft,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building2,
  Mail,
  User,
  Lock,
} from 'lucide-react';

export const SignUpScreen: React.FC = () => {
  const { signup, login, setActiveView, setCurrentUser } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('instructor');
  const [department, setDepartment] = useState('College of Computing Studies');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<AppUser | null>(null);

  const handleAutoLogin = () => {
    if (registeredUser) {
      setCurrentUser(registeredUser);
      setActiveView('dashboard');
    } else {
      login(username, password);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please provide a valid institutional email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    const res = signup({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      role,
      department: department.trim() || 'College of Computing Studies',
      employeeId:
        employeeId.trim() ||
        (role === 'instructor'
          ? `INS-${Date.now().toString().slice(-4)}`
          : `REG-${Date.now().toString().slice(-4)}`),
      password,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to register account.');
    } else {
      if (res.user) {
        setRegisteredUser(res.user);
      }
      setIsSuccess(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFF7FB] text-slate-900 font-sans overflow-x-hidden selection:bg-[#5B3765] selection:text-white">
      {/* DIAGONAL SPLIT BACKGROUND: 42% at top to 38% at bottom (~40% Left / 60% Right) */}
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

      {/* HERO PANTHER STRADDLING THE DIAGONAL SEAM (~40% MARK - Desktop only) */}
      <div className="hidden lg:block absolute left-[37%] top-1/2 -translate-x-[52%] -translate-y-[48%] z-20 pointer-events-none">
        <PantherIllustration showGlow={true} />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-30 min-h-screen w-full flex flex-col lg:flex-row items-stretch">
        {/* LEFT PANEL CONTENT (40% width on desktop, clean hero banner on mobile) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 lg:min-h-screen">
          <div>
            <UniversityBranding lightText={true} />
          </div>

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

        {/* RIGHT PANEL CONTENT (60% width: Registration Card centered on mobile, right-aligned on desktop) */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center items-center lg:items-end lg:pr-10 xl:pr-20 2xl:pr-28 px-4 sm:px-8 py-6 sm:py-10 lg:py-16">
          <div className="w-full max-w-[460px] mb-4 sm:mb-5 text-left">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] tracking-tight text-slate-800">
              <span className="font-extrabold text-[#5B3765]">PantherCheck</span>{' '}
              <span className="font-normal text-slate-700">Account Registration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
              Enroll your credentials into the institutional directory.
            </p>
          </div>

          <div className="w-full max-w-[460px] bg-white rounded-[12px] border border-purple-100/90 shadow-xl shadow-purple-950/5 p-5 sm:p-7 md:p-8">
            {isSuccess ? (
              <div id="registration-success-card" className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-purple-50 text-[#5B3765] rounded-full flex items-center justify-center mx-auto border-2 border-purple-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#5B3765]">Registration Successful</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Your institutional account has been verified and registered. You can now sign in with your credentials.
                  </p>
                </div>
                <div className="p-3 bg-[#FAF2F8] rounded-[10px] border border-purple-100 text-xs text-left max-w-xs mx-auto space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#5B3765]">
                    Account Saved to Database:
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Username:</span>
                    <span className="font-semibold text-[#5B3765]">{username}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Authorized Role:</span>
                    <span className="font-semibold uppercase text-[#5B3765]">{role}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleAutoLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-[10px] font-bold text-sm text-white bg-[#5B3765] hover:bg-[#482853] shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Enter Portal Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-[10px] font-semibold text-xs text-[#5B3765] bg-white border border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Login</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Role Selector Pill */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF2F8] rounded-[10px] border border-purple-100 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('instructor')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[8px] text-xs font-bold transition-all ${
                      role === 'instructor'
                        ? 'bg-[#5B3765] text-white shadow-xs'
                        : 'bg-transparent text-[#5B3765] hover:bg-white/60'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Instructor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('registrar')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-[8px] text-xs font-bold transition-all ${
                      role === 'registrar'
                        ? 'bg-[#5B3765] text-white shadow-xs'
                        : 'bg-transparent text-[#5B3765] hover:bg-white/60'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Registrar</span>
                  </button>
                </div>

                {errorMessage && (
                  <div
                    id="signup-error-alert"
                    className="mb-4 p-3 rounded-[10px] bg-red-50 border border-red-200 flex items-start gap-2 text-red-900 animate-in fade-in"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold">Error:</span> {errorMessage}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-[10px]">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B3765]/60">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="fullname-input"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institutional Email
                    </label>
                    <div className="relative rounded-[10px]">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B3765]/60">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jhayes@jrmsu.edu.ph"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Username
                      </label>
                      <input
                        id="username-input"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="prof.hayes"
                        className="w-full px-3 py-2 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        id="department-input"
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Computing Studies"
                        className="w-full px-3 py-2 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative rounded-[10px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5B3765]/60">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="password-input"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative rounded-[10px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5B3765]/60">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="confirm-password-input"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF2F8] border border-purple-200/70 rounded-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B3765] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    id="btn-signup-submit"
                    type="submit"
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-[10px] text-sm font-bold text-white bg-[#5B3765] hover:bg-[#482853] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B3765] shadow-md transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Already registered?</span>
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="font-bold text-[#5B3765] hover:text-[#3F1F47] hover:underline transition-colors"
                  >
                    Sign In Here
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
