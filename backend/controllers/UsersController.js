const Users = require("../models/Users");

class UsersController {
    // Menampilkan semua users
    index(req, res) {
        Users.getAll((err, results) => {
            if (err) return res.json({ message: "Gagal mengambil data users" });
            res.json({ message: "Berhasil mengambil data users", data: results });
        });
    }

    // Menampilkan user berdasarkan ID
    show(req, res) {
        const { id } = req.params;
        Users.getByID(id, (err, result) => {
            if (err || !result.length) return res.json({ message: "Data tidak ditemukan" });
            res.json({ message: "Detail users", data: result[0] });
        });
    }

    // Menambah user baru
    store(req, res) {
        const data = req.body;
        Users.create(data, (err, result) => {
            if (err) return res.json({ message: "Gagal menambah user" });
            res.json({ message: "User berhasil ditambahkan", id: result.insertId });
        });
    }

    // Memperbarui data user
    update(req, res) {
        const { id } = req.params;
        const data = req.body;
        Users.update(id, data, (err, result) => {
            if (err) return res.json({ message: "Gagal memperbarui user" });
            res.json({ message: "User berhasil diperbarui" });
        });
    }

    // Menghapus user
    destroy(req, res) {
        const { id } = req.params;
        Users.delete(id, (err, result) => {
            if (err) return res.json({ message: "Gagal menghapus user" });
            res.json({ message: "User berhasil dihapus" });
        });
    }
}

module.exports = new UsersController();