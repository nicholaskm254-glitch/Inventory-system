/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function SalesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  // 🔥 LOAD PRODUCTS + SALES
  const loadData = useCallback(async () => {
    if (!API) return;

    try {
      setLoading(true);

      const [productsRes, salesRes] = await Promise.all([
        fetch(`${API}/api/Products`),
        fetch(`${API}/api/Sales`),
      ]);

      if (!productsRes.ok || !salesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const productsData = await productsRes.json();
      const salesData = await salesRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    if (!API) return;

    void Promise.resolve().then(loadData);
  }, [loadData, API]);

  // 🔥 RECORD SALE
  const recordSale = async () => {
    if (!API || !form.productId || !form.quantity) return;

    try {
      const res = await fetch(`${API}/api/Sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number(form.productId),
          quantity: Number(form.quantity),
        }),
      });

      const text = await res.text();
      console.log("SALE RESPONSE:", text);

      if (!res.ok) {
        alert("Failed to record sale");
        return;
      }

      setForm({ productId: "", quantity: "" });

      await loadData();
    } catch (err) {
      console.error("Error recording sale:", err);
    }
  };

  return (
    <div className="min-h-screen sm:px-6 lg:px-10">
  <div className="max-w-7xl mx-auto">   
       <HamburgerMenu />

      <h1 className="text-3xl font-bold mb-6">Sales Entry</h1>

      {/* FORM */}
      <div className="p-4 border rounded mb-6">
        <select
          className="border p-2 w-full mb-3"
          value={form.productId}
          onChange={(e) =>
            setForm({ ...form, productId: e.target.value })
          }
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.quantityInStock})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity Sold"
          className="border p-2 w-full mb-3"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <button
          onClick={recordSale}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Record Sale
        </button>
      </div>

      {/* TABLE */}
      <h2 className="text-xl font-bold mb-3">Recent Sales</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
  <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No sales recorded
                </td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">
                    {s.productName ?? s.productId}
                  </td>
                  <td className="border p-2">{s.quantity}</td>
                  <td className="border p-2">{s.type}</td>
                  <td className="border p-2">
                    {s.date ? new Date(s.date).toLocaleString() : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
    </div>
  );
}