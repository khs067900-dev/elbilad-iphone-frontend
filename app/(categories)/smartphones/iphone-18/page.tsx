"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const PREORDER_DATE = new Date("2026-09-12T20:00:00Z"); // 11 PM KSA (UTC+3)

const IMAGES = [
  "/e5ae006f-b733-41d4-9e48-69994eeacbe4.webp",
  "/df3a0f08-fb1c-4b40-863c-58f8f562805d.webp",
  "/fe7ec25b-bb16-4ae3-ab3f-bdc18111d748.webp",
];

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function IPhone18Page() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    setTime(getTimeLeft(PREORDER_DATE));
    const id = setInterval(() => setTime(getTimeLeft(PREORDER_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" dir="rtl">

      {/* Background images with crossfade */}
      {IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="iPhone 18"
          fill
          unoptimized
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-5 pt-[45vw] sm:pt-[30vw] pb-10">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6DBE00] animate-pulse" />
          <span className="text-white/80 text-[11px] font-semibold tracking-widest uppercase">البلاد</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">iPhone 18</h1>
          <p className="text-white/60 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
            استعدوا للجديد... iPhone 18 قريبًا في البلاد، وكن من أوائل من يقتنونه في المملكة.
          </p>
        </div>

        {/* Timer */}
        <div className="flex gap-3">
          {[
            { label: "يوم", value: time.days },
            { label: "ساعة", value: time.hours },
            { label: "دقيقة", value: time.minutes },
            { label: "ثانية", value: time.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                {String(value).padStart(2, "0")}
              </div>
              <span className="text-white/40 text-[10px]">{label}</span>
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="flex gap-3 w-full max-w-sm">
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
            <p className="text-[#6DBE00] text-[10px] font-semibold uppercase tracking-wider mb-0.5">الحجز المسبق</p>
            <p className="text-white text-sm font-bold">12 سبتمبر 2026</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
            <p className="text-[#6DBE00] text-[10px] font-semibold uppercase tracking-wider mb-0.5">التوفر</p>
            <p className="text-white text-sm font-bold">18 سبتمبر 2026</p>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-1.5 bg-[#6DBE00]" : "w-1.5 h-1.5 bg-white/30"}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
