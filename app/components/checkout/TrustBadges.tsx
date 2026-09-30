"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Smartphone, AlertCircle } from "lucide-react";

export type PaymentMethod = "card" | "stc" | "apple";

interface Props {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  className?: string;
}

const methods = [
  { id: "card" as PaymentMethod, name: "بطاقة بنكية / مدى", img: "/فيزا ماستر مدى.webp", alt: "Visa Mastercard Mada" },
  { id: "stc" as PaymentMethod, name: "STC Pay", img: "/stc.png", alt: "STC Pay", hidden: true },
  { id: "apple" as PaymentMethod, name: "Apple Pay", img: "/Apple-Pay-01.png", alt: "Apple Pay" },
];

export default function PaymentMethodSelector({ value, onChange, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-extrabold text-gray-800">اختر طريقة الدفع</p>
        <span className="text-[11px] font-medium text-gray-400">خيارات دفع آمنة وموثوقة</span>
      </div>

      <div className="p-3 sm:p-4 grid grid-cols-2 gap-2.5 sm:gap-4">
        {methods.filter((m) => !m.hidden).map((m) => {
          const isSelected = value === m.id;
          const isApple = m.id === "apple";

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 py-3.5 sm:py-4 px-2 sm:px-4 transition-all cursor-pointer min-h-[88px] sm:min-h-[102px]
                ${isSelected
                  ? "border-[#1a6b7d] bg-[#1a6b7d]/5 shadow-md shadow-[#1a6b7d]/15 ring-1 ring-[#1a6b7d]/30"
                  : "border-gray-200 bg-gray-50/70 hover:border-[#1a6b7d]/40 hover:bg-[#1a6b7d]/5"
                }`}
            >
              {isSelected && (
                <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 w-2.5 h-2.5 rounded-full bg-[#1a6b7d] ring-2 ring-white" />
              )}

              {/* Logo Area */}
              <div className="flex items-center justify-center w-full h-11 sm:h-12">
                {isApple ? (
                  <div className="transform scale-125 sm:scale-135 flex items-center justify-center">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      width={105}
                      height={48}
                      className="object-contain max-h-9 sm:max-h-11 drop-shadow-sm"
                    />
                  </div>
                ) : (
                  <Image
                    src={m.img}
                    alt={m.alt}
                    width={110}
                    height={40}
                    className="object-contain max-h-8 sm:max-h-10 drop-shadow-sm"
                  />
                )}
              </div>

              {/* Title */}
              <span
                className={`text-[11px] sm:text-xs font-bold mt-1.5 transition-colors ${
                  isSelected ? "text-[#1a6b7d]" : "text-gray-600"
                }`}
              >
                {m.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── STC Pay panel ── */
export function StcPayPanel({
  onSubmit,
  onBack,
  loading,
}: {
  onSubmit: (phone: string) => Promise<void>;
  onBack: () => void;
  loading: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");

  const handlePay = async () => {
    const clean = phone.trim();
    if (!/^05\d{8}$/.test(clean)) {
      setErr("يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ومكوّن من 10 أرقام");
      return;
    }
    setErr("");
    await onSubmit(clean);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a6b7d]/10 rounded-lg flex items-center justify-center">
            <Smartphone size={15} className="text-[#1a6b7d]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">الدفع عبر STC Pay</h2>
            <p className="text-[11px] text-gray-400">أدخل رقم جوالك المرتبط بمحفظة STC</p>
          </div>
          <Image src="/stc.png" alt="STC Pay" width={56} height={28} className="object-contain mr-auto opacity-80" />
        </div>

        <div className="px-5 py-5 space-y-2">
          <label className="text-xs font-semibold text-gray-600">
            رقم الجوال <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Smartphone size={15} className="text-gray-400" />
            </span>
            <input
              type="tel"
              maxLength={10}
              dir="ltr"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErr(""); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm font-mono tracking-wider text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b7d]/30 focus:border-[#1a6b7d] focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
          {err && (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertCircle size={12} /> {err}
            </p>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-2">
          <Lock size={13} className="text-[#7CC043]" />
          <span className="text-xs text-gray-400">جميع البيانات مشفرة وآمنة بنسبة 100%</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl text-sm hover:bg-gray-50 transition-all"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="flex-[2] py-4 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white rounded-xl font-extrabold text-base shadow-lg shadow-[#1a6b7d]/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock size={15} />
          {loading ? "جاري المعالجة..." : "تأكيد الدفع"}
        </button>
      </div>
    </div>
  );
}

/* ── Apple Pay panel ── */
export function ApplePayPanel({
  onBack,
  onSubmit,
  loading,
  dueNow,
}: {
  onBack: () => void;
  onSubmit?: () => Promise<void>;
  loading?: boolean;
  dueNow?: number;
}) {
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-9 gap-4">
          {/* Apple Pay Logo */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex items-center justify-center">
            <Image
              src="/Apple-Pay-01.png"
              alt="Apple Pay"
              width={140}
              height={65}
              className="object-contain max-h-12 w-auto"
            />
          </div>

          <div className="text-center space-y-2 w-full max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>دفع سريع وآمن بنقرة واحدة</span>
            </div>

            <p className="text-sm sm:text-base font-extrabold text-gray-800">
              إتمام الدفع عبر المحفظة الرقمية Apple Pay
            </p>

            <p className="text-xs text-gray-400 leading-relaxed px-4">
              سيتم نقلك إلى بوابة الدفع الآمنة من Stripe لإتمام طلبك فوراً باستخدام بصمة الوجه (Face ID) أو بطاقاتك المعتمدة.
            </p>

            {dueNow != null && dueNow > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500 font-medium">المبلغ المطلوب:</span>
                <span className="text-base font-black text-[#1a6b7d]">{fmt(dueNow)} ر.س</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-2">
          <Lock size={13} className="text-[#7CC043]" />
          <span className="text-xs text-gray-400">معاملات بنكية مشفرة وآمنة بنسبة 100% عبر Stripe</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl text-sm hover:bg-gray-50 transition-all"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex-[2] py-4 bg-black hover:bg-neutral-900 active:scale-[0.98] text-white rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-black/15 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>جاري التحويل...</span>
          ) : (
            <>
              <span className="text-lg leading-none font-sans"></span>
              <span>Pay الدفع عبر Apple Pay</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
