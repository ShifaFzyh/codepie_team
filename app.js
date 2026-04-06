const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));

// Halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Proses login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Contoh data user (sementara, nanti dari database)
    let role = "";

    if(email === "admin@gmail.com" && password === "12345"){
        role = "admin";
    } else if(email === "user@gmail.com" && password === "12345"){
        role = "user";
    } else {
        return res.send("Login gagal!");
    }

    // Redirect berdasarkan role
    if(role === "admin"){
        res.redirect('/admin');
    } else if(role === "user"){
        res.redirect('/user');
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