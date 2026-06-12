import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000/api";

export default function AdminCreateArtikel() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [schedule, setSchedule] = useState("");
  const [allowComments, setAllowComments] = useState(false);
  const [pinToFeatured, setPinToFeatured] = useState(false);
  const [status, setStatus] = useState("draft");

  const contentRef = useRef(null);

  function getArticleData(articleStatus) {
    if (!title.trim()) {
      alert("Title is required");
      return null;
    }
    if (!contentRef.current?.textContent.trim()) {
      alert("Content is required");
      return null;
    }
    return {
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      content: contentRef.current.innerHTML,
      image: null,
      category_id: category || 1,
      author_id: 1,
      status: articleStatus,
      visibility,
      schedule,
      allow_comments: allowComments ? 1 : 0,
      pin_to_featured: pinToFeatured ? 1 : 0,
    };
  }

  async function handleSaveDraft() {
    const data = getArticleData("draft");
    if (!data) return;
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success || result.id) {
        alert("Article saved as draft successfully!");
        resetForm();
      } else {
        alert("Error: " + (result.message || "Failed to save draft"));
      }
    } catch (error) {
      alert("Error saving draft: " + error.message);
    }
  }

  async function handlePublish() {
    const data = getArticleData("publish");
    if (!data) return;
    if (!confirm("Are you sure you want to publish this article?")) return;
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success || result.id) {
        alert("Article published successfully!");
        navigate("/admin");
      } else {
        alert("Error: " + (result.message || "Failed to publish article"));
      }
    } catch (error) {
      alert("Error publishing article: " + error.message);
    }
  }

  function handleDiscard() {
    if (confirm("Are you sure you want to discard this article? This action cannot be undone.")) {
      resetForm();
      alert("Article discarded");
    }
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setTags("");
    setVisibility("public");
    setSchedule("");
    setAllowComments(false);
    setPinToFeatured(false);
    if (contentRef.current) contentRef.current.innerHTML = "";
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">

      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 h-16 z-40 sticky top-0 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:bg-slate-50 p-2 rounded transition-all">menu</button>
          <h1 className="text-slate-900 text-xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden md:block">Admin</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">AU</div>
        </div>
      </header>

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full flex flex-col pt-16 z-30 w-64 border-r border-slate-200 bg-white hidden md:flex">
          <div className="px-6 py-8">
            <span className="text-lg font-black text-blue-600">Admin</span>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <a href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </a>
            <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600 text-sm font-medium">
              <span className="material-symbols-outlined">description</span>Articles
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined">group</span>Users
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined">settings</span>Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create New Article</h2>
                <p className="text-sm text-gray-500 mt-1">Craft a compelling story for your audience.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Kolom Kiri */}
              <div className="lg:col-span-2 space-y-6">

                {/* Primary Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Article Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a descriptive title..."
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-base"
                        >
                          <option value="">All Categories</option>
                          <option>Programming</option>
                          <option>Cyber Security</option>
                          <option>Web Development</option>
                          <option>Tips & Trik</option>
                          <option>Kesehatan</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tags</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="e.g. AI, Future, UI/UX"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-gray-200 flex flex-wrap gap-2 items-center bg-gray-50 rounded-t-xl">
                    {["format_bold", "format_italic", "format_underlined", "format_list_bulleted", "format_list_numbered", "link", "image", "code"].map((icon, i) => (
                      <button key={i} className="p-2 hover:bg-gray-200 rounded text-gray-500 material-symbols-outlined text-sm">
                        {icon}
                      </button>
                    ))}
                  </div>
                  <div
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="p-6 min-h-[400px] bg-white rounded-b-xl focus:outline-none text-base leading-relaxed text-gray-900"
                    data-placeholder="Start typing your story here..."
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-6">

                {/* Featured Image */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">image</span>
                    Featured Image
                  </h3>
                  <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                    <span className="text-sm font-medium text-gray-500">Click to upload or drag & drop</span>
                    <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                  </div>
                </div>

                {/* Publishing Settings */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">send</span>
                    Publishing
                  </h3>
                  <div className="space-y-6">

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <p className="text-xs text-gray-400">Current: {status}</p>
                      </div>
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                          onClick={() => setStatus("draft")}
                          className={`px-3 py-1 text-xs font-semibold rounded transition-all ${status === "draft" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                        >
                          Draft
                        </button>
                        <button
                          onClick={() => setStatus("public")}
                          className={`px-3 py-1 text-xs font-semibold rounded transition-all ${status === "public" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                        >
                          Public
                        </button>
                      </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility</span>Visibility
                      </label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="public">Everyone</option>
                        <option>Members Only</option>
                        <option>Password Protected</option>
                        <option>Private</option>
                      </select>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>Schedule
                      </label>
                      <input
                        type="datetime-local"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <p className="text-[10px] text-gray-400">Leave blank to publish immediately.</p>
                    </div>

                    {/* Checkboxes */}
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="allowComments"
                          checked={allowComments}
                          onChange={(e) => setAllowComments(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <label htmlFor="allowComments" className="text-sm text-gray-500">Allow comments</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pinToFeatured"
                          checked={pinToFeatured}
                          onChange={(e) => setPinToFeatured(e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <label htmlFor="pinToFeatured" className="text-sm text-gray-500">Pin to featured</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discard */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <button
                    onClick={handleDiscard}
                    className="w-full flex items-center justify-center gap-2 py-2 text-red-600 text-sm font-medium hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Discard Article
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