
"use client";

import { useCallback, useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { apiFetch } from "@/lib/api";


type Member = {
  id: number;
  fullName: string;
  role: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    role: "",
  });

  // LOAD MEMBERS
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiFetch("/api/Members");

      if (!response.ok) {
        throw new Error("Failed to load members");
      }

      const data = await response.json();

      setMembers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeMembers = async () => {
      await loadMembers();
    };

    void initializeMembers();
  }, [loadMembers]);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD MEMBER
  const addMember = async () => {
    if (!form.fullName || !form.role)
      return;

    try {
      const response = await apiFetch(
        "/api/Members",
        {
          method: "POST",
          body: JSON.stringify({
            fullName:
              form.fullName.toUpperCase(),
            role:
              form.role.toUpperCase(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add member"
        );
      }

      setForm({
        fullName: "",
        role: "",
      });

      await loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE MEMBER
  const deleteMember = async (
    id: number
  ) => {
    try {
      const response = await apiFetch(
        `/api/Members/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete member"
        );
      }

      await loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-3 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <HamburgerMenu />

        <h1 className="text-3xl font-bold mt-4 mb-6">
          Members Management
        </h1>

        {/* ADD MEMBER */}
        <div className="mb-6 p-4 bg-background rounded shadow">
          <h2 className="font-bold mb-2">
            Add Member
          </h2>

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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border p-2">
                  ID
                </th>
                <th className="border p-2">
                  Full Name
                </th>
                <th className="border p-2">
                  Role
                </th>
                <th className="border p-2">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : members.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-4"
                  >
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id}>
                    <td className="border p-2">
                      {m.id}
                    </td>

                    <td className="border p-2">
                      {m.fullName}
                    </td>

                    <td className="border p-2">
                      {m.role}
                    </td>

                    <td className="border p-2">
                      <button
                        onClick={() =>
                          deleteMember(
                            m.id
                          )
                        }
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
      </div>
    </div>
  );
}