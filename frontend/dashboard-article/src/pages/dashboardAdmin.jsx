import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

// ===================== SIDEBAR =====================
function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  }

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "articles", label: "Articles", icon: "description" },
    { key: "moderasi", label: "Moderasi", icon: "fact_check" },
    { key: "users", label: "Users", icon: "group" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 shadow-xl flex flex-col py-4 z-50">
      <div className="px-6 mb-8">
        <span className="text-xl font-bold text-white">Articles Flow Codepie</span>
      </div>

      <div className="flex items-center gap-3 px-6 mb-8">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbznNSyUJ0Lg7gh8uJfXfGAhjEHClMTYfs3rs9PpIQLbEDwg9uK9rclS-OCI0ZsA5XQu2JZTPIR3VcavEZ5EmEuw5xYK3-X2mtMck0Yqz9wkEKODqT0aGxnpkMKKQwKNdS2l5yyg971q0lV7uDsAHA3CCtgNS_iOYtIIBLh5CIwBhftwdnw0Rm26Iy_WH6FKO8Ocz___IxxlqPxrfNGWZC0GqQibMgPPZ-6Fg5xXA48uAl6XwsWKCrzZk6eMdm_H1KuloXCUYpQrXJ"
            alt="Admin Avatar"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">Admin</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full text-left rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium ${
              activeTab === item.key
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
            style={{ width: "calc(100% - 16px)" }}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium"
          style={{ width: "calc(100% - 16px)" }}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

// ===================== HEADER =====================
function Header({ title }) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center px-6 z-40">
      <div className="flex items-center gap-4">
        <button className="hover:bg-slate-50 rounded-full p-2 cursor-pointer">
          <span className="material-symbols-outlined text-slate-600">menu</span>
        </button>
        <h1 className="text-lg font-black text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="hover:bg-slate-50 rounded-full p-2 cursor-pointer relative">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-medium text-slate-700">Admin</span>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqo8wyRI0NIrM39qbJGdOoucHczRIuuePrBbGHgX3pGfJiRouVr5BC5xgrYwxvx1v2QD4AnJQmCdfyi-fRmd2Qcsxp1wYjJ2kjcX-Xojv5v50aN0S2QJd6qusnT-LvFNqGkM-xi9HHbQeAwSDS91HiQwcQ2kwcRhhUBDKuoU9bGq564YLzjDWXE3VHFOzk6M6d0HC0qECELo89lBuFmRINT64N_8d42Eg3r18pW4-GLE1IQGjth85gyinnqPNL6pymimx9NhIiKLLt"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

// ===================== STAT CARD =====================
function StatCard({ icon, label, value, bgColor, iconColor }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ===================== BAR CHART =====================
function TopViewedChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Artikel Terbanyak Dibaca</h3>
        <p className="text-sm text-gray-400 text-center py-10">Belum ada data views.</p>
      </div>
    );
  }
  const maxViews = Math.max(...data.map((d) => d.views || 0), 1);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Artikel Terbanyak Dibaca</h3>
      <p className="text-sm text-gray-500 mb-6">Top {data.length} artikel berdasarkan jumlah views</p>
      <div className="space-y-3">
        {data.map((post, idx) => {
          const widthPct = Math.max((post.views / maxViews) * 100, 3);
          return (
            <div key={post.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-5 text-right">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate pr-2">{post.title}</span>
                  <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">
                    {Number(post.views).toLocaleString("id-ID")} views
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== TAB: DASHBOARD =====================
function DashboardTab() {
  const [stats, setStats] = useState({ totalUsers: 0, totalPublished: 0, totalPending: 0, totalViews: 0 });
  const [topViewed, setTopViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadTopViewed();
  }, []);

  async function loadStats() {
    try {
      const res = await API.get("/posts/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Gagal memuat statistik:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTopViewed() {
    try {
      const res = await API.get("/posts/top-viewed");
      setTopViewed(res.data.data);
    } catch (err) {
      console.error("Gagal memuat top artikel:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Statistik & Metrik Ringkasan</h2>
        <p className="text-sm text-gray-500">Ringkasan performa platform secara keseluruhan.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="group" label="Total Pengguna" value={loading ? "..." : stats.totalUsers} bgColor="bg-indigo-50" iconColor="text-indigo-600" />
        <StatCard icon="article" label="Artikel Dipublikasikan" value={loading ? "..." : stats.totalPublished} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatCard icon="hourglass_empty" label="Menunggu Moderasi" value={loading ? "..." : stats.totalPending} bgColor="bg-orange-50" iconColor="text-orange-600" />
      </div>
      <StatCard icon="visibility" label="Total Pembaca Platform (Views)" value={loading ? "..." : Number(stats.totalViews).toLocaleString("id-ID")} bgColor="bg-purple-50" iconColor="text-purple-600" />
      <TopViewedChart data={topViewed} />
    </div>
  );
}

// ===================== BADGES =====================
function CategoryBadge({ category }) {
  const colorMap = {
    "Web Development": "bg-green-100 text-green-700 border-green-200",
    "Kesehatan": "bg-purple-100 text-purple-700 border-purple-200",
    "Programming": "bg-blue-100 text-blue-700 border-blue-200",
    "Cyber Security": "bg-red-100 text-red-700 border-red-200",
    "Tips & Trik": "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  const classes = colorMap[category] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${classes}`}>
      {category || "Uncategorized"}
    </span>
  );
}

function ArticleStatusBadge({ status }) {
  const styles = {
    published: "bg-green-100 text-green-700 border-green-200",
    draft: "bg-gray-100 text-gray-700 border-gray-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.draft}`}>
      {status || "draft"}
    </span>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role?.toLowerCase() === "admin";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${isAdmin ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
      <span className="material-symbols-outlined text-[14px]">{isAdmin ? "shield_person" : "edit"}</span>
      {isAdmin ? "Admin" : "Editor"}
    </span>
  );
}

function StatusBadge({ status }) {
  const isActive = status?.toLowerCase() === "aktif" || status?.toLowerCase() === "active";
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ===================== TAB: ARTICLES (semua artikel) =====================
function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadArticles(); }, [search, selectedCategory]);

  async function loadCategories() {
    try {
      const res = await API.get("/categories");
      setCategories(res.data.data);
    } catch (err) { console.error(err); }
  }

  async function loadArticles() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      const res = await API.get("/posts", { params });
      setArticles(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function deleteArticle(id) {
    if (!confirm("Yakin hapus artikel ini?")) return;
    try {
      await API.delete(`/posts/${id}`);
      loadArticles();
    } catch (err) { alert("Gagal menghapus artikel"); }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Daftar Artikel</h2>
          <p className="text-sm text-gray-500">Kelola seluruh artikel yang ada di platform.</p>
        </div>
        <button
          onClick={() => window.location.href = "/admin/articles/create"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="font-semibold">Add New Article</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 bg-white"
              placeholder="Search articles..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg text-sm px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {["ID", "Judul", "Penulis", "Tanggal", "Status", "Aksi"].map((h) => (
                  <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 ${h === "Aksi" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Memuat artikel...</td></tr>
              ) : articles.length > 0 ? (
                articles.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">#{post.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-800">{post.title}</span>
                        <CategoryBadge category={post.category_name} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{post.idusers}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-6 py-4"><ArticleStatusBadge status={post.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => deleteArticle(post.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Hapus">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Belum ada artikel</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white">
          <span className="text-sm text-gray-500">Total: {articles.length} artikel</span>
        </div>
      </div>
    </div>
  );
}

// ===================== TAB: MODERASI (artikel pending) =====================
function ModerasiTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPending(); }, []);

  async function loadPending() {
    setLoading(true);
    try {
      const res = await API.get("/posts");
      const semua = res.data.data || [];
      setArticles(semua.filter((p) => p.status === "pending"));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function publishArticle(post) {
    if (!confirm(`Publish artikel "${post.title}"?`)) return;
    try {
      await API.put(`/posts/${post.id}`, {
        title: post.title,
        slug: post.slug,
        content: post.content,
        thumbnail: post.thumbnail,
        status: "published",
        views: post.views,
        idcategories: post.idcategories,
        idusers: post.idusers,
      });
      loadPending();
    } catch (err) { alert("Gagal mempublikasikan artikel"); }
  }

  async function deleteArticle(id) {
    if (!confirm("Yakin tolak & hapus artikel ini?")) return;
    try {
      await API.delete(`/posts/${id}`);
      loadPending();
    } catch (err) { alert("Gagal menghapus artikel"); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Antrean Moderasi Artikel</h2>
        <p className="text-sm text-gray-500">
          Tinjau pengajuan artikel dari editor sebelum menerbitkannya ke landing page.
          {articles.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-xs font-bold">
              {articles.length} menunggu
            </span>
          )}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {["Judul", "Kategori", "Penulis", "Tanggal Dibuat", "Lampiran", "Aksi"].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : articles.length > 0 ? (
                articles.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{post.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <CategoryBadge category={post.category_name} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{post.idusers}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {post.document_path ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => publishArticle(post)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => deleteArticle(post.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-gray-300">check_circle</span>
                      <p className="text-gray-400 text-sm font-medium">Tidak ada artikel yang menunggu verifikasi.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== TAB: USERS =====================
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function changeRole(user) {
    const newRole = user.role?.toLowerCase() === "admin" ? "editor" : "admin";
    if (!confirm(`Ubah role ${user.username} menjadi ${newRole}?`)) return;
    try {
      await API.put(`/users/${user.id}`, { ...user, role: newRole });
      loadUsers();
    } catch (err) { alert("Gagal mengubah role"); }
  }

  async function toggleStatus(user) {
    const isActive = user.status?.toLowerCase() === "active" || user.status?.toLowerCase() === "aktif";
    const newStatus = isActive ? "inactive" : "active";
    if (!confirm(`Ubah status ${user.username} menjadi ${newStatus}?`)) return;
    try {
      await API.put(`/users/${user.id}`, { ...user, status: newStatus });
      loadUsers();
    } catch (err) { alert("Gagal mengubah status"); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Daftar Pengguna Terdaftar</h2>
        <p className="text-sm text-gray-500">List seluruh pengguna yang memiliki akses untuk menulis di platform ini.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200">
              <tr>
                {["ID", "Nama Lengkap", "Username", "Alamat Email", "Hak Akses (Role)", "Status", "Terdaftar Pada"].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-blue-700">@{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => changeRole(user)} className="cursor-pointer">
                        <RoleBadge role={user.role} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(user)} className="cursor-pointer">
                        <StatusBadge status={user.status} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">Belum ada pengguna terdaftar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== KOMPONEN UTAMA =====================
export default function DashboardAdmin() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => { loadPendingCount(); }, []);

  async function loadPendingCount() {
    try {
      const res = await API.get("/posts");
      const semua = res.data.data || [];
      setPendingCount(semua.filter((p) => p.status === "pending").length);
    } catch (err) { console.error(err); }
  }

  const titles = {
    dashboard: "Dashboard Admin",
    articles: "Articles",
    moderasi: "Moderasi Artikel",
    users: "Users",
  };

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingCount} />
      <Header title={titles[activeTab]} />
      <main className="ml-64 pt-16 min-h-screen p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <nav className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Home</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-gray-800">{titles[activeTab]}</span>
          </nav>
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "articles" && <ArticlesTab />}
          {activeTab === "moderasi" && <ModerasiTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </main>
    </>
  );
}