const Posts = require('../models/Posts');

class PostsController {
    // Mengambil semua data artikel
    static index(req, res) {
        Posts.getAll((err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil data posts",
                    error: err
                });
            }
            res.status(200).json({
                message: "Berhasil mengambil semua data posts",
                data: results
            });
        });
    }

    // Mengambil satu data artikel berdasarkan ID
    static show(req, res) {
        const id = req.params.id;
        Posts.getByID(id, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Terjadi kesalahan server", error: err });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }
            res.status(200).json({
                message: "Detail data post",
                data: result[0]
            });
        });
    }

    // Menyimpan artikel baru
    static store(req, res) {
        const data = req.body;
        
        // Validasi sederhana
        if (!data.title || !data.content) {
            return res.status(400).json({ message: "Title dan Content harus diisi" });
        }

        Posts.create(data, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Gagal menyimpan post", error: err });
            }
            res.status(201).json({
                message: "Post berhasil dibuat",
                id: result.insertId
            });
        });
    }

    // Memperbarui artikel
    static update(req, res) {
        const id = req.params.id;
        const data = req.body;

        Posts.update(id, data, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Gagal memperbarui post", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }
            res.status(200).json({ message: "Post berhasil diperbarui" });
        });
    }

    // Menghapus artikel
    static destroy(req, res) {
        const id = req.params.id;

        Posts.delete(id, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Gagal menghapus post", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Post tidak ditemukan" });
            }
            res.status(200).json({ message: "Post berhasil dihapus" });
        });
    }
}

module.exports = PostsController;
