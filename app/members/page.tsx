/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

type Member = {
  id: number;
  fullName: string;
  role: string;
};

export default function MembersPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Members`;

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // ➕ FORM STATE
  const [form, setForm] = useState({
    fullName: "",
    role: ""
  });

  // 🔹 FETCH MEMBERS
  const loadMembers = useCallback(() => {
    setLoading(true);

    return fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [API_URL]);

  useEffect(() => {
    void Promise.resolve().then(loadMembers);
  }, [loadMembers]);

  // ➕ HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ➕ ADD MEMBER
     const addMember = async () => {
  if (!form.fullName || !form.role) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: form.fullName.toUpperCase(),
      role: form.role.toUpperCase(),
    }),
  });

  setForm({ fullName: "", role: "" });
  loadMembers();
};
  // 🗑 DELETE MEMBER
  const deleteMember = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    loadMembers();
  };

  return (
    <div className="p-6">
      <HamburgerMenu />

      <h1 className="text-3xl font-bold mt-4 mb-6">
        Members Management
      </h1>

      {/* ➕ ADD MEMBER FORM */}
      <div className="mb-6 p-4 bg-background rounded shadow">
        <h2 className="font-bold mb-2">Add Member</h2>

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 mr-2"
        />

        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="border p-2 mr-2"
        />

        <button
          onClick={addMember}
          className="bg-blue-400"
        >
          Add
        </button>
      </div>

      {/* 🔹 TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No members found
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id}>
                <td className="border p-2">{m.id}</td>
                <td className="border p-2">{m.fullName}</td>
                <td className="border p-2">{m.role}</td>

                {/* 🗑 DELETE BUTTON */}
                <td className="border p-2">
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}