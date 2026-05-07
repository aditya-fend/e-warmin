"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ManajemenProdukPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("makanan");
  const [loading, setLoading] = useState(false);
  
  // State untuk mode edit
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { name, price: parseInt(price), category };

    if (editId) {
      // LOGIKA UPDATE
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editId);
      
      if (!error) {
        setEditId(null);
        resetForm();
      } else {
        alert("Gagal update: " + error.message);
      }
    } else {
      // LOGIKA INSERT
      const { error } = await supabase
        .from("products")
        .insert([payload]);

      if (!error) {
        resetForm();
      } else {
        alert("Gagal simpan: " + error.message);
      }
    }

    fetchProducts();
    setLoading(false);
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    window.scrollTo(0, 0); // Gulir ke atas agar form terlihat
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice("");
    setCategory("makanan");
  };

  const deleteProduct = async (id) => {
    if (confirm("Hapus produk ini secara permanen?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 space-y-10 font-sans uppercase">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
        <Link href="/dashboard" className="text-[10px] font-black hover:bg-black hover:text-white px-2 py-1 border border-black transition-none">
          ← KEMBALI
        </Link>
        <h1 className="text-2xl font-black tracking-tighter">DATA PRODUK</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FORM SECTION */}
        <div className="lg:col-span-1">
          <div className="border-2 border-black p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xs font-black tracking-widest border-b border-black pb-2">
              {editId ? "MODE UBAH DATA" : "INPUT PRODUK BARU"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black mb-1">NAMA ITEM</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-black p-2 text-sm focus:bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black mb-1">HARGA SATUAN</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-black p-2 text-sm font-mono focus:bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black mb-1">KATEGORI</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-black p-2 text-sm font-black focus:bg-gray-100 outline-none"
                >
                  <option value="makanan">MAKANAN</option>
                  <option value="minuman">MINUMAN</option>
                  <option value="snack">SNACK</option>
                  <option value="gorengan">GORENGAN</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black text-white p-3 font-black text-xs hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {loading ? "PROSES..." : editId ? "UPDATE" : "SIMPAN"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border-2 border-black p-3 font-black text-xs hover:bg-gray-100"
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-[11px] border-2 border-black border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-3">ITEM</th>
                <th className="p-3">KATEGORI</th>
                <th className="p-3 text-right">HARGA (RP)</th>
                <th className="p-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {products.map((p) => (
                <tr key={p.id} className={editId === p.id ? "bg-yellow-50" : "bg-white"}>
                  <td className="p-3 font-black">{p.name}</td>
                  <td className="p-3 text-gray-500 font-bold">{p.category}</td>
                  <td className="p-3 text-right font-mono font-bold">
                    {p.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="border border-black px-2 py-1 font-black hover:bg-black hover:text-white transition-none"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="border border-black px-2 py-1 font-black text-red-600 hover:bg-red-600 hover:text-white transition-none"
                    >
                      HAPUS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}