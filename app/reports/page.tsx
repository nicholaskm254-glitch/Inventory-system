/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ReportsPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  // 🔹 LOAD DATA FROM API
  useEffect(() => {
    let isCancelled = false;

    const fetchReports = async () => {
      try {
        const [stockRes, salesRes] = await Promise.all([
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Products`),
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Sales`),
]);

        const stockData = await stockRes.json();
        const salesData = await salesRes.json();

        if (!isCancelled) {
          setStock(stockData);
          setSales(salesData);
        }
      } catch (err) {
        console.log("Reports error:", err);
      }
    };

    fetchReports();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 🔹 TOTAL ITEMS SOLD
  const totalItemsSold = sales.reduce(
  (sum, item) => sum + (Number(item.quantity) || 0),
  0
);
  // 🔹 TOTAL STOCK VALUE
  const totalStockValue = stock.reduce(
  (sum, item) =>
    sum +
    (Number(item.quantityInStock) || 0) *
    (Number(item.price) || 0),
  0
);

  // 🔹 TOTAL REVENUE
  const totalRevenue = sales.reduce(
  (sum, sale) =>
    sum +
    (Number(sale.quantity) || 0) *
    (Number(sale.price) || 0),
  0
);
  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Reports Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-background shadow p-4 rounded">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold">
            KES {totalRevenue}
          </p>
        </div>

        <div className="bg-background shadow p-4 rounded">
          <h2 className="text-gray-500">Items Sold</h2>
          <p className="text-2xl font-bold">
            {totalItemsSold}
          </p>
        </div>

        <div className="bg-background shadow p-4 rounded">
          <h2 className="text-gray-500">Stock Value</h2>
          <p className="text-2xl font-bold">
            KES {totalStockValue}
          </p>
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="bg-background mb-6">
        <h2 className="p-4 font-bold border-b">
          Recent Sales
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
              <tr key={sale.id}>
  <td className="border p-2">{sale.productName}</td>
  <td className="border p-2">{sale.quantity}</td>

<td className="border p-2">
  <span
    className={
      sale.type?.toUpperCase() === "SALE"
        ? "bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
        : "bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
    }
  >
    {sale.type?.toUpperCase() === "SALE" ? (
      <>
        <span>📉</span> SALE
      </>
    ) : (
      <>
        <span>📈</span> RESTOCK
      </>
    )}
  </span>
</td>

  <td className="border p-2">{sale.price}</td>
</tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* STOCK TABLE */}
      <div className="bg-background shadow rounded">
        <h2 className="p-4 font-bold border-b">
          Current Stock
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Total Value</th>
            </tr>
          </thead>

          <tbody>
            {stock.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No stock found
                </td>
              </tr>
            ) : (
              stock.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    {item.name}
                  </td>
                  <td className="border p-2">
                    
                     {item.quantityInStock}
                    
                   </td>
                  <td className="border p-2">
                    {item.price}
                  </td>
                  <td className="border p-2">
                    
                       {(Number(item.quantityInStock) || 0) *  (Number(item.price) || 0)}
                    
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}