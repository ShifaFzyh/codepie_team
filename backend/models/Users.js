const db = require('../config/database');

class Users {
    static getAll(callback) {
        const sql = "SELECT * FROM users";
        db.query(sql, callback);
    }

    static getByID(id, callback) {
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }

    static create(data, callback) {
        const { username, name, email, password, role } = data;
        const sql = "INSERT INTO users (username, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [username, name, email, password, role], callback);
    }

    static update(id, data, callback) {
        const { username, name, email, role, status } = data;
        const sql = "UPDATE users SET username = ?, name = ?, email = ?, role = ?, status = ? WHERE id = ?";
        db.query(sql, [username, name, email, role, status, id], callback);
    }

    static delete(id, callback) {
        const sql = "DELETE FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }

    static findByEmail(email, callback) {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], callback);
    }

    static findByUsernameOrEmail(identifier, callback) {
        const query = "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1";
        db.query(query, [identifier, identifier], callback);
    }

    // ✅ BARU: update profil sendiri (nama dan/atau password)
    static updateProfile(id, data, callback) {
        const fields = [];
        const values = [];

        if (data.name) {
            fields.push("name = ?");
            values.push(data.name);
        }
        if (data.password) {
            fields.push("password = ?");
            values.push(data.password);
        }

        if (fields.length === 0) {
            return callback(null, { affectedRows: 0 });
        }

        values.push(id);
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        db.query(sql, values, callback);
    }
}

module.exports = Users;