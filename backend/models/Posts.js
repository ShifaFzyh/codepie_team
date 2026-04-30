const db = require('../config/database');

class Posts {
    // Menampilkan semua data post
    static getAll(callback) {
        const sql = "SELECT * FROM posts ORDER BY id DESC";
        db.query(sql, callback);
    }

    // Menampilkan data berdasarkan ID
    static getByID(id, callback) {
        const sql = "SELECT * FROM posts WHERE id = ?";
        db.query(sql, [id], callback);
    }

    // Menambahkan data baru
    static create(data, callback) {
        const sql = `
            INSERT INTO posts 
            (title, slug, content, thumbnail, status, views, idcategories, idusers) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [
            data.title,
            data.slug,
            data.content,
            data.thumbnail,
            data.status, 
            data.views || 0, // Default 0 jika tidak diisi
            data.idcategories,
            data.idusers
        ], callback);
    }

    // Memperbarui data post
    static update(id, data, callback) {
        const sql = `
            UPDATE posts 
            SET title = ?, slug = ?, content = ?, thumbnail = ?, status = ?, 
                views = ?, idcategories = ?, idusers = ? 
            WHERE id = ?`;
        
        db.query(sql, [
            data.title,
            data.slug,
            data.content,
            data.thumbnail,
            data.status,
            data.views,
            data.idcategories,
            data.idusers,
            id
        ], callback);
    }

    // Menghapus data post
    static delete(id, callback) {
        const sql = "DELETE FROM posts WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Posts;