/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import { useEffect, useState } from "react";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [members, setMembers] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  const [user] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!API) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [membersRes, stockRes, salesRes] =
          await Promise.all([
            fetch(`${API}/api/Members`, {
              headers: getAuthHeaders(),
            }),
            fetch(`${API}/api/Products`, {
              headers: getAuthHeaders(),
            }),
            fetch(`${API}/api/Sales`, {
              headers: getAuthHeaders(),
            }),
          ]);

        if (
          membersRes.status === 401 ||
          stockRes.status === 401 ||
          salesRes.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        const membersData = await membersRes.json();
        const stockData = await stockRes.json();
        const salesData = await salesRes.json();

        setMembers(
          Array.isArray(membersData)
            ? membersData
            : []
        );

        setStock(
          Array.isArray(stockData)
            ? stockData
            : []
        );

        setSales(
          Array.isArray(salesData)
            ? salesData
            : []
        );
      } catch (err) {
        console.log("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    void loadData();

    const interval = setInterval(() => {
      void loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [API]);

  const totalStockValue = stock.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantityInStock) || 0) *
        (Number(item.price) || 0),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum +
      (Number(sale.quantity) || 0) *
        (Number(sale.price) || 0),
    0
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mt-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Inventory Management Dashboard
          </h1>

          {user && (
            <div className="mt-2">
              <p className="text-lg">
                Welcome, <strong>{user.fullName}</strong>
              </p>

              <p className="text-sm text-gray-500">
                Role: {user.role}
              </p>
            </div>
          )}
        </div>

        <HamburgerMenu />
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                KES {totalStockValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 bg-background shadow rounded p-4">
            <h2 className="text-xl font-bold mb-4">System Summary</h2>

            <p>Total Members: {members.length}</p>
            <p>Total Products: {stock.length}</p>
            <p>Total Sales Recorded: {sales.length}</p>
            <p>Total Revenue: KES {totalRevenue.toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}