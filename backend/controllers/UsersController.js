const bcrypt = require('bcrypt');
const Users = require("../models/Users");
const { generateToken } = require('../utils/jwtHelper');

class UsersController {

    // ==================== AUTH ====================

    async register(req, res) {
        const { username, name, email, password } = req.body;

        Users.findByEmail(email, async (err, result) => {
            if (err) return res.status(500).json({ message: "Server error" });

            if (result.length > 0) {
                return res.status(400).json({ message: "Email sudah terdaftar" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const data = { username, name, email, password: hashedPassword, role: 'editor', status: 'active' };

            Users.create(data, (err, result) => {
                if (err) return res.status(500).json({ message: "Gagal mendaftar" });
                res.status(201).json({
                    message: "Registrasi berhasil",
                    id: result.insertId
                });
            });
        });
    }

    async login(req, res) {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Username/email dan password wajib diisi" });
        }

        Users.findByUsernameOrEmail(identifier, async (err, result) => {
            if (err) return res.status(500).json({ message: "Server error" });

            if (result.length === 0) {
                return res.status(401).json({ message: "Username/email atau password salah" });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Username/email atau password salah" });
            }

            const token = generateToken({ id: user.id, email: user.email, role: user.role });

            res.status(200).json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    }

    // ✅ Update profil milik user yang login
    async updateProfile(req, res) {
        try {
            const userId = req.user.id; // diambil dari token (authenticate middleware)
            const { name, password } = req.body;

            const data = {};
            if (name) data.name = name;
            if (password) {
                data.password = await bcrypt.hash(password, 10);
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ message: "Tidak ada data yang diperbarui" });
            }

            Users.updateProfile(userId, data, (err, result) => {
                if (err) return res.status(500).json({ message: "Gagal memperbarui profil" });

                res.status(200).json({
                    message: "Profil berhasil diperbarui",
                    user: { name: data.name }
                });
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // ==================== CRUD ====================

    index(req, res) {
        Users.getAll((err, results) => {
            if (err) return res.status(500).json({ message: "Gagal mengambil data users" });
            res.json({ message: "Berhasil mengambil data users", data: results });
        });
    }

    show(req, res) {
        const { id } = req.params;
        Users.getByID(id, (err, result) => {
            if (err || !result.length) return res.status(404).json({ message: "Data tidak ditemukan" });
            res.json({ message: "Detail users", data: result[0] });
        });
    }

    store(req, res) {
        const data = req.body;
        Users.create(data, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal menambah user" });
            res.json({ message: "User berhasil ditambahkan", id: result.insertId });
        });
    }

    update(req, res) {
        const { id } = req.params;
        const data = req.body;
        Users.update(id, data, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal memperbarui user" });
            res.json({ message: "User berhasil diperbarui" });
        });
    }

    destroy(req, res) {
        const { id } = req.params;
        Users.delete(id, (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal menghapus user" });
            res.json({ message: "User berhasil dihapus" });
        });
    }
}

module.exports = new UsersController();