"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LaporanPage() {
  const [orders, setOrders] = useState([]);
  const [filterDays, setFilterDays] = useState("0"); // Default: Hari Ini (0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filterDays]);

  const fetchOrders = async () => {
    setLoading(true);
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // Jika filter > 0, kurangi hari dari sekarang
    if (filterDays !== "0") {
      startDate.setDate(startDate.getDate() - parseInt(filterDays));
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "selesai")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    setLoading(false);
  };

  // Fungsi Export ke CSV (Format yang paling mudah di-import ke Google Sheets)
  const exportToCSV = () => {
    if (orders.length === 0) return alert("TIDAK ADA DATA UNTUK DIEXPORT");

    const totalPendapatan = orders.reduce((acc, curr) => acc + curr.total_price, 0);

    const headers = ["Waktu", "ID Pesanan", "Total Harga (Rp)", "Detail Pesanan"];
    
    const rows = orders.map((o) => [
      `"${new Date(o.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}"`,
      `"#${o.id.slice(0, 8).toUpperCase()}"`,
      o.total_price,
      `"${o.items.map((i) => `${i.name} (${i.qty})`).join(" | ")}"`,
    ]);

    // Tambahkan baris total
    const footerRows = [
      ["", "", "", ""], // Baris kosong
      ["TOTAL PENDAPATAN", "", totalPendapatan, ""],
      ["Jumlah Transaksi", "", orders.length, ""],
    ];

    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows, ...footerRows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_warmin_${filterDays}_hari.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans uppercase p-6">
      {/* HEADER & FILTER */}
      <div className="border-b-4 border-black pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">DATA PESANAN SELESAI</h1>
          <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">REKAPITULASI TRANSAKSI TERMINAL</p>
        </div>

        <div className="flex justify-between gap-2">
          <select 
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            className="border-2 border-black p-2 text-xs font-black bg-white focus:outline-none"
          >
            <option value="0">HARI INI</option>
            <option value="7">7 HARI TERAKHIR</option>
            <option value="30">30 HARI TERAKHIR</option>
            <option value="90">90 HARI TERAKHIR</option>
            <option value="360">1 TAHUN TERAKHIR</option>
          </select>
          
          <button 
            onClick={exportToCSV}
            className="bg-black text-white px-4 py-2 text-xs font-black hover:bg-gray-800 transition-none border-2 border-black"
          >
            EXPORT CSV / GOOGLE SHEET
          </button>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="border-2 border-black overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-black font-black uppercase">
              <th className="p-4">WAKTU DETAIL</th>
              <th className="p-4">ID TRANSAKSI</th>
              <th className="p-4">DETAIL ITEM</th>
              <th className="p-4 text-right">TOTAL (RP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {orders.map((order) => {
              const d = new Date(order.created_at);
              // Format: Jam, Hari, Tanggal, Bulan, Tahun
              const fullDate = d.toLocaleDateString("id-ID", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Jakarta'
              });
              const fullTime = d.toLocaleTimeString("id-ID", {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta'
              });

              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 leading-tight">
                    <span className="font-black block text-[12px]">{fullTime}</span>
                    <span className="text-gray-500 font-bold">{fullDate}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="p-4 font-bold">
                    {order.items.map((item, i) => (
                      <span key={i} className="inline-block bg-gray-100 px-1 mr-1 mb-1 border border-gray-300">
                        {item.name} x{item.qty}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-right font-mono font-black text-[13px]">
                    {order.total_price.toLocaleString("id-ID")}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {orders.length > 0 && (
            <tfoot className="border-t-4 border-black">
              <tr className="bg-black text-white font-black uppercase">
                <td colSpan="3" className="p-4 text-right text-[10px] tracking-widest">
                  TOTAL PENDAPATAN ({orders.length} TRANSAKSI)
                </td>
                <td className="p-4 text-right font-mono text-[15px]">
                  RP {orders.reduce((acc, curr) => acc + curr.total_price, 0).toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
        
        {orders.length === 0 && !loading && (
          <div className="p-20 text-center font-black text-gray-300 tracking-widest uppercase">
            TIDAK ADA DATA PADA PERIODE INI
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <span>Sistem Otomatis Export Aktif (24 Jam)</span>
        <span>Total Terfilter: {orders.length} Transaksi</span>
      </div>
    </div>
  );
}