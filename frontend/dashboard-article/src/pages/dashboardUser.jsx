// src/pages/user/DashboardUser.jsx
// Halaman User – Buat Artikel Baru (konversi dari dashboard_user.html)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sidebarDashboard from "../components/SidebarDashboard";
import TopBar from "../components/TopBar";

const CATEGORIES = ["Programming", "Cyber Security", "Web Development", "Tips & Trik", "Kesehatan"];

export default function DashboardUser() {
  const navigate = useNavigate();

  // ─── State form ──────────────────────────────────────────────────────────
  const [title, setTitle]           = useState("");
  const [content, setContent]       = useState("");
  const [category, setCategory]     = useState(CATEGORIES[0]);
  const [isPublished, setIsPublished] = useState(true);
  const [coverImage, setCoverImage]   = useState(null);
  const [saving, setSaving]           = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // ─── Handler simpan artikel ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim()) { alert("Judul artikel wajib diisi"); return; }
    if (!content.trim()) { alert("Konten artikel wajib diisi"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: title.toLowerCase().replace(/\s+/g, "-"),
          content,
          category,
          status: isPublished ? "published" : "draft",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Artikel berhasil disimpan!");
        navigate("/editor/create");
      } else {
        alert("Gagal menyimpan: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Handler upload gambar ────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#f6faff] font-sans text-[#151c22]">
      <SidebarDashboard role="user" userName="Users" />
      <TopBar title="Dashboard" />

      <main className="ml-64 pt-14 min-h-screen">
        <div className="p-6">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center text-sm text-slate-500">
            <a href="#" className="hover:text-blue-600 flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">home</span>Home
            </a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-blue-600">Articles</a>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-semibold">Create</span>
          </nav>

          {/* Header halaman */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Create New Article</h2>
            <p className="text-sm text-slate-500 mt-1">
              Draft a new story for your audience. All changes are autosaved to drafts.
            </p>
          </div>

          {/* Grid dua kolom */}
          <div className="grid grid-cols-12 gap-4">

            {/* ── Kolom Form Utama ─────────────────────────────────────── */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">

                {/* Judul Artikel */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-sm transition-all outline-none"
                  />
                </div>

                {/* Content Body */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Content Body
                  </label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    {/* Toolbar editor sederhana */}
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2">
                      {[
                        { icon: "format_bold",     title: "Bold" },
                        { icon: "format_italic",   title: "Italic" },
                        { icon: "format_list_bulleted", title: "Bullet" },
                      ].map((btn) => (
                        <button
                          key={btn.icon}
                          title={btn.title}
                          type="button"
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <span className="material-symbols-outlined text-lg">{btn.icon}</span>
                        </button>
                      ))}
                      <div className="w-px h-4 bg-slate-300 mx-1" />
                      {[
                        { icon: "link",  title: "Link" },
                        { icon: "image", title: "Image" },
                      ].map((btn) => (
                        <button
                          key={btn.icon}
                          title={btn.title}
                          type="button"
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <span className="material-symbols-outlined text-lg">{btn.icon}</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={12}
                      placeholder="Start writing your article here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full border-none outline-none focus:ring-0 p-3 text-sm resize-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-right mt-1">Word count: {wordCount}</p>
                </div>

              </div>
            </div>

            {/* ── Kolom Sidebar Settings ───────────────────────────────── */}
            <div className="col-span-12 lg:col-span-4 space-y-4">

              {/* Publication Settings */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Publication Settings</h3>
                <div className="space-y-4">

                  {/* Kategori */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-sm outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Visibility toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">visibility</span>
                      <div>
                        <p className="text-sm font-semibold">Visibility</p>
                        <p className="text-[10px] text-slate-400">Publish immediately</p>
                      </div>
                    </div>
                    {/* Toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>

                  {/* Status Publish / Draft */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPublished(true)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-all
                          ${isPublished ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPublished(false)}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-all
                          ${!isPublished ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        <span className="material-symbols-outlined text-sm">draft</span>Draft
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Cover Image</h3>
                <label className="cursor-pointer block">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                  ) : (
                    <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group">
                      <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-blue-500">add_photo_alternate</span>
                      <p className="text-sm font-semibold text-slate-400">Upload Image</p>
                      <p className="text-[10px] text-slate-300 text-center px-4">Recommended: 1200 × 630 px</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Article"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
