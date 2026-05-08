"use client";

import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/dashboard/pesan", label: "KASIR" },
  { href: "/dashboard/pesanan", label: "PESANAN" },
  { href: "/dashboard/tambah-produk", label: "TAMBAH" },
  { href: "/dashboard/laporan", label: "LAPORAN" },
];

export default function Navbar() {
  return (
    <nav className="border-b-4 border-black sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4">
        <div className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
