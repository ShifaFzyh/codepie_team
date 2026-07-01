const db = require('../config/database');

class Posts {
    // Menampilkan semua data post (dengan info kategori & penulis)
    static getAll(callback) {
        const sql = `
            SELECT p.*, c.category_name, c.slug AS category_slug,
                   u.name AS author_name, u.username AS author_username, u.email AS author_email
            FROM posts p
            LEFT JOIN categories c ON p.idcategories = c.id
            LEFT JOIN users u ON p.idusers = u.id
            ORDER BY p.id DESC
        `;
        db.query(sql, callback);
    }

    // ✅ Menampilkan data dengan filter dinamis (status, search, category, date) + info penulis
    static getFiltered(filters, callback) {
        let sql = `
            SELECT p.*, c.category_name, c.slug AS category_slug,
                   u.name AS author_name, u.username AS author_username, u.email AS author_email
            FROM posts p
            LEFT JOIN categories c ON p.idcategories = c.id
            LEFT JOIN users u ON p.idusers = u.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.status) {
            sql += ` AND p.status = ?`;
            params.push(filters.status);
        }
        if (filters.search) {
            sql += ` AND (p.title LIKE ? OR p.content LIKE ?)`;
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        if (filters.category) {
            if (!isNaN(filters.category)) {
                sql += ` AND p.idcategories = ?`;
            } else {
                sql += ` AND c.slug = ?`;
            }
            params.push(filters.category);
        }
        if (filters.startDate) {
            sql += ` AND p.created_at >= ?`;
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            sql += ` AND p.created_at <= ?`;
            params.push(filters.endDate);
        }

        sql += ` ORDER BY p.id DESC`;
        db.query(sql, params, callback);
    }

    // Menampilkan data berdasarkan ID (dengan info kategori & penulis)
    static getByID(id, callback) {
        const sql = `
            SELECT p.*, c.category_name, c.slug AS category_slug,
                   u.name AS author_name, u.username AS author_username, u.email AS author_email
            FROM posts p
            LEFT JOIN categories c ON p.idcategories = c.id
            LEFT JOIN users u ON p.idusers = u.id
            WHERE p.id = ?
        `;
        db.query(sql, [id], callback);
    }

    // ✅ Menampilkan data berdasarkan slug (untuk halaman detail publik & download)
    static getBySlug(slug, callback) {
        const sql = `
            SELECT p.*, c.category_name, c.slug AS category_slug,
                   u.name AS author_name, u.username AS author_username, u.email AS author_email
            FROM posts p
            LEFT JOIN categories c ON p.idcategories = c.id
            LEFT JOIN users u ON p.idusers = u.id
            WHERE p.slug = ?
        `;
        db.query(sql, [slug], callback);
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
            data.views || 0,
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

    // Ambil data berdasarkan slug (untuk halaman detail publik)
    static getBySlug(slug, callback) {
        const sql = `
        SELECT p.*, c.category_name, c.slug AS category_slug,
               u.name AS author_name, u.username AS author_username, u.email AS author_email
        FROM posts p
        LEFT JOIN categories c ON p.idcategories = c.id
        LEFT JOIN users u ON p.idusers = u.id
        WHERE p.slug = ?
    `;
        db.query(sql, [slug], callback);
    }

    // Helper: bersihkan HTML tag jadi teks polos
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

    // Download artikel sebagai PDF
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

    // Download artikel sebagai Word (.docx)
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

module.exports = Posts;