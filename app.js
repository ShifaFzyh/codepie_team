const express = require('express');
const router = require('./routes/api');
const db = require('./config/database');

const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
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

// Route dashboard admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/dashboard_admin.html'));
});

// Route dashboard user
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/dashboard_user.html'));
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});