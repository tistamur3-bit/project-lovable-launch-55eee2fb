import Header from "@/components/Header";
import Stepper from "@/components/Stepper";
import PasswordForm from "@/components/PasswordForm";
import Footer from "@/components/Footer";

const steps = [
  { number: 1, title: "نوع الحساب" },
  { number: 2, title: "البيانات الشخصية" },
  { number: 3, title: "كلمة المرور" },
  { number: 4, title: "إتمام التسجيل" },
];

const Password = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 bg-white">
        <Stepper currentStep={3} steps={steps} />
        <PasswordForm />
      </main>
      <Footer />
    </div>
  );
};

export default Password;
