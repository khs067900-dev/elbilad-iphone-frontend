"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "../../../components/products/types";
import PreOrderModal from "../../../components/pre-order/PreOrderModal";
import type { PreOrderProduct } from "../../../components/pre-order/PreOrderModal";
import { IoHome, IoChevronBack, IoInformationCircleOutline, IoCalendarOutline } from "react-icons/io5";
import { Icon } from "@iconify/react";

const fmt = (n: number) => n.toLocaleString("en-US");
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  if (src.startsWith("http")) {
    const idx = src.indexOf("https://", 8);
    return idx > 0 ? src.substring(idx) : src;
  }
  return `${API}${src.startsWith("/") ? src : "/" + src}`;
};

function IPhone18Card({ product, index, onReserve }: { product: Product; index: number; onReserve: (p: Product) => void }) {
  const router = useRouter();

  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = product.salePrice != null && product.salePrice !== originalPrice;
  const displayPrice = hasDiscount ? product.salePrice! : originalPrice;

  return (
    <div
      className="i18c-card cursor-pointer"
      style={{ animationDelay: `${0.05 * index}s` }}
      dir="rtl"
      onClick={() => router.push(`/product/${product._id}`)}
    >
      {/* image */}
      <div className="i18c-img-wrap">
        {resolvedImage ? (
          <Image
            src={resolvedImage}
            alt={product.name}
            fill
            className="object-contain scale-[1.35] origin-center"
            sizes="(max-width:640px) 50vw, 33vw"
          />
        ) : (
          <span className="text-5xl opacity-20">📱</span>
        )}

        {(product.discountPercent ?? 0) > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-xl shadow-md">
            <Icon icon="solar:tag-price-bold" width={10} />
            {product.discountPercent}%-
          </div>
        )}
        <div className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-xl ${product.inStock ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>
          {product.inStock ? "قريباً" : "نفذ"}
        </div>
      </div>

      {/* hint */}
      <div className="flex items-center justify-center gap-1 bg-gray-50 border-b border-gray-100 py-1">
        <IoInformationCircleOutline className="text-gray-400 text-xs" />
        <span className="text-[9px] text-gray-400">اضغط على المنتج لمعرفة التفاصيل</span>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-3 gap-1.5">
        <h3 className="text-[11px] sm:text-[13px] font-bold text-gray-800 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto">
          {hasDiscount && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-lg">وفّر {fmt(originalPrice - product.salePrice!)}</span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-black text-[#155E6F]">{fmt(displayPrice)}</span>
            <span className="text-[10px] font-semibold text-[#155E6F]/70">ر.س</span>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onReserve(product); }}
          className="w-full flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-white bg-[#1F7A8C] hover:bg-[#155E6F] rounded-xl py-2 mt-1 transition shadow-md shadow-[#1F7A8C]/30"
        >
          <IoCalendarOutline className="text-sm" />
          احجز الآن
        </button>
      </div>
    </div>
  );
}

export default function IPhone18Client({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<PreOrderProduct | null>(null);

  const handleReserve = (p: Product) => {
    setSelectedProduct({
      _id: p._id,
      name: p.name,
      image: p.images?.[0] || p.image,
      variants: p.variants,
      price: p.originalPrice ?? p.price ?? 0,
    });
  };

  return (
    <>
      <style>{`
        @keyframes i18SlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes i18CardReveal { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .i18c-card {
          display:flex; flex-direction:column;
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
          box-shadow:0 2px 8px rgba(0,0,0,.06);
          animation: i18CardReveal .45s ease forwards;
          opacity:0;
        }
        .i18c-img-wrap {
          position:relative; width:100%; padding-bottom:80%;
          background:#fff;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }
        .i18-slide-up { animation: i18SlideUp .5s ease forwards; }
        .i18-slide-up-1 { animation: i18SlideUp .5s .1s ease both; }
        .i18-slide-up-2 { animation: i18SlideUp .5s .2s ease both; }
      `}</style>

      <main className="min-h-screen" dir="rtl" style={{ background: "#f5f7f9" }}>

        {/* ── HERO ── */}
        <div className="relative overflow-hidden" style={{ height: 380 }}>
          <Image
            src="https://res.cloudinary.com/bzwltpqf/image/upload/v1789126696/deec23e7-4e69-4b8f-8b56-8900ec23bba0.webp"
            alt="iPhone 18 Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* dark overlay فقط من فوق - مش بيتلاشى للخلفية */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

          <div className="relative z-10 h-full flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {/* breadcrumb */}
            <div className="i18-slide-up flex items-center gap-1.5 text-xs sm:text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition flex items-center gap-1">
                <IoHome size={13} />الرئيسية
              </Link>
              <IoChevronBack size={11} className="text-white/30" />
              <Link href="/smartphones" className="text-white/70 hover:text-white transition">الهواتف</Link>
              <IoChevronBack size={11} className="text-white/30" />
              <span className="text-white font-semibold">iPhone 18</span>
            </div>

            {/* title bottom */}
            <div className="i18-slide-up-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-[#7dd3e8] text-xs sm:text-sm font-semibold mb-1 tracking-wide">إطلاق حصري</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  سلسلة iPhone 18
                </h1>
                <p className="text-sm text-white/60 mt-2">
                  {products.length} موديل متاح · احجز الآن قبل الإطلاق الرسمي
                </p>
              </div>
              <div className="i18-slide-up-2 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/20 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm text-white font-semibold">الحجز مفتوح الآن</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 mb-5 sm:mb-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-800">الموديلات المتاحة</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{products.length} منتج · احجز الآن وتسلّم عند الإطلاق</p>
            </div>
            <div className="h-px flex-1 mx-4 bg-gradient-to-l from-gray-200 to-transparent" />
            <span className="text-[10px] sm:text-xs font-bold text-[#1F7A8C] bg-[#1F7A8C]/10 border border-[#1F7A8C]/20 px-3 py-1.5 rounded-xl">
              iPhone 18 Series
            </span>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="max-w-6xl mx-auto px-2 sm:px-6 pb-14 sm:pb-20">
          {!products.length ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#1F7A8C]/10 flex items-center justify-center text-4xl">📦</div>
              <p className="text-gray-600 font-bold">المنتجات ستُضاف قريباً</p>
              <Link href="/" className="text-sm text-white bg-[#1F7A8C] hover:bg-[#155E6F] px-6 py-2.5 rounded-xl font-bold transition">
                ← العودة للرئيسية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5">
              {products.map((p, i) => (
                <IPhone18Card key={p._id} product={p} index={i} onReserve={handleReserve} />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <PreOrderModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
}
