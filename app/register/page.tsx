"use client";

import { useState } from "react";

export default function RegisterPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const response = await fetch(
        `${API}/api/Auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        alert("Registration failed");
        return;
      }

      alert("Registration successful");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border p-6 rounded w-96">
        <h1 className="text-2xl font-bold mb-4">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-3"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={register}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Register
        </button>

         <div className="mt-4 text-center">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-1">
            Login
          </a>
          </div>
        
      </div>
    </div>
  );
}