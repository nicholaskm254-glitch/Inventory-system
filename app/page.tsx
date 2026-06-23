/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import { useEffect, useState } from "react";

const API_BASE = "https://inventory-api-4-wzj2.onrender.com/api";

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const isEqual = (a: any[], b: any[]) =>
  JSON.stringify(a) === JSON.stringify(b);
useEffect(() => {
  const loadData = async () => {
    try {
      const membersRes = await fetch(`${API_BASE}/members`);
      const stockRes = await fetch(`${API_BASE}/products`);
      const salesRes = await fetch(`${API_BASE}/sales`);

      const membersData = await membersRes.json();
      const stockData = await stockRes.json();
      const salesData = await salesRes.json();

      if (!isEqual(membersData, members)) setMembers(membersData);
      if (!isEqual(stockData, stock)) setStock(stockData);
      if (!isEqual(salesData, sales)) setSales(salesData);
    } catch (err) {
      console.log("Dashboard load error:", err);
    }
  };

  loadData(); // initial load

  const interval = setInterval(() => {
    loadData(); // refresh every 5 seconds
  }, 5000);

  return () => clearInterval(interval);
}, [members, stock, sales]);

  // CALCULATIONS
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