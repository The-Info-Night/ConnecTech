"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DbUser = {
  id: number;
  uuid: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  [key: string]: any;
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [filtered, setFiltered] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const res = await fetch("/api/users", {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load users");
        setUsers(json.users || []);
        setFiltered(json.users || []);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(users);
      return;
    }
    setFiltered(
      users.filter((u) => {
        return (
          (u.email || "").toLowerCase().includes(q) ||
          (u.name || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q) ||
          String(u.id).includes(q)
        );
      })
    );
  }, [query, users]);

  async function saveUser(uuid: string, values: Partial<DbUser>) {
    setSavingId(uuid);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ uuid, values }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save user");
      setUsers((prev) =>
        prev.map((u) => (u.uuid === uuid ? { ...u, ...json.user } : u))
      );
    } catch (e: any) {
      alert(e.message || "Unknown error");
    } finally {
      setSavingId(null);
    }
  }

  const columns = useMemo(
    () => [
      { key: "email", label: "Email" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ],
    []
  );

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div
      className="min-h-screen w-full p-4"
      style={{ backgroundColor: "#1A1D21" }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">Admin • Users</h1>

        <div className="mb-4 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email, name, role, id"
            className="w-full md:w-80 px-3 py-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="overflow-x-auto bg-white/95 rounded-xl border border-[#E4BEF8] shadow">
          <table className="min-w-full text-sm text-[#7A3192]">
            <thead>
              <tr className="bg-[#EED5FB] text-[#7A3192]">
                <th className="text-left px-3 py-2">ID</th>
                {columns.map((c) => (
                  <th key={c.key} className="text-left px-3 py-2">
                    {c.label}
                  </th>
                ))}
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <EditableRow
                  key={u.uuid}
                  user={u}
                  columns={columns}
                  onSave={saveUser}
                  saving={savingId === u.uuid}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EditableRow({
  user,
  columns,
  onSave,
  saving,
}: {
  user: DbUser;
  columns: { key: string; label: string }[];
  onSave: (uuid: string, values: Partial<DbUser>) => Promise<void>;
  saving: boolean;
}) {
  const [draft, setDraft] = useState<Partial<DbUser>>({});
  useEffect(() => setDraft({}), [user.uuid]);

  return (
    <tr className="border-t border-[#E4BEF8]">
      <td className="px-3 py-2 align-top text-gray-600">{user.id}</td>
      {columns.map((c) => (
        <td key={c.key} className="px-3 py-2 align-top">
          <input
            defaultValue={user[c.key] ?? ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, [c.key]: e.target.value }))
            }
            className="w-full px-2 py-1 border rounded"
          />
        </td>
      ))}
      <td className="px-3 py-2 align-top">
        <button
          onClick={() => onSave(user.uuid, draft)}
          disabled={saving}
          className="px-3 py-1 rounded bg-[#CB90F1] text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
