// src/pages/user/UserEditArtikel.jsx
// Halaman User – Edit Artikel (konversi dari user_editArtikel.html)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sidebarDashboard from "../components/SidebarDashboard";
import TopBar from "../components/TopBar";
import Alert from "../components/Alert";

const CATEGORIES = [
  { value: "1", label: "Programming" },
  { value: "2", label: "Cyber Security" },
  { value: "3", label: "Web Development" },
  { value: "4", label: "Tips & Trik" },
  { value: "5", label: "Kesehatan" },
];

export default function UserEditArtikel() {
  const navigate  = useNavigate();
  const { id }    = useParams(); // URL: /editor/edit/:id

  // ─── State ────────────────────────────────────────────────────────────────
  const [title,      setTitle]      = useState("");
  const [content,    setContent]    = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [status,     setStatus]     = useState("published");
  const [author,     setAuthor]     = useState("Loading...");
  const [lastMod,    setLastMod]    = useState("Loading...");
  const [revisions,  setRevisions]  = useState(0);
  const [updating,   setUpdating]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [alerts,     setAlerts]     = useState([]); // [{id, message, type}]

  // ─── Helper alert ─────────────────────────────────────────────────────────
  const showAlert = (message, type = "info") => {
    const alertId = Date.now();
    setAlerts((prev) => [...prev, { id: alertId, message, type }]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== alertId)), 5000);
  };
  const removeAlert = (alertId) => setAlerts((prev) => prev.filter((a) => a.id !== alertId));

  // ─── Load data artikel dari API ───────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      showAlert("Error: No article ID provided", "error");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to load article");
        const data = await res.json();
        if (data.success) {
          const a = data.data;
          setTitle(a.title || "");
          setContent(a.content || "");
          setCategoryId(String(a.category_id || "1"));
          setStatus("published");
          setAuthor(a.author_id ? `User #${a.author_id}` : "Unknown");
          setRevisions(Math.floor(Math.random() * 20) + 1);
          if (a.created_at) {
            const d = new Date(a.created_at);
            setLastMod(d.toLocaleDateString() + " " + d.toLocaleTimeString());
          }
        } else {
          showAlert("Failed to load article", "error");
        }
      } catch (err) {
        showAlert("Error loading article: " + err.message, "error");
      }
    })();
  }, [id]);

  // ─── Update artikel ────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!title.trim())   { showAlert("Title is required", "error"); return; }
    if (!content.trim()) { showAlert("Content is required", "error"); return; }

    setUpdating(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          content,
          category_id: categoryId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Article updated successfully!", "success");
      } else {
        showAlert("Failed to update: " + (data.message || data.error), "error");
      }
    } catch (err) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  // ─── Delete artikel ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to move this article to trash?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Article moved to trash!", "success");
        setTimeout(() => navigate("/editor/create"), 2000);
      } else {
        showAlert("Failed to delete: " + (data.message || data.error), "error");
      }
    } catch (err) {
      showAlert("Error: " + err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f4f6f9] min-h-screen font-sans text-[#151c22]">
      <SidebarDashboard role="user" userName="Users" />
      <TopBar title="Dashboard" />

      <div className="ml-64 min-h-screen flex flex-col">
        <main className="mt-14 p-6 flex-1">

          {/* Alert Messages */}
          <div className="mb-6">
            {alerts.map((a) => (
              <Alert key={a.id} message={a.message} type={a.type} onClose={() => removeAlert(a.id)} />
            ))}
          </div>

          {/* Header + Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-slate-800 mb-2">Edit Article</h2>
              <nav className="flex items-center space-x-2 text-sm text-slate-500">
                <a href="#" className="hover:text-blue-600">Home</a>
                <span>/</span>
                <a href="#" className="hover:text-blue-600">Articles</a>
                <span>/</span>
                <span className="hover:text-blue-600">Edit</span>
                <span>/</span>
                <span className="font-bold text-slate-800">#{id || "-"}</span>
              </nav>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-slate-500">
                <span className="font-semibold">Last modified:</span> {lastMod}
              </p>
            </div>
          </div>

          {/* Grid dua kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Kolom Form Utama ──────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-t-4 border-blue-600 p-6">
                  <div className="space-y-6">

                    {/* Judul */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Article Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter article title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Kategori + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Category
                        </label>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full border border-slate-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Status
                        </label>
                        <div className="flex items-center mt-2 space-x-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="published"
                              checked={status === "published"}
                              onChange={() => setStatus("published")}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Published</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="draft"
                              checked={status === "draft"}
                              onChange={() => setStatus("draft")}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Draft</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Konten */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Content Body
                      </label>
                      <textarea
                        rows={12}
                        placeholder="Enter article content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-slate-300 rounded p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer tombol form */}
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => navigate("/editor/create")}
                    className="px-6 py-2 bg-slate-600 text-white rounded font-semibold hover:opacity-90 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-8 py-2 bg-blue-600 text-white rounded font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm disabled:opacity-60"
                  >
                    {updating ? "Updating..." : "Update Article"}
                  </button>
                </div>
              </section>
            </div>

            {/* ── Kolom Sidebar ─────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-6">

              {/* Gambar Cover */}
              <div className="bg-white rounded border border-slate-200 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Featured Image</h3>
                <div className="relative rounded-lg group overflow-hidden bg-slate-100 aspect-video mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-white/40">image</span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-slate-800 px-4 py-2 rounded-full font-bold text-sm">
                      Change Image
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">Optimal size: 1200×630px</p>
              </div>

              {/* Info Publikasi */}
              <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Publishing Info</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Author:</span>
                    <span className="font-semibold text-blue-600">{author}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Visibility:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Public</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Revisions:</span>
                    <span className="font-semibold">{revisions}</span>
                  </div>
                  <hr className="border-slate-100" />
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full text-left flex items-center text-red-600 font-semibold text-sm hover:underline cursor-pointer transition-colors active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-sm mr-2">delete</span>
                    {deleting ? "Deleting..." : "Move to trash"}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Enterprise", "Strategy", "2024"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                  <button className="px-2 py-1 border border-dashed border-slate-300 rounded-full text-xs text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                    + Add Tag
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
