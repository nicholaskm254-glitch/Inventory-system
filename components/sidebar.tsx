"use client";

import Link from "next/link";

export default function Sidebar() {
    
  const menu = [

    { name: "Members", path: "/members" },
    { name: "Stock", path: "/stock" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-background text-white fixed">
      <h1 className="p-4 text-2xl font-bold border-b">
        Inventory System
      </h1>

      <ul className="mt-4">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className="block px-4 py-3 hover:bg-blue-300 transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
