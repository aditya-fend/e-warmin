"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PesanPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // Format: { productId: quantity }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (data) setProducts(data);
  };

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const updateCart = (id, delta) => {
    setCart((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = products.find((p) => p.id === id);
      return total + (product?.price || 0) * qty;
    }, 0);
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) return;
    setLoading(true);

    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((prod) => prod.id === id);
      return { id, name: p.name, qty, price: p.price };
    });

    const { error } = await supabase.from("orders").insert([
      {
        items: orderItems,
        total_price: calculateTotal(),
        status: "proses",
        created_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      setCart({});
    } else {
      alert("GAGAL: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans uppercase flex flex-col">
      {/* 1. INPUT SEARCH (STIKY TOP) */}
      <div className="sticky top-0 bg-white border-b-4 border-black p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-4 items-center">
          <input
            type="text"
            placeholder="CARI MENU (MISAL: NASI)..."
            className="w-full border-2 border-black p-3 text-sm font-bold focus:outline-none focus:bg-gray-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 2. TABEL MENU */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-4xl mx-auto border-2 border-black overflow-hidden">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black text-left">
                <th className="p-3 font-black">PRODUK</th>
                <th className="p-3 text-right">HARGA</th>
                <th className="p-3 text-center">JUMLAH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-black">{p.name}</div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {p.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => updateCart(p.id, -1)}
                        className="w-8 h-8 border-2 border-black font-black hover:bg-black hover:text-white transition-none"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-sm w-4 text-center">
                        {cart[p.id] || 0}
                      </span>
                      <button
                        onClick={() => updateCart(p.id, 1)}
                        className="w-8 h-8 border-2 border-black font-black hover:bg-black hover:text-white transition-none"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-10 text-center font-bold text-gray-400">
              MENU TIDAK DITEMUKAN
            </div>
          )}
        </div>
      </div>

      {/* 3. STICKY BOTTOM (TOTAL & CHECKOUT) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-6 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest">
              TOTAL PEMBAYARAN
            </p>
            <p className="text-2xl font-mono font-black">
              RP {calculateTotal().toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={Object.keys(cart).length === 0 || loading}
            className="bg-white text-black px-8 py-3 font-black text-sm tracking-tighter hover:bg-gray-200 disabled:bg-gray-600 transition-none border-2 border-white"
          >
            {loading ? "PROSES..." : "BUAT PESANAN →"}
          </button>
        </div>
      </div>
    </div>
  );
}
