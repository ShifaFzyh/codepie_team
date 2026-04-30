const db = require('../config/database');

class Categories {
    // Menampilkan semua kategori
    static getAll(callback) {
        const sql = "SELECT * FROM categories ORDER BY name ASC";
        db.query(sql, callback);
    }

    // Menampilkan kategori berdasarkan ID
    static getByID(id, callback) {
        const sql = "SELECT * FROM categories WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Menambahkan kategori baru
    static create(data, callback) {
        const sql = "INSERT INTO categories (name, slug) VALUES (?, ?)";
        db.query(sql, [data.name, data.slug], callback);
    }

    // Memperbarui kategori
    static update(id, data, callback) {
        const sql = "UPDATE categories SET name = ?, slug = ? WHERE id = ?";
        db.query(sql, [data.name, data.slug, id], callback);
    }

    // Menghapus kategori
    static delete(id, callback) {
        const sql = "DELETE FROM categories WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Categories;