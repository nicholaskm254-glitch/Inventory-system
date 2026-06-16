/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function StockPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [restockForm, setRestockForm] = useState({
  productId: "",
  quantity: ""
});
const loadStock = async () => {
  try {
    const res = await fetch("http://localhost:5148/api/products");
    const data = await res.json();
    setStock(data);
  } catch (err) {
    console.log("Error loading stock:", err);
  } finally {
    setLoading(false);
  }
};

const addStock = async () => {
  if (!restockForm.productId || !restockForm.quantity) return;

  await fetch(`http://localhost:5148/api/products/${restockForm.productId}/add-stock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Number(restockForm.quantity)),
  });

  setRestockForm({ productId: "", quantity: "" });

  await loadStock(); // refresh table
};

  // 🔹 LOAD STOCK FROM API
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStock();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // 🔹 SEARCH FILTER
  const filteredStock = stock.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Stock Management
      </h1>

      {/* SEARCH */}
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* RESTOCK FORM */}
      <div className="border p-4 mb-4 rounded">
        <h2 className="font-semibold mb-3">Restock Product</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="border p-2"
            placeholder="Product ID"
            value={restockForm.productId}
            onChange={(e) => setRestockForm({ ...restockForm, productId: e.target.value })}
          />
          <input
            className="border p-2"
            type="number"
            min="1"
            placeholder="Quantity"
            value={restockForm.quantity}
            onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
          />
          <button
            type="button"
            className="bg-blue-600 text-white p-2 rounded"
            onClick={addStock}
          >
            Add Stock
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading stock...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total Value</th>
            </tr>
          </thead>

          <tbody>
            {filteredStock.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No stock found
                </td>
              </tr>
            ) : (
              filteredStock.map((item) => {
                const quantityInStock = Number(item.quantityInStock) || 0;
                const price = Number(item.price) || 0;

                return (
                  <tr key={item.id}>
                    <td className="border p-2">
                      {item.name}
                    </td>

                    <td className="border p-2">
                      {quantityInStock}
                    </td>

                    <td className="border p-2">
                      {price}
                    </td>

                    <td className="border p-2">
                      {quantityInStock * price}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}