const Posts = require('../models/Posts');
const errorHandler = require('../utils/errorHandler');
const { validatePost, validateId } = require('../utils/postValidation');
const upload = require('../utils/upload');
const fs = require('fs');
const path = require('path');


class PostsController {


    // Ambil semua data
    static index(req, res) {
        try {
            Posts.getAll((err, results) => {
                if (err) return errorHandler(res, err);

                res.status(200).json({
                    success: true,
                    message: "Berhasil mengambil semua data posts",
                    data: results
                });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Ambil 1 data
    static show(req, res) {
        try {
            const error = validateId(req.params.id);
            if (error) return errorHandler(res, error, 400);

            Posts.getByID(req.params.id, (err, result) => {
                if (err) return errorHandler(res, err);

                if (result.length === 0) {
                    return errorHandler(res, "Post tidak ditemukan", 404);
                }

                res.status(200).json({
                    success: true,
                    message: "Detail data post",
                    data: result[0]
                });
            });

        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Tambah data + upload gambar
static store(req, res) {
    upload.single('image')(req, res, (uploadErr) => {
        if (uploadErr) return errorHandler(res, uploadErr.message, 400);

        try {
            const error = validatePost(req.body);
            if (error) return errorHandler(res, error, 400);

            // ✅ Generate slug otomatis dari title
           const slug = req.body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();

            const data = {
                ...req.body,
                slug,
                image: req.file ? req.file.filename : null
            };

            Posts.create(data, (err, result) => {
                if (err) return errorHandler(res, err);

                res.status(201).json({
                    success: true,
                    message: "Post berhasil dibuat",
                    id: result.insertId,
                    image: data.image ? `/uploads/${data.image}` : null
                });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    });
}
// Update data + ganti gambar
static update(req, res) {
    upload.single('image')(req, res, (uploadErr) => {
        if (uploadErr) return errorHandler(res, uploadErr.message, 400);

        try {
            const errorId = validateId(req.params.id);
            if (errorId) return errorHandler(res, errorId, 400);

            const error = validatePost(req.body);
            if (error) return errorHandler(res, error, 400);

            const data = { ...req.body };

            if (req.file) {
                data.image = req.file.filename;

                // Hapus gambar lama
                Posts.getByID(req.params.id, (err, result) => {
                    if (!err && result.length > 0 && result[0].image) {
                        const oldImage = path.join(__dirname, '../uploads', result[0].image);
                        if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
                    }
                });
            }

            Posts.update(req.params.id, data, (err, result) => {
                if (err) return errorHandler(res, err);
                if (result.affectedRows === 0) return errorHandler(res, "Post tidak ditemukan", 404);

                res.status(200).json({
                    success: true,
                    message: "Post berhasil diperbarui"
                });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    });
}

    // Hapus data
    static destroy(req, res) {
        try {
            const error = validateId(req.params.id);
            if (error) return errorHandler(res, error, 400);

            Posts.delete(req.params.id, (err, result) => {
                if (err) return errorHandler(res, err);

                if (result.affectedRows === 0) {
                    return errorHandler(res, "Post tidak ditemukan", 404);
                }

                res.status(200).json({
                    success: true,
                    message: "Post berhasil dihapus"
                });
            });

        } catch (err) {
            return errorHandler(res, err);
        }
    }


}


module.exports = PostsController;
