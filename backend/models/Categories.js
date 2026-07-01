const db = require('../config/database');

class Categories {
    // Menampilkan semua kategori
    static getAll(callback) {
        const sql = "SELECT * FROM categories ORDER BY category_name ASC";
        db.query(sql, callback);
    }

    // Menampilkan kategori berdasarkan ID
    static getByID(id, callback) {
        const sql = "SELECT * FROM categories WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Menambahkan kategori baru
    static create(data, callback) {
        const sql = "INSERT INTO categories (category_name, slug) VALUES (?, ?)";
        db.query(sql, [data.category_name, data.slug], callback);
    }

    // Memperbarui kategori
    static update(id, data, callback) {
        const sql = "UPDATE categories SET category_name = ?, slug = ? WHERE id = ?";
        db.query(sql, [data.category_name, data.slug, id], callback);
    }

    // Menghapus kategori
    static delete(id, callback) {
        const sql = "DELETE FROM categories WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Categories;