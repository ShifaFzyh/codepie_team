// src/pages/admin/adminKelolaUser.jsx
// Halaman Admin – Kelola Pengguna (konversi dari admin_kelolaUser.html)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarDashboard from "../components/SidebarDashboard";
import TopBar from "../components/TopBar";

// ─── Data dummy (nanti ganti dengan fetch ke API) ────────────────────────────
const DUMMY_USERS = [
  { id: "#US-9021", name: "John Smith",    email: "john.smith@example.com",   role: "Admin", status: "Active" },
  { id: "#US-8842", name: "Sarah Williams",email: "sarah.w@corp-tech.com",    role: "User",  status: "Suspended" },
  { id: "#US-7719", name: "Michael Tan",   email: "m.tan@design.co",          role: "User",  status: "Active" },
  { id: "#US-6612", name: "Elena Lopez",   email: "e.lopez@global-inc.com",   role: "User",  status: "Active" },
];

const STATS = [
  { label: "Total Users", value: "1,284", icon: "group",        bg: "bg-blue-50",   text: "text-blue-600" },
  { label: "Active Now",  value: "342",   icon: "how_to_reg",   bg: "bg-green-50",  text: "text-green-600" },
  { label: "Pending",     value: "12",    icon: "person_alert", bg: "bg-amber-50",  text: "text-amber-600" },
  { label: "Suspended",   value: "48",    icon: "person_off",   bg: "bg-red-50",    text: "text-red-600" },
];

// ─── Badge helper ─────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  return role === "Admin"
    ? <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tight">Admin</span>
    : <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tight">User</span>;
}

function StatusBadge({ status }) {
  return status === "Active"
    ? (
      <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-slate-400 font-medium text-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />Suspended
      </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminKelolaUser() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter berdasarkan search
  const filtered = DUMMY_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f6faff] min-h-screen">
      {/* Sidebar: role admin */}
      <SidebarDashboard role="admin" userName="Admin" />

      {/* TopBar */}
      <TopBar title="Management Console" />

      {/* Konten Utama */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8">

          {/* Header + Tombol Tambah */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-slate-800 mb-2">Manage Users</h2>
              <nav className="flex text-sm text-slate-500">
                <span className="hover:text-blue-600 cursor-pointer">Home</span>
                <span className="mx-2">/</span>
                <span className="text-blue-600 font-medium">Users</span>
              </nav>
            </div>
            <button
              onClick={() => navigate("/admin/users/create")}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm hover:bg-blue-700 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add User
            </button>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${s.bg} ${s.text} flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                  <h4 className="text-2xl font-semibold">{s.value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Tabel Pengguna */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Toolbar tabel */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="relative w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
              </div>
            </div>

            {/* Isi tabel */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80">
                    {["ID", "Name", "Email", "Role", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar inisial */}
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                      <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                      <td className="px-6 py-4 text-right">
                        {/* Tombol aksi muncul saat hover */}
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus user ${user.name}?`)) {
                                // TODO: panggil DELETE /api/users/:id
                                alert("Delete: " + user.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-800">1</span> to{" "}
                <span className="font-bold text-slate-800">{filtered.length}</span> of{" "}
                <span className="font-bold text-slate-800">1284</span> users
              </p>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-bold">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">2</button>
                <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">3</button>
                <button className="px-3 py-1 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
