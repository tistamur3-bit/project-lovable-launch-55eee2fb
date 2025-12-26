import { useEffect, useState } from "react";
import tawtheeqLogo from "@/assets/tawtheeq-logo.png";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-secondary/20 to-background z-50 flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {/* Logo with pulse animation */}
        <div className="flex justify-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <img
              src={tawtheeqLogo}
              alt="توثيق - نظام التوثيق الوطني"
              className="h-24 w-auto relative z-10 drop-shadow-xl"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold text-foreground">
            جارٍ التحميل
          </h2>
          <p className="text-sm text-muted-foreground">
            يرجى الانتظار...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-full mx-auto space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground text-center">{progress}%</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>اتصال آمن ومشفّر</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
