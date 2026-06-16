"use client";

import { useState } from "react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Members", path: "/members" },
    { name: "Stock", path: "/stock" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="relative">
      {/* HAMBURGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="text-3xl font-bold p-2 right-0 absolute"
      >
        ☰
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute top-12 right-0 bg-background shadow-lg border rounded w-30 z-20">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-blue-300 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}