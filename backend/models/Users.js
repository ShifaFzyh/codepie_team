const db = require('../config/database');

class Users {
    // Menampilkan semua data user
    static getAll(callback) {
        const sql = "SELECT * FROM users";
        db.query(sql, callback);
    }

    // Menampilkan data user berdasarkan ID
    static getByID(id, callback) {
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Menambah user baru (Create)
    static create(data, callback) {
        const { username, name, email, password, role } = data;
        const sql = "INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [username, name, email, password, role], callback);
    }

    // Memperbarui data user (Update)
    static update(id, data, callback) {
        const { username, name, email, role, status } = data;
        const sql = "UPDATE users SET username = ?, name = ?, email = ?, role = ?, status = ? WHERE id = ?";
        db.query(sql, [username, name, email, role, status, id], callback);
    }

    // Menghapus user (Delete)
    static delete(id, callback) {
        const sql = "DELETE FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Users;