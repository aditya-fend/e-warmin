"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AntreanPesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Opsional: Setup realtime subscription agar order baru muncul otomatis
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "proses")
      .order("created_at", { ascending: true }); // Paling lama di atas

    if (!error) setOrders(data);
    setLoading(false);
  };

  const markAsSelesai = async (id) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "selesai" })
      .eq("id", id);

    if (!error) {
      // Hapus dari state lokal agar langsung hilang dari UI tanpa refresh total
      setOrders(orders.filter((order) => order.id !== id));
    } else {
      alert("Gagal memperbarui status");
    }
    console.log("Mark as selesai:", id, "Error:", error);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans uppercase p-6 space-y-8">
      {/* HEADER */}
      <div className="border-b-4 border-black pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">ANTREAN PESANAN</h1>
          <p className="text-[10px] font-bold text-gray-500 tracking-[0.3em]">STATUS: PROSES (DALAM PENGERJAAN)</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black bg-black text-white px-2 py-1">
            TOTAL ANTREAN: {orders.length}
          </span>
        </div>
      </div>

      {/* GRID PESANAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border-2 border-black flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* HEADER KARTU */}
            <div className="bg-gray-100 border-b-2 border-black p-3 flex justify-between items-center">
              <span className="font-mono font-black text-xs">#{order.id.slice(0, 8)}</span>
              <span className="text-[10px] font-bold text-gray-600">
                {new Date(order.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })}
              </span>
            </div>

            {/* LIST PRODUK */}
            <div className="p-4 flex-1 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-black">{item.name}</span>
                    <span className="text-[9px] text-gray-500 italic">RP {item.price.toLocaleString("id-ID")}</span>
                  </div>
                  <span className="font-mono font-black text-sm text-black">x{item.qty}</span>
                </div>
              ))}
            </div>

            {/* TOTAL HARGA */}
            <div className="p-3 bg-gray-50 border-t border-black flex justify-between items-center">
              <span className="text-[9px] font-black opacity-60">TOTAL</span>
              <span className="font-mono font-black text-sm">
                RP {order.total_price.toLocaleString("id-ID")}
              </span>
            </div>

            {/* AKSI */}
            <button
              onClick={() => markAsSelesai(order.id)}
              className="w-full bg-black text-white py-4 font-black text-xs tracking-[0.2em] hover:bg-gray-800 transition-none"
            >
              SELESAIKAN PESANAN
            </button>
          </div>
        ))}

        {orders.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-400 font-black text-xs tracking-widest uppercase">
              SEMUA PESANAN TELAH DISELESAIKAN / TIDAK ADA ANTREAN
            </p>
          </div>
        )}
      </div>
    </div>
  );
}