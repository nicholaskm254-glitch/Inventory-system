//* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

type Member = {
  id: number;
  fullName: string;
  role: string;
};

export default function MembersPage() {
  const API_URL = "http://localhost:5148/api/members";

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH MEMBERS
  const loadMembers = () => {
    setLoading(true);

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMembers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

 

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Members Management
      </h1>

     
      {/* 🔹 TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No members found
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id}>
                <td className="border p-2">{m.id}</td>
                <td className="border p-2">{m.fullName}</td>
                <td className="border p-2">{m.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}