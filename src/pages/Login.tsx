import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Loader2, KeyRound, Eye, EyeOff, CheckCircle, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Login parameters
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Registration parameters
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(true)

  // Forgot password parameters
  const [forgotFlow, setForgotFlow] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStep, setForgotStep] = useState<1 | 2>(1) // 1: Send OTP, 2: Reset Form
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // OTP phase parameters
  const [isOtpPhase, setIsOtpPhase] = useState(false)
  const [otpCode, setOtpOtpCode] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })

      if (response.ok) {
        const data = await response.json()
        login(data.user)
        // Shift routes appropriately
        if (data.user.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/account')
        }
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Authentication denied. Verify your credentials.')
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('Communication error with authentication vault.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegisterOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match with the original entry.')
      return
    }

    if (!termsAccepted) {
      setErrorMessage('patronage terms must be accepted to proceed.')
      return
    }

    setSubmitting(true)

    try {
      // Registrar is OTP only. We call posture /api/auth/send-otp first
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, type: 'VERIFY_EMAIL' })
      })

      if (response.ok) {
        setIsOtpPhase(true)
      } else {
        const err = await response.json()
        setErrorMessage(err.error || 'Failed to dispatch email verification OTP.')
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('Server connection error during registry.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtpAndCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          code: otpCode,
        })
      })

      if (response.ok) {
        const data = await response.json()
        login(data.user)
        navigate('/account')
      } else {
        const err = await response.json()
        setErrorMessage(err.error || 'OTP verification code is incorrect or expired.')
      }
    } catch (e) {
      console.error(e)
      setErrorMessage('Handshake verification error on server.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendForgotPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })

      if (response.ok) {
        setForgotStep(2)
      } else {
        const err = await response.json()
        setErrorMessage(err.error || 'Registered account email not found.')
      }
    } catch (e) {
      setErrorMessage('Failed to send reset code.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          code: forgotOtp,
          newPassword: newPassword,
        })
      })

      if (response.ok) {
        // Success
        setForgotFlow(false)
        setForgotStep(1)
        setActiveTab('login')
        setErrorMessage('Password changed successfully. Proceeding to login.')
      } else {
        const err = await response.json()
        setErrorMessage(err.error || 'Reset code validation mismatched.')
      }
    } catch (e) {
      setErrorMessage('Server connection error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-lg mx-auto min-h-screen flex flex-col justify-center relative">
      {/* Background radial spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[100px] opacity-35" />
        <div className="absolute -bottom-[15%] -right-[15%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[90px] opacity-25" />
      </div>

      <div className="z-10 bg-[#121412] p-8 md:p-10 border border-[#D4AF37]/15 rounded-xl shadow-2xl relative">
        {/* Brand wordmark logo header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-4xl text-[#D4AF37] block mb-2 font-headline italic">✧</span>
          <h1 className="font-headline text-3xl italic tracking-tighter text-[#D4AF37]">ROSHGEMS</h1>
          <p className="font-body text-[9px] uppercase tracking-[0.25em] text-[#F5F5F0]/40 mt-1 block">Jaipur • Legacy of Light</p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-300 text-xs text-center uppercase tracking-wider rounded-md mb-6 leading-relaxed">
            ✦ {errorMessage}
          </div>
        )}

        {/* FORGOT PASSWORD SUBFLOW */}
        {forgotFlow ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline text-2xl italic text-[#D4AF37]">Reset Account Vault</h3>
              <button onClick={() => setForgotFlow(false)} className="text-[10px] uppercase text-[#F5F5F0]/50 hover:text-[#D4AF37] tracking-widest font-semibold bg-transparent border-none">
                Back to Login
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotPasswordOtp} className="space-y-6">
                <p className="text-xs opacity-60 font-light leading-relaxed">
                  Provide your registered email address; our workbench email concierge will dispatch an account reset OTP code.
                </p>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="patron@consort.com"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#D4AF37] text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#B8962F] transition-all rounded"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Request Reset OTP Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">6-Digit Reset Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="994105"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none tracking-widest font-mono text-center text-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">New Account Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#D4AF37] text-white font-semibold text-xs tracking-widest uppercase hover:bg-[#B8962F] transition-all rounded"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Override Account Password'}
                </button>
              </form>
            )}
          </div>
        ) : isOtpPhase ? (
          /* REGISTRATION OTP CODE PROMPT BLOCK */
          <form onSubmit={handleVerifyOtpAndCreateUser} className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <Smartphone className="w-8 h-8 text-[#D4AF37] mx-auto animate-bounce" />
              <h3 className="font-headline text-2xl italic text-[#D4AF37]">Verify Carriage Email</h3>
              <p className="text-xs opacity-60 max-w-xs mx-auto leading-relaxed">
                Enter the GIA-validated 6-Digit security OTP sent to <span className="text-[#D4AF37] font-semibold">{regEmail}</span>.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block text-center">Verification Code (6 Digits)</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpOtpCode(e.target.value)}
                placeholder="408215"
                className="w-full bg-transparent border-b border-[#D4AF37]/40 focus:border-[#D4AF37] focus:ring-0 py-3 text-sm text-center font-bold tracking-[0.4em] font-mono text-[#D4AF37]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#D4AF37] text-black font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#B8962F] transition-all rounded shadow-lg"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-black" /> : 'Confirm OTP & Unseal Account'}
              </button>
              <button
                type="button"
                onClick={() => setIsOtpPhase(false)}
                className="text-[9px] uppercase tracking-[0.2em] text-[#F5F5F0]/40 hover:text-white transition-opacity bg-transparent border-none mt-2"
              >
                ← Back to Registry Form
              </button>
            </div>
          </form>
        ) : (
          /* STANDARD LOGIN AND REGISTRATION MOUNT WITH PLIANT TABS */
          <div className="space-y-6">
            <div className="flex justify-center gap-8 mb-8 border-b border-[#D4AF37]/10 pb-4">
              <button
                onClick={() => {
                  setActiveTab('login')
                  setErrorMessage('')
                }}
                className={`font-body uppercase text-xs tracking-[0.2em] transition-all border-b-2 pb-2 bg-transparent border-none cursor-pointer font-bold ${
                  activeTab === 'login' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#F5F5F0]/40 border-transparent hover:text-[#F5F5F0]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register')
                  setErrorMessage('')
                }}
                className={`font-body uppercase text-xs tracking-[0.2em] transition-all border-b-2 pb-2 bg-transparent border-none cursor-pointer font-bold ${
                  activeTab === 'register' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#F5F5F0]/40 border-transparent hover:text-[#F5F5F0]'
                }`}
              >
                Patron Register
              </button>
            </div>

            {/* SIGN IN TAB */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="patron@consort.com"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotFlow(true)}
                      className="text-[10px] text-[#D4AF37] hover:underline bg-transparent border-none font-semibold cursor-pointer"
                    >
                      Forgot Shield Key?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2.5 pr-10 text-xs outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-[#D4AF37] bg-transparent border-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#B8962F] text-black font-body text-xs uppercase tracking-[0.2em] font-bold rounded shadow-lg transition-all"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-black" /> : 'Enter the Vault'}
                </button>
              </form>
            )}

            {/* REGISTRATION TAB */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterOtpRequest} className="space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Julian Whitmore"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="curator@sterling.com"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Confirm Key</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-b border-[#D4AF37]/25 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="check-terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-[#050705] border-[#D4AF37]/20 text-[#D4AF37] focus:ring-offset-0 focus:ring-[#D4AF37] mt-0.5"
                  />
                  <label htmlFor="check-terms" className="text-[10px] text-[#F5F5F0]/50 select-none cursor-pointer leading-tight">
                    I agree to the <Link to="/privacy-policy" className="text-[#D4AF37] underline underline-offset-2">Refund & Policy Rules</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#D4AF37] text-black font-body text-xs uppercase tracking-[0.2em] font-bold rounded shadow-lg transition-all"
                >
                  {submitting ? <Loader2 className="w-10 h-4 animate-spin mx-auto text-black" /> : 'Send Email Verification OTP'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <div className="flex justify-center items-center gap-3 opacity-30 mb-3">
          <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
          <div className="w-20 h-[1.5px] bg-[#D4AF37]/50" />
          <span className="text-[#D4AF37] text-xs">✧</span>
          <div className="w-20 h-[1.5px] bg-[#D4AF37]/50" />
          <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/50">Jaipur Heritage Atelier • Appraisals • Pure Mineral Sovereigns</p>
      </div>
    </div>
  )
}
export default Login
