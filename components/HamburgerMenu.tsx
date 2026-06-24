"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menu = [
    { name: "🏠 Dashboard", path: "/" },
    { name: "👥 Members", path: "/members" },
    { name: "📦 Stock", path: "/stock" },
    { name: "💰 Sales", path: "/sales" },
    { name: "📊 Reports", path: "/reports" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* FIXED TOP RIGHT */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-lg
            shadow-lg
            text-2xl
            transition
          "
        >
          ☰
        </button>

        {open && (
          <div
            className="
              absolute
              right-0
              mt-2
              w-56
              rounded-xl
              border
              bg-black
              shadow-2xl
              overflow-hidden
            "
          >
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
                className="
                  block
                  px-4
                  py-3
                  hover:bg-blue-600
                  transition
                "
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t border-gray-700" />

            <button
              onClick={logout}
              className="
                w-full
                text-left
                px-4
                py-3
                bg-red-600
                hover:bg-red-700
                text-white
                transition
              "
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}