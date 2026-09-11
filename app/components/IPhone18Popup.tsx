"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const TARGET = new Date(
  process.env.NEXT_PUBLIC_IPHONE18_RESERVATION_DATE ?? "2026-09-12T23:00:00+03:00"
);

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export default function IPhone18Popup() {
  const [visible, setVisible] = useState(false);
  const [show, setShow]       = useState(false);
  const [time, setTime]       = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("popup_shown")) return;
    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("popup_shown", "true");
      setTimeout(() => setShow(true), 20);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setShow(false);
    setTimeout(() => setVisible(false), 320);
  }

  if (!visible) return null;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <style>{`
        @keyframes _in  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes _out { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes _sh  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes _dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes _gb  { 0%,100%{border-color:rgba(31,122,140,0.25)} 50%{border-color:rgba(31,122,140,0.85)} }
        @keyframes _zoom { from{transform:scale(1)} to{transform:scale(1.08)} }
      `}</style>

      <div onClick={close} style={{
        position:"fixed", inset:0, zIndex:9999,
        display:"flex", alignItems:"center", justifyContent:"center",
        background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)",
      }}>
        <div dir="rtl" onClick={e => e.stopPropagation()} style={{
          position:"relative", width:"100%", maxWidth:"480px",
          borderRadius:"24px 24px 0 0", overflow:"hidden",
          boxShadow:"0 -4px 40px rgba(0,0,0,0.6)",
          animation: show ? "_in 0.4s cubic-bezier(0.22,1,0.36,1) forwards" : "_out 0.3s ease forwards",
        }}>

          {/* BG image */}
          <Image src="/iphone-18.webp" alt="iPhone 18" fill priority
            style={{
              objectFit:"cover", objectPosition:"center 0%",
              animation:"_zoom 8s ease-in-out infinite alternate",
              transformOrigin:"center center",
            }} />

          {/* gradient overlay - only bottom */}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(to bottom, rgba(3,14,20,0.1) 0%, rgba(3,14,20,0.55) 45%, rgba(3,14,20,0.92) 75%, #030e14 100%)",
          }} />

          {/* drag handle */}
          <div style={{
            position:"absolute", top:"10px", left:"50%", transform:"translateX(-50%)",
            width:"36px", height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.25)", zIndex:10,
          }} />

          {/* Close */}
          <button onClick={close} aria-label="إغلاق" style={{
            position:"absolute", top:"12px", left:"12px", zIndex:10,
            width:"28px", height:"28px", borderRadius:"50%",
            background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.15)",
            color:"rgba(255,255,255,0.8)", fontSize:"12px", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>

          {/* Content */}
          <div style={{ position:"relative", zIndex:2, padding:"90px 20px 20px", textAlign:"center" }}>

            {/* Title */}
            <h2 style={{
              color:"#fff", fontSize:"52px", fontWeight:800,
              margin:"0 0 6px", lineHeight:1, letterSpacing:"-2px",
            }}>iPhone 18</h2>

            {/* Subtitle */}
            <p style={{ color:"#7dd4e8", fontSize:"15px", fontWeight:700, margin:"0 0 6px" }}>
              الجديد يبدأ من هنا. والأولوية لك.
            </p>

            {/* Shining text */}
            <p style={{
              fontWeight:800, fontSize:"17px", margin:"0 0 18px",
              background:"linear-gradient(90deg,#fff,#7dd4e8,#fff)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"_sh 3s linear infinite",
            }}>
              البلاد — خلك أول.
            </p>

            {/* Timer label */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", marginBottom:"8px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#1F7A8C", animation:"_dot 1.2s ease-in-out infinite", flexShrink:0 }} />
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"10px", fontWeight:700, margin:0, letterSpacing:"1px" }}>
                العدّ التنازلي بدأ — كن مستعدًا قبل الجميع
              </p>
            </div>

            {/* Timer */}
            <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginBottom:"14px" }}>
              {[{n:time.d,l:"يوم"},{n:time.h,l:"ساعة"},{n:time.m,l:"دقيقة"},{n:time.s,l:"ثانية"}].map(({n,l},i) => (
                <div key={l} style={{ display:"flex", alignItems:"flex-start", gap:"6px" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{
                      background:"rgba(255,255,255,0.07)",
                      border:"1px solid rgba(31,122,140,0.4)",
                      color:"#fff", borderRadius:"8px",
                      fontSize:"22px", fontWeight:800, lineHeight:1,
                      padding:"8px 10px", minWidth:"48px", letterSpacing:"-1px",
                      animation: l==="ثانية" ? "_gb 1s ease-in-out infinite" : undefined,
                    }}>{pad(n)}</div>
                    <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", fontWeight:600, margin:"4px 0 0" }}>{l}</p>
                  </div>
                  {i < 3 && <span style={{ color:"rgba(255,255,255,0.2)", fontSize:"18px", paddingTop:"6px" }}>:</span>}
                </div>
              ))}
            </div>

            {/* Dates */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
              {[{date:"15 سبتمبر",label:"الطلب المسبق"},{date:"١٨ سبتمبر",label:"موعد الإتاحة"}].map(({date,label}) => (
                <div key={date} style={{
                  flex:1, textAlign:"center", padding:"8px 6px",
                  background:"rgba(21,94,111,0.15)",
                  border:"1px solid rgba(21,94,111,0.4)",
                  borderRadius:"10px", backdropFilter:"blur(4px)",
                }}>
                  <p style={{ color:"#fff", fontSize:"14px", fontWeight:800, margin:0 }}>{date}</p>
                  <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px", margin:"2px 0 0" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href="/smartphones/iphone-18" onClick={close} style={{
              display:"block", width:"100%", padding:"13px",
              background:"linear-gradient(135deg,#155E6F,#1F7A8C)",
              color:"#fff", textAlign:"center", textDecoration:"none",
              borderRadius:"12px", fontSize:"14px", fontWeight:800,
              boxShadow:"0 8px 28px rgba(21,94,111,0.45)", letterSpacing:"0.3px",
            }}>
              كن من الأوائل — اعرف التفاصيل
            </a>

            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.15)", fontSize:"10px", margin:"10px 0 0" }}>
              مؤسسة البلاد الحديثة للإلكترونيات
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
