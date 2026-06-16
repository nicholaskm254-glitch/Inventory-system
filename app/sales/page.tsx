/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function SalesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    productId: "",
    QuantityInStock: "",
  });

  // 🔹 LOAD DATA
  const loadData = async () => {
    try {
      setLoading(true);

      const [productsRes, salesRes] = await Promise.all([
        fetch("http://localhost:5148/api/products"),
        fetch("http://localhost:5148/api/sales"),
      ]);

      const productsData = await productsRes.json();
      const salesData = await salesRes.json();

      console.log("PRODUCTS:", productsData);
      console.log("SALES:", salesData);

      setProducts(productsData || []);
      setSales(salesData || []);
    } catch (err) {
      console.log("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  // 🔥 RECORD SALE
  const recordSale = async () => {
    if (!form.productId || !form.QuantityInStock) return;

    try {
      const res = await fetch("http://localhost:5148/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number(form.productId),
          quantity: Number(form.QuantityInStock),
        }),
      });

      const result = await res.text();
      console.log("SALE RESPONSE:", result);

      setForm({ productId: "", QuantityInStock: "" });

      await loadData();
    } catch (err) {
      console.log("Error recording sale:", err);
    }
  };

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mb-6">Sales Entry</h1>

      {/* FORM */}
      <div className="bg-background p-4 rounded mb-6">
        <select
  className="border p-2 w-full mb-3 text-black bg-white"
  value={form.productId}
  onChange={(e) =>
    setForm({ ...form, productId: e.target.value })
  }
>
  <option value="">Select Product</option>

  {products.map((p: any) => (
    <option key={p.id} value={p.id}>
      {p.name} (Stock: {p.quantityInStock})
    </option>
  ))}
</select>

        <input
          type="number"
          placeholder="Quantity Sold"
          className="border p-2 w-full mb-3"
          value={form.QuantityInStock}
          onChange={(e) =>
            setForm({ ...form, QuantityInStock: e.target.value })
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
        <table className="w-full border">
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
              sales.map((s: any) => (
                <tr key={s.id}>
                  <td className="border p-2">
                    {s.productName || s.productId}
                  </td>
                  <td className="border p-2">{s.quantity}</td>
                  <td className="border p-2">{s.type}</td>
                  <td className="border p-2">
                    {s.date
                      ? new Date(s.date).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}