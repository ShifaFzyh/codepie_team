import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/posts";

// Komponen Sidebar
function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  }

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
        <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a href="/admin" className="bg-blue-600 text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined">description</span>
          <span>Articles</span>
        </a>
        <a href="/admin/users" className="text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined">group</span>
          <span>Users</span>
        </a>
        <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
        <a onClick={handleLogout} className="text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mx-2 px-3 py-2 flex items-center gap-3 transition-all duration-200 text-sm font-medium cursor-pointer">
        <span className="material-symbols-outlined">logout</span>
        <span>Logout</span>
        </a>
      </nav>
    </aside>
  );
}

// Komponen Header
function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center px-6 z-40">
      <div className="flex items-center gap-4">
        <button className="hover:bg-slate-50 rounded-full p-2 cursor-pointer">
          <span className="material-symbols-outlined text-slate-600">menu</span>
        </button>
        <h1 className="text-lg font-black text-slate-800">Articles Flow Codepie</h1>
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

// Komponen Stats Card
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

// Komponen Row Artikel
function ArticleRow({ post, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-500">#{post.id}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{post.title}</span>
          <span className="text-xs text-gray-400">{post.category || "Uncategorized"}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{post.author_id}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {new Date(post.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-200">
          Published
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

// Komponen Utama DashboardAdmin
export default function DashboardAdmin() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setArticles(result.data);
    } catch (error) {
      console.error("Gagal memuat artikel:", error);
    }
  }

  async function deleteArticle(id) {
    if (confirm("Yakin hapus artikel ini?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      loadArticles();
    }
  }

  function addArticle() {
    window.location.href = "/admin/articles/create";
  }

  return (
    <>
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb & Tombol Add */}
          <div className="flex justify-between items-end">
            <div>
              <nav className="flex items-center gap-2 text-gray-500 mb-2 text-sm">
                <span>Home</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-800">Articles</span>
              </nav>
              <h2 className="text-3xl font-semibold text-gray-800">Articles</h2>
            </div>
            <button
              onClick={addArticle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="font-semibold">Add New Article</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon="article"      label="Total Articles" value="1,284" bgColor="bg-blue-50"   iconColor="text-blue-600" />
            <StatCard icon="check_circle" label="Published"      value="942"   bgColor="bg-green-50"  iconColor="text-green-600" />
            <StatCard icon="edit_note"    label="Drafts"         value="342"   bgColor="bg-orange-50" iconColor="text-orange-600" />
            <StatCard icon="visibility"   label="Total Views"    value="45.2k" bgColor="bg-purple-50" iconColor="text-purple-600" />
          </div>

          {/* Tabel Artikel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                  <input
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 bg-white"
                    placeholder="Search articles..."
                    type="text"
                  />
                </div>
                <select className="border border-gray-200 rounded-lg text-sm px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>All Categories</option>
                  <option>Programming</option>
                  <option>Cyber Security</option>
                  <option>Web Development</option>
                  <option>Tips & Trik</option>
                  <option>Kesehatan</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-gray-500">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-gray-500">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    {["ID", "Title", "Author", "Date", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.length > 0 ? (
                    articles.map((post) => (
                      <ArticleRow key={post.id} post={post} onDelete={deleteArticle} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                        Belum ada artikel atau sedang memuat...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center bg-white">
              <span className="text-sm text-gray-500">Showing 1 to {articles.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">1</button>
                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm">2</button>
                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm">3</button>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm">321</button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}