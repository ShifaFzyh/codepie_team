const Posts = require('../models/Posts');
const errorHandler = require('../utils/errorHandler');
const { validatePost, validateId } = require('../utils/postValidation');
const upload = require('../utils/upload');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, HeadingLevel, TextRun } = require('docx');


class PostsController {

    // Ambil semua data (dengan filter status, search, category, date)
    static index(req, res) {
        try {
            const { status, search, category, startDate, endDate } = req.query;

            Posts.getFiltered({ status, search, category, startDate, endDate }, (err, results) => {
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

    // Ambil 1 data (bisa via ID atau slug)
    static show(req, res) {
        try {
            const identifier = req.params.slug;
            const isNumeric = !isNaN(identifier);

            const handleResult = (err, result) => {
                if (err) return errorHandler(res, err);
                if (result.length === 0) {
                    return errorHandler(res, "Post tidak ditemukan", 404);
                }
                res.status(200).json({
                    success: true,
                    message: "Detail data post",
                    data: result[0]
                });
            };

            if (isNumeric) {
                Posts.getByID(identifier, handleResult);
            } else {
                Posts.getBySlug(identifier, handleResult);
            }
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

                const slug = req.body.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') + '-' + Date.now();

                const data = {
                    ...req.body,
                    slug,
                    idusers: req.user.id,
                    thumbnail: req.file ? req.file.filename : null
                };

                Posts.create(data, (err, result) => {
                    if (err) return errorHandler(res, err);

                    res.status(201).json({
                        success: true,
                        message: "Post berhasil dibuat",
                        id: result.insertId,
                        thumbnail: data.thumbnail ? `/uploads/${data.thumbnail}` : null
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

                Posts.getByID(req.params.id, (errFind, existingResult) => {
                    if (errFind) return errorHandler(res, errFind);
                    if (existingResult.length === 0) {
                        return errorHandler(res, "Post tidak ditemukan", 404);
                    }

                    const existing = existingResult[0];

                    const data = {
                        ...req.body,
                        thumbnail: req.file ? req.file.filename : existing.thumbnail,
                        idusers: req.body.idusers || existing.idusers
                    };

                    if (req.file && existing.thumbnail) {
                        const oldImage = path.join(__dirname, '../uploads', existing.thumbnail);
                        if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
                    }

                    Posts.update(req.params.id, data, (err, result) => {
                        if (err) return errorHandler(res, err);
                        if (result.affectedRows === 0) return errorHandler(res, "Post tidak ditemukan", 404);

                        res.status(200).json({
                            success: true,
                            message: "Post berhasil diperbarui"
                        });
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

    // Statistik milik user yang login
    static myStats(req, res) {
        try {
            const userId = req.user.id;

            const sql = `
                SELECT 
                    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS totalPublished,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS totalPending,
                    COALESCE(SUM(views), 0) AS totalViews
                FROM posts
                WHERE idusers = ?
            `;

            db.query(sql, [userId], (err, results) => {
                if (err) return errorHandler(res, err);

                res.status(200).json({
                    totalPublished: results[0].totalPublished || 0,
                    totalPending: results[0].totalPending || 0,
                    totalViews: results[0].totalViews || 0,
                });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Daftar artikel milik user yang login
    static myPosts(req, res) {
        try {
            const userId = req.user.id;

            const sql = `
                SELECT p.*, c.category_name, c.slug AS category_slug
                FROM posts p
                LEFT JOIN categories c ON p.idcategories = c.id
                WHERE p.idusers = ?
                ORDER BY p.id DESC
            `;

            db.query(sql, [userId], (err, results) => {
                if (err) return errorHandler(res, err);

                res.status(200).json(results);
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // Top artikel terbanyak dibaca
    static topViewed(req, res) {
        try {
            const sql = `
                SELECT p.id, p.title, p.views, c.category_name
                FROM posts p
                LEFT JOIN categories c ON p.idcategories = c.id
                ORDER BY p.views DESC
                LIMIT 10
            `;
            db.query(sql, (err, results) => {
                if (err) return errorHandler(res, err);
                res.status(200).json({ success: true, data: results });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    }

    static stats(req, res) {
        try {
            const sql = `
                SELECT 
                    COUNT(*) AS totalArticles,
                    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS totalPublished,
                    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS totalDrafts,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS totalPending,
                    COALESCE(SUM(views), 0) AS totalViews
                FROM posts
            `;
            db.query(sql, (err, results) => {
                if (err) return errorHandler(res, err);

                const userSql = `SELECT COUNT(*) AS totalUsers FROM users`;
                db.query(userSql, (err2, userResults) => {
                    if (err2) return errorHandler(res, err2);

                    res.status(200).json({
                        success: true,
                        data: {
                            totalArticles: results[0].totalArticles || 0,
                            totalPublished: results[0].totalPublished || 0,
                            totalDrafts: results[0].totalDrafts || 0,
                            totalPending: results[0].totalPending || 0,
                            totalViews: results[0].totalViews || 0,
                            totalUsers: userResults[0].totalUsers || 0,
                        }
                    });
                });
            });
        } catch (err) {
            return errorHandler(res, err);
        }
    }

    // ✅ Helper: bersihkan HTML tag jadi teks polos
    static stripHtml(html) {
        if (!html) return '';
        return html
            .replace(/<\/(p|div|h[1-6]|li|br)>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // ✅ Download artikel sebagai PDF
    static downloadPDF(req, res) {
        const slug = req.params.slug;

        Posts.getBySlug(slug, (err, result) => {
            if (err) return errorHandler(res, err);
            if (result.length === 0) return errorHandler(res, "Post tidak ditemukan", 404);

            const post = result[0];
            const plainContent = PostsController.stripHtml(post.content);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${post.slug}.pdf"`);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(res);

            doc.fontSize(20).font('Helvetica-Bold').text(post.title, { align: 'left' });
            doc.moveDown(0.5);

            doc.fontSize(10).font('Helvetica').fillColor('gray')
                .text(`Oleh ${post.author_name || post.author_username || 'Anonim'}  •  ${new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`);
            doc.moveDown(1);

            doc.fillColor('black').fontSize(12).font('Helvetica')
                .text(plainContent, { align: 'justify', lineGap: 4 });

            doc.end();
        });
    }

    // ✅ Download artikel sebagai Word (.docx)
    static downloadDocx(req, res) {
        const slug = req.params.slug;

        Posts.getBySlug(slug, async (err, result) => {
            if (err) return errorHandler(res, err);
            if (result.length === 0) return errorHandler(res, "Post tidak ditemukan", 404);

            const post = result[0];
            const plainContent = PostsController.stripHtml(post.content);
            const paragraphs = plainContent.split('\n').filter(p => p.trim());

            const doc = new Document({
                sections: [{
                    children: [
                        new Paragraph({
                            text: post.title,
                            heading: HeadingLevel.HEADING_1
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Oleh ${post.author_name || post.author_username || 'Anonim'} • ${new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                                    italics: true,
                                    color: '888888'
                                })
                            ],
                            spacing: { after: 300 }
                        }),
                        ...paragraphs.map(text => new Paragraph({
                            text,
                            spacing: { after: 200 }
                        }))
                    ]
                }]
            });

            try {
                const buffer = await Packer.toBuffer(doc);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `attachment; filename="${post.slug}.docx"`);
                res.send(buffer);
            } catch (genErr) {
                return errorHandler(res, genErr);
            }
        });
    }

}

module.exports = PostsController;