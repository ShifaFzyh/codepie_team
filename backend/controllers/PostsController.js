const Posts = require('../models/Posts');
const errorHandler = require('../utils/errorHandler');
const { validatePost, validateId } = require('../utils/postValidation');

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
            if (error) return errorHandler(res, error, 400, error);

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

    // Tambah data
    static store(req, res) {
        try {
            const error = validatePost(req.body);
            if (error) return errorHandler(res, error, 400, error);

            Posts.create(req.body, (err, result) => {
                if (err) return errorHandler(res, err);

                res.status(201).json({
                    success: true,
                    message: "Post berhasil dibuat",
                    id: result.insertId
                });
            });

        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Update data
    static update(req, res) {
        try {
            const errorId = validateId(req.params.id);
            if (errorId) return errorHandler(res, errorId, 400, errorId);

            const error = validatePost(req.body);
            if (error) return errorHandler(res, error, 400, error);

            Posts.update(req.params.id, req.body, (err, result) => {
                if (err) return errorHandler(res, err);

                if (result.affectedRows === 0) {
                    return errorHandler(res, "Post tidak ditemukan", 404);
                }

                res.status(200).json({
                    success: true,
                    message: "Post berhasil diperbarui"
                });
            });

        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Hapus data
    static destroy(req, res) {
        try {
            const error = validateId(req.params.id);
            if (error) return errorHandler(res, error, 400, error);

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
