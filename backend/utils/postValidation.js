function validatePost(data) {
    if (!data.title) return "Title wajib diisi";
    if (!data.content) return "Content wajib diisi";
    return null;
}

function validateId(id) {
    if (!id || isNaN(id)) return "ID tidak valid";
    return null;
}

module.exports = { validatePost, validateId };
