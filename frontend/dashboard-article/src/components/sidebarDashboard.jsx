// src/components/SidebarDashboard.jsx
// Komponen SidebarDashboard yang dipakai bersama oleh semua halaman

import { Link, useLocation } from "react-router-dom";

// Konfigurasi menu berdasarkan role (admin / user)
const adminNavItems = [
  { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/admin/articles",  icon: "description", label: "Articles" },
  { to: "/admin/users",     icon: "group",       label: "Users" },
  { to: "/admin/settings",  icon: "settings",    label: "Settings" },
];

const userNavItems = [
  { to: "/dashboard",           icon: "home",        label: "Home" },
  { to: "/editor/create",       icon: "description", label: "Create Articles" },
  { to: "/editor/edit",         icon: "edit",        label: "Edit Articles" },
  { to: "/settings",            icon: "settings",    label: "Settings" },
];

export default function SidebarDashboard({ role = "user", userName = "Users" }) {
  const location = useLocation();
  const navItems = role === "admin" ? adminNavItems : userNavItems;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 z-50 bg-slate-800 border-r border-slate-700 shadow-xl flex flex-col h-full text-sm">
      {/* Logo */}
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Articles Flow</span>
      </div>

      {/* Profile */}
      <div className="px-4 py-4 border-b border-slate-700 mx-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{userName}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-400 text-xs">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center px-4 py-2 my-1 mx-2 rounded transition-colors gap-3 text-sm font-medium
                ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          to="/logout"
          className="text-slate-300 hover:bg-slate-700 hover:text-white flex items-center px-4 py-2 my-1 mx-2 rounded transition-colors gap-3 text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 text-slate-500 text-xs border-t border-slate-700 mx-2">
        © 2026 Codepie. All rights reserved.
      </div>
    </aside>
  );
}
