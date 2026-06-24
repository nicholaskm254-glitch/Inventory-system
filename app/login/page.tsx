
"use client";

import { useState } from "react";

export default function LoginPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/api/Auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="p-8 rounded-lg shadow-md w-96">
  <h1 className="text-2xl font-bold mb-6">Login</h1>

  {error && (
    <div className="text-red-700 p-3 rounded mb-4">
      {error}
    </div>
  )}

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full p-2 border rounded mb-4"
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-2 border rounded mb-4"
  />

  <button
    onClick={login}
    disabled={loading}
    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
  >
    {loading ? "Logging in..." : "Login"}
  </button>

  <div className="mt-4 text-center">
    <span className="text-gray-600">
      Do not have an account?
    </span>

    <a
      href="/register"
      className="text-blue-600 font-semibold ml-1 hover:underline"
    >
      Register
    </a>
  </div>
</div>
  );
}