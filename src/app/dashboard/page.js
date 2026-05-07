"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ makanan: 0, minuman: 0, snack: 0, total: 0 });
  const [filterDays, setFilterDays] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filterDays]);

  const fetchData = async () => {
    setLoading(true);
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (filterDays !== "0") {
      startDate.setDate(startDate.getDate() - parseInt(filterDays));
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    const s = data.reduce(
      (acc, curr) => {
        acc.total += curr.total_price;
        if (curr.category === "makanan") acc.makanan += curr.total_price;
        if (curr.category === "minuman") acc.minuman += curr.total_price;
        if (curr.category === "snack") acc.snack += curr.total_price;
        return acc;
      },
      { makanan: 0, minuman: 0, snack: 0, total: 0 }
    );
    setStats(s);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b-2 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">E-WARMIN</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">Terminal Ngulonsitik / Dashboard</p>
        </div>
        
        <div className="flex flex-col items-end">
          <label className="text-[9px] font-bold uppercase mb-1">Filter Periode</label>
          <select 
            className="bg-white border-2 border-black px-3 py-1 text-xs font-bold uppercase focus:ring-0 appearance-none cursor-pointer hover:bg-gray-50"
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
          >
            <option value="0">Hari Ini</option>
            <option value="7">1 Minggu</option>
            <option value="30">1 Bulan</option>
            <option value="360">1 Tahun</option>
          </select>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black divide-x-0 sm:divide-x-2 divide-y-2 sm:divide-y-0 divide-black">
        {[
          { label: "Makanan", value: stats.makanan },
          { label: "Minuman", value: stats.minuman },
          { label: "Snack", value: stats.snack },
          { label: "Total Pendapatan", value: stats.total, highlight: true },
        ].map((item, i) => (
          <div key={i} className={`p-6 ${item.highlight ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <p className={`text-[10px] uppercase font-black mb-2 ${item.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
            <p className="text-2xl font-mono font-bold leading-none">
              {item.value.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      {/* LOG SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black"></div>
          <h2 className="text-xs font-black uppercase tracking-widest text-black">10 Log Transaksi Terakhir</h2>
        </div>
        
        <div className="border-2 border-black overflow-hidden">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black font-black uppercase">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Total (Rp)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-none">
                  <td className="py-3 px-4 font-medium">{new Date(order.created_at).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Jakarta'})}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-4 uppercase font-bold text-[10px]">{order.category || "Umum"}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">{order.total_price.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block border-2 px-2 py-0.5 font-black text-[9px] uppercase ${
                      order.status === 'selesai' ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && (
            <div className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Belum ada aktivitas transaksi</div>
          )}
        </div>
      </div>
    </div>
  );
}