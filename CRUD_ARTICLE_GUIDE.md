# Panduan Fitur CRUD Artikel - User Edit Article

## 🎯 Fitur yang Diimplementasikan

### 1. **READ (Baca) - Load Artikel Data**
- API endpoint: `GET /api/posts/:id`
- Form secara otomatis terisi dengan data artikel dari database
- Menampilkan: Judul, Kategori, Status, Konten, Author, dan informasi lainnya

### 2. **UPDATE (Perbarui) - Edit Artikel**
- **URL:** `http://localhost:3000/editor/create?id=ARTICLE_ID`
  - Ganti `ARTICLE_ID` dengan ID artikel yang ingin diedit (contoh: `?id=2`)
- **Cara Menggunakan:**
  1. Buka halaman edit artikel dengan URL di atas
  2. Ubah fields yang ingin diperbarui:
     - Article Title (Judul Artikel)
     - Category (Kategori)
     - Content Body (Isi Artikel)
     - Status (Published/Draft)
  3. Klik tombol **"Update Article"**
  4. Tunggu success alert muncul
  5. Data akan tersimpan otomatis ke database

- **API Endpoint:** `PUT /api/posts/:id`
- **Validasi:** Title dan Content harus diisi

### 3. **DELETE (Hapus) - Move to Trash**
- **Tombol:** "Move to trash" di bagian Publishing Info (sidebar kanan)
- **Cara Menggunakan:**
  1. Klik tombol **"Move to trash"**
  2. Konfirmasi dialog akan muncul
  3. Klik "OK" untuk confirm penghapusan
  4. Artikel akan dihapus dari database
  5. Halaman akan otomatis redirect ke dashboard

- **API Endpoint:** `DELETE /api/posts/:id`
- **Catatan:** Aksi ini permanent dan tidak bisa di-undo

## 📱 Interface Elements

### Main Form Section
- **Article Title** - Input field untuk judul artikel
- **Category** - Dropdown pilihan kategori
- **Status** - Radio button untuk Published/Draft
- **Content Body** - Text area untuk isi artikel

### Sidebar - Publishing Info
- **Author** - Nama/ID penulis artikel
- **Visibility** - Status publik/private (badge)
- **Revisions** - Jumlah perubahan yang dilakukan
- **Move to trash** - Tombol untuk hapus artikel

## ⚡ Response & Feedback

### Success Messages
- **Update:** "Article updated successfully!" (alert hijau)
- **Delete:** "Article moved to trash successfully!" (alert hijau)

### Error Messages
- Jika Title atau Content kosong: Error alert akan muncul
- Jika API gagal: Error detail akan ditampilkan

### Button States
- Update button: Menampilkan "Updating..." saat proses
- Delete button: Disabled saat proses delete
- Cancel button: Kembali ke halaman sebelumnya

## 🗄️ Backend Routes

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/posts/:id` | Ambil data artikel |
| PUT | `/api/posts/:id` | Update artikel |
| DELETE | `/api/posts/:id` | Hapus artikel |

## 📊 Database Operations

Semua operasi CRUD sudah terintegrasi dengan database MySQL:
- Table: `posts`
- Fields: title, slug, content, image, category_id, status, created_at, updated_at

## 🚀 Testing

### Test Article IDs yang Tersedia
- **ID 1:** The Future of Enterprise Architecture in 2024 (sudah dihapus)
- **ID 2:** Getting Started with Node.js
- **ID 3:** Web Security Best Practices

Coba dengan URL: `http://localhost:3000/editor/create?id=2`

## ⚙️ Troubleshooting

### Halaman menampilkan "Error: No article ID provided"
- Pastikan URL sudah benar dengan parameter `?id=ARTICLE_ID`
- Contoh: `http://localhost:3000/editor/create?id=2`

### Button tidak bisa diklik
- Refresh halaman dengan F5
- Pastikan JavaScript sudah aktif di browser
- Check browser console untuk error (F12)

### Artikel tidak terupdate
- Check internet connection
- Lihat browser console untuk error message
- Pastikan semua required fields sudah diisi

### Database Error
- Pastikan server Node.js masih running
- Check database connection: `http://localhost:3000/test-koneksi`
- Verify MySQL server sudah running

---

**Created:** April 29, 2026  
**Last Updated:** April 29, 2026  
**Status:** ✅ Fully Functional
