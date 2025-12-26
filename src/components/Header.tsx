import nasName from "@/assets/nas-name.png";
import tawtheeqLogo from "@/assets/tawtheeq-logo.png";

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <img src={tawtheeqLogo} alt="توثيق" className="h-16" />
          <img src={nasName} alt="نظام التوثيق الوطني" className="h-12" />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-3">
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="text-primary hover:underline">
            تسجيل الدخول
          </a>
          <a href="#" className="text-primary hover:underline">
            English
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
