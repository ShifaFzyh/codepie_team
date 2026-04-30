const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Pastikan path ini benar. Jika app.js di folder backend, maka panggil ./
const router = require('./routes/api'); 
const db = require('./config/database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Melayani file statis dari folder frontend yang sejajar dengan backend
app.use(express.static(path.join(__dirname, '../frontend/public')));
// Masukkan router API
app.use(router);


// Test koneksi database
app.get("/test-koneksi", (req, res) =>{
    db.query("SELECT 1", (err, result) => {
        if (err) {
            console.error("Gagal kueri:", err); // Lihat log di terminal
            res.status(500).json({ message: "Koneksi database ke MySQL gagal"});
        } else {
            res.json({ message: "Koneksi database berhasil!", result: result });
        }
    });
});

// Halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

// Route dashboard admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/dashboard_admin.html'));
});

// Route admin articles management
app.get('/admin/articles/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/admin_createArtikel.html'));
});

app.get('/admin/articles/:id/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/admin_editArtikel.html'));
});

app.get('/admin/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/admin_kelolaUser.html'));
});

// Route form tambah user
app.get('/admin/users/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/kelolaUser.html'));
});

// Route dashboard editor
app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/dashboard_user.html'));
});

app.get('/editor/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/user_editArtikel.html'));
});

// Route untuk edit artikel user
app.get('/editor/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/user_editArtikel.html'));
});

// Proses login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Cek data user
    let role = "";

    if(email === "admin@gmail.com" && password === "12345"){
        role = "admin";
    } else if(email === "editor@gmail.com" && password === "12345"){
        role = "editor";
    } else {
        return res.send("Login gagal!");
    }


    // Redirect berdasarkan role
    if(role === "admin"){
        res.redirect('/admin');
    } else if(role === "editor"){
        res.redirect('/editor');
    }

});

// Server listening
app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});