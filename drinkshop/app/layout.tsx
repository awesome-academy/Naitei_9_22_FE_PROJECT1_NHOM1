import type { Metadata } from "next";
import { Geist, Geist_Mono, Gideon_Roman } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const gideonRoman = Gideon_Roman({
  variable: "--font-gideon-roman",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Wine House - Cửa hàng rượu vang hàng đầu",
  description:
    "Wine House cung cấp các loại rượu vang chất lượng cao từ khắp nơi trên thế giới",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gideonRoman.variable} antialiased`}
      >
        <div className="font-roman">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
