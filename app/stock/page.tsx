/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function StockPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [restockForm, setRestockForm] = useState({
    productId: "",
    quantity: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  if (!API) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  // LOAD STOCK
  const loadStock = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/Products`);

      console.log("API URL:", API);
      console.log("STATUS:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setStock(data || []);
    } catch (err) {
      console.error("Error loading stock:", err);
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    const fetchStock = async () => {
      await loadStock();
    };

    fetchStock();
  }, [loadStock]);

  // ADD STOCK
  const addStock = async () => {
    if (!restockForm.productId || !restockForm.quantity) return;

    try {
      const res = await fetch(
        `${API}/api/Products/${restockForm.productId}/add-stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Number(restockForm.quantity)),
        }
      );

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RESPONSE:", text);

      if (!res.ok) {
        alert("Failed: " + text);
        return;
      }

      setRestockForm({
        productId: "",
        quantity: "",
      });

      await loadStock();
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  // SEARCH FILTER
  const filteredStock = stock.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Stock Management
      </h1>

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border p-4 mb-4 rounded">
        <h2 className="font-semibold mb-3">Restock Product</h2>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="border p-2"
            placeholder="Product ID"
            value={restockForm.productId}
            onChange={(e) =>
              setRestockForm({
                ...restockForm,
                productId: e.target.value,
              })
            }
          />

          <input
            className="border p-2"
            type="number"
            min="1"
            placeholder="Quantity"
            value={restockForm.quantity}
            onChange={(e) =>
              setRestockForm({
                ...restockForm,
                quantity: e.target.value,
              })
            }
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
              filteredStock.map((item: any) => {
                const quantity = Number(item.quantityInStock) || 0;
                const price = Number(item.price) || 0;

                return (
                  <tr key={item.id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{quantity}</td>
                    <td className="border p-2">{price}</td>
                    <td className="border p-2">
                      {(quantity * price).toFixed(2)}
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