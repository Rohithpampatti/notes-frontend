import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('verificationEmail') || '';

  useEffect(() => {
    if (!email) {
      // No email, redirect to login
      navigate('/login');
      return;
    }
    
    // Store email for persistence
    localStorage.setItem('verificationEmail', email);
    
    // Focus first input
    inputRefs.current[0]?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    setSuccess('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits are filled
    if (index === 5 && value && newOtp.every(d => d !== '')) {
      handleVerify();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus last input after paste
      inputRefs.current[5]?.focus();
      
      // Auto-verify after paste
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verify OTP with Supabase
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: otpValue,
        type: 'email',
      });

      if (verifyError) {
        throw verifyError;
      }

      setSuccess('Email verified successfully! Redirecting...');
      
      // Clear stored email
      localStorage.removeItem('verificationEmail');
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before requesting another code`);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Resend verification email via Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setSuccess('New verification code sent to your email!');
      setResendCooldown(60); // 60 second cooldown
      
      // Clear OTP for new code
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format cooldown time
  const formatCooldown = () => {
    const minutes = Math.floor(resendCooldown / 60);
    const seconds = resendCooldown % 60;
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-400">
              We've sent a verification code to
              <br />
              <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit code to verify your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center space-x-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                disabled={loading}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.some(d => d === '')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`text-blue-400 hover:text-blue-300 transition-colors font-medium ${
                  (resendCooldown > 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendCooldown > 0 ? `Resend (${formatCooldown()})` : 'Resend Code'}
              </button>
            </p>
            <p className="text-gray-500 text-xs mt-3">
              Check your spam folder if you don't see the email
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};