const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_dashboard_artikel"
});

//test koneksi
db.connect((err) => {
    if (err) {
        console.log("Koneksi database gagal: ", err);
        return;
    } else {
        console.log("Koneksi database berhasil!");
    }
});

module.exports = db;