import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
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
          <nav className="border-b-4 border-black sticky top-0 bg-white z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
              <Link href="/dashboard" className="text-xl font-black tracking-tighter uppercase text-black">
                E-WARMIN
              </Link>
              
              <div className="flex gap-6 items-center">
                <Link 
                  href="/dashboard/pesan" 
                  className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
                >
                  KASIR
                </Link>
                <Link 
                  href="/dashboard/pesanan" 
                  className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
                >
                  PESANAN
                </Link>
                <Link 
                  href="/dashboard/tambah-produk" 
                  className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
                >
                  PRODUK
                </Link>
                <Link 
                  href="/dashboard/laporan" 
                  className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
                >
                  LAPORAN
                </Link>
                <div className="h-4 w-[2px] bg-black"></div>
                <button className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 border border-transparent hover:border-black transition-none">
                  OUT
                </button>
              </div>
            </div>
          </nav>

          {/* AREA KONTEN */}
          <main className="flex-1 max-w-screen-xl w-full mx-auto border-x-2 border-black border-opacity-5">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}