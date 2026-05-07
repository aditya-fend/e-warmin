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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-[10px_10px_0px_0px_rgba(15,23,42,0.08)]">
        <h1 className="text-2xl font-bold mb-1 text-center tracking-tighter">
          E-WARMIN
        </h1>
        <p className="text-center text-[10px] text-slate-500 mb-8 tracking-[0.2em] uppercase">
          Sistem Kasir Terminal
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1">
              Nama Operator
            </label>
            <input
              type="text"
              required
              spellCheck="false"
              className="w-full border border-slate-300 bg-slate-50 px-3 py-2 focus:outline-none focus:border-slate-900 focus:bg-white rounded-none text-sm"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-900 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-slate-300 bg-slate-50 px-3 py-2 focus:outline-none focus:border-slate-900 focus:bg-white rounded-none text-sm"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 font-bold text-xs tracking-widest hover:bg-slate-700 disabled:bg-slate-300 transition-none"
          >
            {loading ? "PROSES..." : "MASUK KE SISTEM"}
          </button>
        </form>
      </div>
      <p className="mt-8 text-[9px] text-slate-500 uppercase tracking-[0.3em]">
        Otoritas Terminal Ngulonsitik
      </p>
    </div>
  );
}
