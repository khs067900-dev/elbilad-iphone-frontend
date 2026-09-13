"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProductSection } from "../../../components/products/types";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useVisible();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#1F7A8C]/30 to-transparent" />
      <div className="w-2 h-2 rounded-full bg-[#1F7A8C]/40 mx-3" />
      <div className="w-16 h-1 rounded-full bg-gradient-to-l from-[#1F7A8C]/30 to-transparent" />
    </div>
  );
}

function ExpandableText({ title, desc }: { title: string; desc: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <h4 className="text-sm sm:text-lg font-black text-white mb-1 drop-shadow-lg">{title}</h4>
      {desc && (
        <>
          <p className={`text-[10px] sm:text-sm text-gray-200 leading-relaxed drop-shadow-md transition-all ${
            expanded ? "" : "line-clamp-2"
          }`}>{desc}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
            className="mt-1.5 text-[10px] sm:text-xs font-bold text-[#4dd0e8] hover:text-white transition-colors"
          >
            {expanded ? "عرض أقل ↑" : "عرض المزيد ↓"}
          </button>
        </>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   DESIGN SECTION
══════════════════════════════════════════ */
function DesignSection({ section }: { section: ProductSection }) {
  const content = section.content as {
    features: {
      id: string; label: string; title: string; image: string;
      colors?: { name: string; colorCode: string; image: string; title: string }[];
    }[];
  };
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const feature = content.features[activeIdx];
  const currentImage = feature.colors?.[selectedColorIdx]?.image ?? feature.image;

  return (
    <section className="w-full bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-6">
        <Reveal>
          <p className="text-xs font-black tracking-[0.18em] uppercase text-[#1F7A8C] mb-3">{section.title}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">نظرة عن قرب</h2>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed">كل تفصيلة صُممت بعناية لتمنحك تجربة لا مثيل لها</p>
        </Reveal>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {content.features.map((f, i) => (
              <button key={f.id} onClick={() => { setActiveIdx(i); setSelectedColorIdx(0); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  i === activeIdx
                    ? "bg-[#1F7A8C] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#1F7A8C] hover:bg-[#1F7A8C]/8"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image with overlay text */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <Reveal delay={0.05}>
          <div className="relative rounded-3xl overflow-hidden shadow-lg" style={{ aspectRatio: "4/3" }}>
            <Image
              key={currentImage}
              src={currentImage}
              alt={feature.label}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width:1024px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-3 sm:p-8">
              <span className="inline-block text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-full bg-[#1F7A8C] text-white mb-2">
                {feature.label}
              </span>
              <h3 className="text-xs sm:text-lg font-bold text-white leading-snug max-w-2xl drop-shadow-md">
                {feature.colors?.[selectedColorIdx]?.title ?? feature.title}
              </h3>
              {feature.colors && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {feature.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIdx(idx)}
                      title={c.name}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                        idx === selectedColorIdx ? "border-white scale-110 shadow-lg ring-2 ring-[#1F7A8C]" : "border-white/50 hover:border-white"
                      }`}
                      style={{ background: c.colorCode }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CAMERA SECTION
══════════════════════════════════════════ */
function CameraSection({ section }: { section: ProductSection }) {
  const content = section.content as {
    hero: { image: string; stats: { value: string; label: string }[]; description: string };
    zoomLevels: { label: string; image: string }[];
    zoomFooter: { text: string; image: string };
    lensesCard: { image: string; lenses: { name: string; model: string; specs: string[] }[] };
    proPhotos: { title: string; items: { image: string; label: string }[] };
    video: { title: string; subtitle: string; description: string; image: string };
    proVideo: { title: string; items: { image: string; label: string }[] };
  };
  const [activeZoom, setActiveZoom] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <section className="w-full bg-[#f8fafc]" dir="rtl">

      {/* Hero - صورة كاملة مع نص */}
      <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "320px" }}>
        <div className="absolute inset-0">
          <Image src={content.hero.image} alt="camera" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-10 py-10 sm:py-20 flex items-center w-full h-full absolute inset-0">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[10px] sm:text-xs font-black tracking-[0.18em] uppercase text-[#4dd0e8] mb-2">{section.title}</p>
              <h2 className="text-lg sm:text-3xl font-black text-white leading-tight mb-3">{section.subtitle}</h2>
              <p className="text-gray-200 text-xs sm:text-base leading-relaxed mb-6">{content.hero.description}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex gap-3 flex-wrap">
                {content.hero.stats.map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 min-w-[90px]">
                    <p className="text-xl sm:text-3xl font-black text-[#4dd0e8]">{s.value}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-300 mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Zoom Levels */}
      {content.zoomLevels?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <Reveal>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 text-center">فتحة العدسة المتغيرة</h3>
            <p className="text-sm text-gray-500 text-center mb-8">تكيف تلقائي لأفضل أداء في كل الظروف</p>
          </Reveal>
          <div className="flex gap-2 justify-center flex-wrap mb-8">
            {content.zoomLevels.map((z, i) => (
              <button key={z.label} onClick={() => setActiveZoom(i)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-200 ${
                  i === activeZoom
                    ? "bg-[#1F7A8C] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1F7A8C] hover:text-[#1F7A8C]"
                }`}>
                {z.label}
              </button>
            ))}
          </div>
          <Reveal delay={0.05}>
            <div className="relative rounded-3xl overflow-hidden shadow-xl max-w-3xl mx-auto" style={{ aspectRatio: "4/3" }}>
              <Image
                src={content.zoomLevels[activeZoom].image}
                alt={content.zoomLevels[activeZoom].label}
                fill className="object-cover transition-all duration-500"
                sizes="(max-width:768px) 100vw, 900px"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl">
                <span className="text-white font-black text-sm">{content.zoomLevels[activeZoom].label}</span>
              </div>
            </div>
          </Reveal>
          {content.zoomFooter && (
            <Reveal delay={0.1}>
              <p className="text-gray-500 text-sm text-center mt-6 max-w-xl mx-auto leading-relaxed">{content.zoomFooter.text}</p>
            </Reveal>
          )}
        </div>
      )}

      <SectionDivider />

      {/* Lenses */}
      {content.lensesCard && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <Reveal>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-8">ثلاث عدسات. إمكانيات لا حدود لها</h3>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#1F7A8C] text-white">
                    <th className="px-4 sm:px-6 py-3 text-xs font-black">العدسة</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-black">الموديل</th>
                    <th className="px-4 sm:px-6 py-3 text-xs font-black hidden sm:table-cell">المواصفات</th>
                  </tr>
                </thead>
                <tbody>
                  {content.lensesCard.lenses.map((lens, i) => (
                    <tr key={lens.name} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}` }>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <span className="text-xs sm:text-sm font-black text-[#1F7A8C]">{lens.name}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <span className="text-xs sm:text-sm font-bold text-gray-800">{lens.model}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top hidden sm:table-cell">
                        <ul className="space-y-1">
                          {lens.specs.map((s, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                              <span className="text-[#1F7A8C] shrink-0">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      )}

      <SectionDivider />

      {/* Pro Photos */}
      {content.proPhotos && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <Reveal>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-10">{content.proPhotos.title}</h3>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="relative rounded-3xl overflow-hidden shadow-xl mb-5" style={{ aspectRatio: "4/3" }}>
              <Image
                src={content.proPhotos.items[activePhoto].image}
                alt="" fill
                className="object-cover transition-all duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-3 sm:p-8">
                {(() => {
                  const parts = content.proPhotos.items[activePhoto].label.split(".");
                  const title = parts[0];
                  const desc = parts.slice(1).join(".").trim();
                  return <ExpandableText title={title} desc={desc} />;
                })()}
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {content.proPhotos.items.map((item, i) => (
              <button key={i} onClick={() => setActivePhoto(i)}
                className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
                  i === activePhoto ? "ring-2 ring-[#1F7A8C] scale-105" : "hover:scale-105 opacity-70 hover:opacity-100"
                }`} style={{ aspectRatio: "1/1", minHeight: "64px" }}>
                <Image src={item.image} alt="" fill className="object-cover" sizes="12vw" />
              </button>
            ))}
          </div>
        </div>
      )}

      <SectionDivider />

      {/* Video */}
      {content.video && (
        <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "280px" }}>
          <div className="absolute inset-0">
            <Image src={content.video.image} alt="video" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          </div>
          <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-10 py-8 sm:py-16 flex items-center">
            <div className="max-w-xl">
              <Reveal>
                <p className="text-[10px] sm:text-xs font-black tracking-[0.18em] uppercase text-[#4dd0e8] mb-2">{content.video.title}</p>
                <h3 className="text-base sm:text-2xl font-black text-white mb-3">{content.video.subtitle}</h3>
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">{content.video.description}</p>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      <SectionDivider />

      {/* Pro Video */}
      {content.proVideo && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <Reveal>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-10">{content.proVideo.title}</h3>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.proVideo.items.map((item, i) => {
              const title = item.label.split(".")[0];
              const desc = item.label.split(".").slice(1).join(".").trim();
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all" style={{ aspectRatio: "16/10" }}>
                    <Image src={item.image} alt={title} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-6">
                      <ExpandableText title={title} desc={desc} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════
   PERFORMANCE SECTION
══════════════════════════════════════════ */
function PerformanceSection({ section }: { section: ProductSection }) {
  const content = section.content as {
    description: string;
    chips: { name: string; description: string }[];
  };
  const media = section.media?.[0];

  return (
    <section className="w-full bg-white" dir="rtl">
      {media && (
        <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "280px" }}>
          <div className="absolute inset-0">
            <Image src={media.url} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          </div>
          <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-10 py-8 sm:py-16 flex items-end">
            <Reveal>
              <p className="text-[10px] sm:text-xs font-black tracking-[0.18em] uppercase text-[#4dd0e8] mb-1">{section.title}</p>
              <h2 className="text-base sm:text-3xl font-black text-white mb-2">{section.subtitle}</h2>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-2xl">{content.description}</p>
            </Reveal>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-right">
              <tbody>
                {content.chips.map((chip, i) => (
                  <tr key={chip.name} className={`border-b border-gray-100 last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                  }`}>
                    <td className="px-4 sm:px-6 py-4 w-2/5 sm:w-1/3 align-top">
                      <span className="text-xs sm:text-sm font-black text-[#1F7A8C] leading-snug">{chip.name}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{chip.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   BATTERY SECTION
══════════════════════════════════════════ */
function BatterySection({ section }: { section: ProductSection }) {
  const content = section.content as {
    description: string;
    stats: { value: string; unit: string; label: string }[];
  };
  const media = section.media?.[0];

  return (
    <section className="w-full bg-[#f8fafc]" dir="rtl">
      {media && (
        <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "280px" }}>
          <div className="absolute inset-0">
            <Image src={media.url} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20" />
          </div>
          <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-10 py-8 sm:py-16 flex flex-col items-center justify-end text-center">
            <Reveal>
              <p className="text-[10px] sm:text-xs font-black tracking-[0.18em] uppercase text-[#4dd0e8] mb-1">{section.title}</p>
              <h2 className="text-base sm:text-3xl font-black text-white mb-2">{section.subtitle}</h2>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">{content.description}</p>
            </Reveal>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-right">
              <tbody>
                {content.stats.map((s, i) => (
                  <tr key={i} className={`border-b border-gray-100 last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                  }`}>
                    <td className="px-4 sm:px-6 py-4 w-2/5 sm:w-1/3 align-middle">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-[#1F7A8C]">{s.value}</span>
                        <span className="text-xs font-bold text-gray-500">{s.unit}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{s.label}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SPEC GROUPS
══════════════════════════════════════════ */
/* REMOVED */

/* ══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════ */
/* REMOVED */

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
interface IPhone18SectionsProps {
  sections?: ProductSection[];
  gallery?: { url: string; caption: string }[];
  specGroups?: { group: string; items: { key: string; value: string }[] }[];
}

export default function IPhone18Sections({ sections, gallery, specGroups }: IPhone18SectionsProps) {
  if (!sections?.length) return null;

  const activeSections = (sections ?? [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="w-full mt-8 overflow-hidden rounded-3xl border border-gray-100 shadow-lg" dir="rtl">
      {activeSections.map((section, idx) => (
        <div key={section.type}>
          {idx > 0 && <SectionDivider />}
          {section.type === "design" && <DesignSection section={section} />}
          {section.type === "camera" && <CameraSection section={section} />}
          {section.type === "performance" && <PerformanceSection section={section} />}
          {section.type === "battery" && <BatterySection section={section} />}
        </div>
      ))}
    </div>
  );
}
