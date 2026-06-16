/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);

  // 🔹 FETCH FROM DATABASE (API)
  const loadMembers = () => {
    fetch("http://localhost:5148/api/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadMembers()
  }, []); 

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Members List
      </h1>


        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
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