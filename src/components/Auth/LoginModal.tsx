import React, { useState, useRef, useEffect } from 'react';
import { Phone, MessageCircle, ShieldCheck, X, ArrowRight, Loader2 } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void; // Call this when backend says OTP is correct
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simulate Backend Call: Send WhatsApp OTP
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    sounds.playClick();
    setIsLoading(true);
    
    // TODO: Connect to your backend API here to trigger WhatsApp MSG91/Twilio
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  // Simulate Backend Call: Verify OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return;

    sounds.playClick();
    setIsLoading(true);

    // TODO: Connect to your backend API here to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      sounds.playSuccess();
      onLoginSuccess();
      onClose();
    }, 1500);
  };

  // Auto-focus magic for the 6-digit OTP boxes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 sm:p-10">
                    <div className="w-12 h-12 bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#25D366] rounded-2xl flex items-center justify-center mb-6 border border-[#25D366]/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {step === 'phone' ? 'Secure Access' : 'Verify WhatsApp'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            {step === 'phone' 
              ? 'Enter your mobile number to receive a secure login code via WhatsApp.'
              : `We sent a 6-digit code to +91 ${phone}`
            }
          </p>

          {/* STEP 1: ENTER PHONE */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 font-medium">+91</div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-mono text-lg"
                    placeholder="99999 00000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length < 10 || isLoading}
                className="w-full bg-[#25D366] hover:bg-[#1ebd5c] disabled:opacity-50 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                Send Code via WhatsApp
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white transition-all"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otp.join('').length < 6 || isLoading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};