const Categories = require('../models/Categories');

class CategoriesController {
    static index(req, res) {
        Categories.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ data: results });
        });
    }

    static show(req, res) {
        Categories.getByID(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) return res.status(404).json({ message: "Kategori tidak ditemukan" });
            res.json({ data: result[0] });
        });
    }

    static store(req, res) {
        const { name, slug } = req.body;
        if (!name || !slug) return res.status(400).json({ message: "Name dan Slug harus diisi" });

        Categories.create({ name, slug }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Kategori berhasil dibuat", id: result.insertId });
        });
    }

    static update(req, res) {
        Categories.update(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Kategori berhasil diperbarui" });
        });
    }

    static destroy(req, res) {
        Categories.delete(req.params.id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Kategori berhasil dihapus" });
        });
    }
}

module.exports = CategoriesController;