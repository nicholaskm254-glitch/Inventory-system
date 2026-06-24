"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage =
    pathname === "/login" ||
    pathname === "/register";

  useEffect(() => {
    if (isPublicPage) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [isPublicPage, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}