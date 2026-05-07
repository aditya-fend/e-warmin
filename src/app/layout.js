import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import PWARegistration from "@/components/PWARegistration";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#000000",
};

export const metadata = {
  title: "e-warmin | Terminal",
  description: "Sistem Kasir Minimalis",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "E-Warmin",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <PWARegistration />
        <div className="flex flex-col min-h-screen">
          {/* NAVBAR UTAMA */}
          <Navbar />

          {/* AREA KONTEN */}
          <main className="flex-1 max-w-screen-xl w-full mx-auto border-x-2 border-black border-opacity-5">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
