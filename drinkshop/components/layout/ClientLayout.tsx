"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";
import { Toaster } from "sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { hideHeaderFooter } = useLayout();

  // Hide Header and Footer for admin pages or when explicitly set (for 404)
  const shouldHideHeaderFooter =
    pathname?.startsWith("/admin") || hideHeaderFooter;

  return (
    <UserProvider>
      <CartProvider>
        {!shouldHideHeaderFooter && <Header />}
        <Toaster position="top-right" richColors />
        <div className={shouldHideHeaderFooter ? "" : "px-72"}>{children}</div>
        {!shouldHideHeaderFooter && <Footer />}
      </CartProvider>
    </UserProvider>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}
