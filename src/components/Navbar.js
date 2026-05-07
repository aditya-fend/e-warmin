"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/dashboard/pesan", label: "KASIR" },
  { href: "/dashboard/pesanan", label: "PESANAN" },
  { href: "/dashboard/tambah-produk", label: "PRODUK" },
  { href: "/dashboard/laporan", label: "LAPORAN" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="border-b-4 border-black sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="text-xl font-black tracking-tighter uppercase text-black"
        >
          E-WARMIN
        </Link>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded border border-black text-black transition-colors hover:bg-black hover:text-white"
        >
          <span className="sr-only">Toggle navigation</span>
          <span
            className={`block h-0.5 w-6 rounded bg-current transition-transform duration-300 ${
              menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-current transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-current transition-transform duration-300 ${
              menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {menuOpen ? (
        <div id="navbar-menu" className="border-t border-black bg-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-3 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 text-black"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 border border-transparent hover:border-black transition-none"
            >
              OUT
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
