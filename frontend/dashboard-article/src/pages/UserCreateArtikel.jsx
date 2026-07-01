import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function UserCreateArtikel() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const contentRef = useRef(null);

  // ✅ Ambil kategori dari database
  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  function buildFormData(articleStatus) {
    if (!title.trim()) {
      alert("Judul artikel wajib diisi!");
      return null;
    }
    if (!contentRef.current?.textContent.trim()) {
      alert("Konten artikel tidak boleh kosong!");
      return null;
    }
    if (!category) {
      alert("Kategori wajib dipilih!");
      return null;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", contentRef.current.innerHTML);
    formData.append("idcategories", category);
    formData.append("status", articleStatus);
    formData.append("views", 0);

    if (thumbnail) formData.append("image", thumbnail);

    return formData;
  }

  async function handleSaveDraft() {
    const formData = buildFormData("draft");
    if (!formData) return;
    setSubmitting(true);
    try {
      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success || res.data.id) {
        alert("Artikel berhasil disimpan sebagai draft!");
        resetForm();
      } else {
        alert("Gagal: " + (res.data.message || "Gagal menyimpan draft"));
      }
    } catch (error) {
      alert("Gagal: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish() {
    const formData = buildFormData("pending");
    if (!formData) return;
    if (!confirm("Apakah Anda yakin ingin mengirim artikel ini ke antrean review Admin?")) return;
    setSubmitting(true);
    try {
      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success || res.data.id) {
        alert("Artikel Anda berhasil dikirim ke antrean review!");
        navigate("/");
      } else {
        alert("Gagal: " + (res.data.message || "Gagal mengirim artikel"));
      }
    } catch (error) {
      alert("Gagal: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDiscard() {
    if (confirm("Apakah Anda yakin ingin membuang draf artikel ini?")) {
      resetForm();
    }
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setThumbnail(null);
    setDocumentFile(null);
    if (contentRef.current) contentRef.current.innerHTML = "";
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto pt-8 px-4">

        {/* Page Header */}
        <div className="border-b border-gray-100 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tulis Artikel Baru</h2>
            <p className="text-sm text-gray-500 mt-1">Artikel Anda akan dikirim ke antrean review Admin sebelum dipublikasikan.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Draf"}
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Kirim Artikel"}
            </button>
          </div>
        </div>

        <div className="space-y-6">

          {/* Judul */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 tracking-wide">Judul Artikel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul artikel yang menarik..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base outline-none shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ Kategori dari database */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 tracking-wide">Kategori Tema</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base outline-none shadow-sm appearance-none"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 tracking-wide">Foto / Thumbnail Artikel</label>
              <div className="flex flex-col items-start w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer w-full"
                />
              </div>
              <p className="text-[11px] text-gray-400 pl-1">Hanya format gambar (.jpg, .png, .webp)</p>
            </div>

          </div>

          {/* Dokumen */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 tracking-wide">Import/Lampirkan File Dokumen (Opsional)</label>
            <div className="flex flex-col items-start w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setDocumentFile(e.target.files[0])}
                className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer w-full"
              />
            </div>
            <p className="text-[11px] text-gray-400 pl-1">Dapat berupa dokumen PDF, DOCX, DOC atau TXT artikel Anda</p>
          </div>

          {/* Editor Konten */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 tracking-wide">Isi / Konten Artikel</label>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <div className="p-2 border-b border-gray-100 flex flex-wrap gap-1 items-center bg-gray-50">
                {["format_bold", "format_italic", "format_underlined", "format_list_bulleted", "format_list_numbered", "link", "image", "code"].map((icon, i) => (
                  <button type="button" key={i} className="p-2 hover:bg-gray-200 rounded text-gray-500 material-symbols-outlined text-sm">
                    {icon}
                  </button>
                ))}
              </div>
              <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                className="p-6 min-h-[350px] focus:outline-none text-base leading-relaxed text-black dark:text-black bg-white"
                style={{ minHeight: "350px" }}
              />
            </div>
          </div>

          {/* Discard */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Kosongkan Form
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}