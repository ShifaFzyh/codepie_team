const db = require('../config/database');// Pastikan path ke koneksi database sudah benar

class Posts {
    // Mengambil semua data artikel
    static getAll(callback) {
        const sql = "SELECT * FROM posts ORDER BY created_at DESC";
        db.query(sql, callback);
    }

    // Mengambil satu artikel berdasarkan ID
    static getByID(id, callback) {
        const sql = "SELECT * FROM posts WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Menambah artikel baru
    static create(data, callback) {
        const { title, slug, content, image, author_id, category_id } = data;
        const sql = "INSERT INTO posts (title, slug, content, image, author_id, category_id) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [title, slug, content, image, author_id, category_id], callback);
    }

    // Memperbarui artikel
    static update(id, data, callback) {
        const { title, slug, content, image, category_id } = data;
        const sql = "UPDATE posts SET title = ?, slug = ?, content = ?, image = ?, category_id = ? WHERE id = ?";
        db.query(sql, [title, slug, content, image, category_id, id], callback);
    }

    // Menghapus artikel
    static delete(id, callback) {
        const sql = "DELETE FROM posts WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Posts;