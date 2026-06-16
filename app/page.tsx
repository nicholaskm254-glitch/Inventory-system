/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import { useEffect, useState } from "react";

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  // 🔹 FETCH ALL DATA
  const loadData = async () => {
    try {
      const membersRes = await fetch("http://localhost:5148/api/members");
      const stockRes = await fetch("http://localhost:5148/api/products");
      const salesRes = await fetch("http://localhost:5148/api/sales");

      const membersData = await membersRes.json();
      const stockData = await stockRes.json();
      const salesData = await salesRes.json();

      setMembers(membersData);
      setStock(stockData);
      setSales(salesData);
    } catch (err) {
      console.log("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  // 🔹 CALCULATIONS
   const totalStockValue = stock.reduce(
  (sum, item) =>
    sum +
    (Number(item.quantityInStock) || 0) *
    (Number(item.price) || 0),
  0
);
  const totalRevenue = sales.reduce(
    (sum, sale) => sum + (sale.quantity * sale.price),
    0
  );

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-4xl font-bold mt-4 mb-6">
        Inventory Management Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background shadow rounded p-4">
          <h2 className="text-gray-500">Members</h2>
          <p className="text-3xl font-bold">{members.length}</p>
        </div>

        <div className="bg-background shadow rounded p-4">
          <h2 className="text-gray-500">Products</h2>
          <p className="text-3xl font-bold">{stock.length}</p>
        </div>

        <div className="bg-background shadow rounded p-4">
          <h2 className="text-gray-500">Sales</h2>
          <p className="text-3xl font-bold">{sales.length}</p>
        </div>

        <div className="bg-background shadow rounded p-4">
          <h2 className="text-gray-500">Stock Value</h2>
          <p className="text-3xl font-bold">
            KES {totalStockValue}
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mt-8 bg-background shadow rounded p-4">
        <h2 className="text-xl font-bold mb-4">
          System Summary
        </h2>

        <p>Total Members: {members.length}</p>
        <p>Total Products: {stock.length}</p>
        <p>Total Sales Recorded: {sales.length}</p>
        <p>Total Revenue: KES {totalRevenue}</p>
      </div>
    </div>
  );
}