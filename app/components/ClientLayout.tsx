"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import WhatsappButton from "./WhatsappButton";
import SplashScreen from "./SplashScreen";
import IPhone18Popup from "./IPhone18Popup";

export default function ClientLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/invoice");

  return (
    <>
      {!isAdmin && <SplashScreen />}
      {!isAdmin && <IPhone18Popup />}
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && footer}
      {!isAdmin && <WhatsappButton />}
    </>
  );
}
