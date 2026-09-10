import { Banner } from "./components/banner";
import { ProductGrid } from "./components/products";
import CustomerReviews from "./components/CustomerReviews";
import ShopByCategory from "./components/ShopByCategory";
import {
  getCachedProducts,
  getCachedHomeConfig,
  getCachedBannerMap,
  getCachedCompany,
} from "./lib/products-cache";

// ISR: revalidate every 60s — driven by the shortest-lived cache (products)
// Individual data sources use their own longer TTLs via unstable_cache
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://albilaad-ksa.com";

export default async function Home() {
  // All parallel — no waterfall at this level
  const [products, homeConfig, company] = await Promise.all([
    getCachedProducts(),
    getCachedHomeConfig(),
    getCachedCompany(),
  ]);

  // bannerMap depends on products categories — unavoidable sequential step,
  // but getCachedBannerMap is itself cached so the DB hit is rare
  const categories = [
    ...new Set(
      (products as { category?: string }[])
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ] as string[];
  const bannerMap = await getCachedBannerMap(categories.join(","));

  const siteName = company.nameAr || "مؤسسة البلاد الحديثة للإلكترونيات";
  const logoUrl = company.logo
    ? company.logo.startsWith("http")
      ? company.logo
      : `${process.env.BACKEND_URL || "http://localhost:5000"}${company.logo}`
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: company.nameEn || "Al Bilad Modern Electronics",
    url: SITE_URL,
    logo: logoUrl,
    contactPoint: [
      company.phone && {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
      company.whatsapp && {
        "@type": "ContactPoint",
        telephone: company.whatsapp,
        contactType: "sales",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
    ].filter(Boolean),
    address: company.addressAr
      ? {
          "@type": "PostalAddress",
          addressLocality: company.addressAr,
          addressCountry: "SA",
        }
      : undefined,
    email: company.email || undefined,
    sameAs: company.website ? [company.website] : [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #d4ece8 0%, #e2f3f0 20%, #edf7f5 45%, #f5fbf9 70%, #ffffff 100%)",
        }}
      >
        <Banner />
        {/* Pass homeConfig + categories to avoid duplicate home-settings fetch */}
        <ShopByCategory homeConfig={homeConfig} categories={categories} />
        <ProductGrid products={products} homeConfig={homeConfig} bannerMap={bannerMap} />
        <CustomerReviews />
      </main>
    </>
  );
}
