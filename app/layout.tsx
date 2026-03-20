import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urbano Reformas - Gestión ERP",
  description: "Software de gestión para empresas de reformas e interiorismo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] bg-slate-50`}>
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 md:p-10">
            {children}
          </main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
