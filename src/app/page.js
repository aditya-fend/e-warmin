"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Kita asumsikan username dikonversi ke format email yang kita buat di SQL sebelumnya
    // warmin -> warmin@example.com
    const emailFormatted = `${username.toLowerCase()}@example.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailFormatted,
      password: password,
    });

    if (error) {
      alert("Akses Ditolak: Nama atau Password salah.");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-bold mb-1 text-center tracking-tighter">E-WARMIN</h1>
        <p className="text-center text-[10px] text-gray-400 mb-8 tracking-[0.2em] uppercase">Sistem Kasir Terminal</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-bold text-black mb-1">Nama Operator</label>
            <input
              type="text"
              required
              spellCheck="false"
              className="w-full border border-black px-3 py-2 focus:outline-none  rounded-none text-sm"
              placeholder="CONTOH: WARMIN"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-black mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-black px-3 py-2 focus:outline-none focus:bg-gray-50 rounded-none text-sm"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 font-bold text-xs tracking-widest hover:invert disabled:bg-gray-300 transition-none"
          >
            {loading ? "PROSES..." : "MASUK KE SISTEM"}
          </button>
        </form>
      </div>
      <p className="mt-8 text-[9px] text-gray-400 uppercase tracking-[0.3em]">Otoritas Terminal Ngulonsitik</p>
    </div>
  );
}