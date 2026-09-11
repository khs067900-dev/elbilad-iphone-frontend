import ComingSoon from "../../../components/ComingSoon";
import SmartphonesClient from "../SmartphonesClient";
import { getCachedProducts } from "../../../lib/products-cache";

export const revalidate = 3600;

const RESERVATION_DATE = new Date(
  process.env.NEXT_PUBLIC_IPHONE18_RESERVATION_DATE ?? "2026-09-12T23:00:00+03:00"
);

const SLIDES = [
  "/e5ae006f-b733-41d4-9e48-69994eeacbe4.webp",
  "/df3a0f08-fb1c-4b40-863c-58f8f562805d.webp",
  "/fe7ec25b-bb16-4ae3-ab3f-bdc18111d748.webp",
];

const KEYWORDS = ["ايفون 18", "iphone 18", "iPhone 18"];

export default async function IPhone18Page() {
  const isOver = Date.now() >= RESERVATION_DATE.getTime();

  if (!isOver) {
    return <ComingSoon modelName="iPhone 18" slides={SLIDES} />;
  }

  const allProducts = await getCachedProducts();
  const products = allProducts.filter((p: { category?: string; name?: string }) =>
    KEYWORDS.some((kw) => p.category?.toLowerCase().includes(kw.toLowerCase()) || p.name?.toLowerCase().includes(kw.toLowerCase()))
  );

  return <SmartphonesClient initialProducts={products} />;
}
