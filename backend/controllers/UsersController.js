const bcrypt = require('bcrypt');
const Users = require("../models/Users");
const { generateToken } = require('../utils/jwtHelper');

class UsersController {

    // ==================== AUTH ====================

    // Register user baru
    async register(req, res) {
        const { username, name, email, password } = req.body;

        Users.findByEmail(email, async (err, result) => {
            if (err) return res.status(500).json({ message: "Server error" });

            // Cek apakah email sudah terdaftar
            if (result.length > 0) {
                return res.status(400).json({ message: "Email sudah terdaftar" });
            }

            // Hash password sebelum disimpan
            const hashedPassword = await bcrypt.hash(password, 10);

            const data = { username, name, email, password: hashedPassword, status: 'active' };

            Users.create(data, (err, result) => {
                if (err) return res.status(500).json({ message: "Gagal mendaftar" });
                res.status(201).json({
                    message: "Registrasi berhasil",
                    id: result.insertId
                });
            });
        });
    }

    // Login user
    async login(req, res) {
        const { email, password } = req.body;

        Users.findByEmail(email, async (err, result) => {
            if (err) return res.status(500).json({ message: "Server error" });

            // Cek apakah user ditemukan
            if (result.length === 0) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            const user = result[0];

            // Bandingkan password dengan hash
            const isMatch = password === user.password;
            if (!isMatch) {
                return res.status(401).json({ message: "Email atau password salah" });
            }

            // Buat token JWT
            const token = generateToken({ id: user.id, email: user.email, role: user.role });

            res.status(200).json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    }

    // ==================== CRUD ====================

    // Menampilkan semua users
    index(req, res) {
        Users.getAll((err, results) => {
            if (err) return res.status(500).json({ message: "Gagal mengambil data users" });
            res.json({ message: "Berhasil mengambil data users", data: results });
        });
    }

    // Menampilkan user berdasarkan ID
    show(req, res) {
        const { id } = req.params;
        Users.getByID(id, (err, result) => {
            if (err || !result.length) return res.status(404).json({ message: "Data tidak ditemukan" });
            res.json({ message: "Detail users", data: result[0] });
        });
    }

    // Menambah user baru
    store(req, res) {
        const data = req.body;
        Users.create(data, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal menambah user" });
            res.json({ message: "User berhasil ditambahkan", id: result.insertId });
        });
    }

    // Memperbarui data user
    update(req, res) {
        const { id } = req.params;
        const data = req.body;
        Users.update(id, data, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal memperbarui user" });
            res.json({ message: "User berhasil diperbarui" });
        });
    }

    // Menghapus user
    destroy(req, res) {
        const { id } = req.params;
        Users.delete(id, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal menghapus user" });
            res.json({ message: "User berhasil dihapus" });
        });
    }
}

module.exports = new UsersController();