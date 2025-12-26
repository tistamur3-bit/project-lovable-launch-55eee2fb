import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import nasName from "@/assets/nas-name.png";
import tawtheeqLogo from "@/assets/tawtheeq-logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={nasName} alt="NAS" className="h-12" />
          <img src={tawtheeqLogo} alt="Tawtheeq" className="h-12" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            بوابة الخدمة الذاتية
          </h1>

          <div className="bg-card border border-border rounded-lg p-8 shadow-sm mb-12">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              تهدف خدمة التوثيق الوطني إلى التحقق من الهوية الرقمية للأفراد والشركات من مستخدمي الخدمات الحكومية الإلكترونية المتاحة على شبكة الإنترنت، بالإضافة إلى تفعيل ميزة الدخول الموحّد للخدمات الإلكترونية من خلال إنشاء كلمة سر واسم مستخدم واحد فقط.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              ويمكن للفرد أن يستخدم حسابه المُنشأ على نظام التوثيق الوطني "توثيق" لإجراء أي من المعاملات الإلكترونية التي توفرها الجهات الحكومية المستخدمة للنظام. وبذلك، يشكل نظام "توثيق" عنصراً أساسياً في تسهيل وتطوير وتأمين الخدمات الإلكترونية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/register")}>
              إنشاء حساب جديد
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => navigate("/login")}>
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 نظام التوثيق الوطني - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
