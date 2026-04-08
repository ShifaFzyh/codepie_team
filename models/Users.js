const db = require('../config/database');

class Users {
    //model menampilkan data
    static getAll(callback){
        const sql = "SELECT * FROM users";
        db.query(sql, callbcack);
    }
    //menampilkan data by id
    static getByID(id, callback){
        const sql = "SELECT * FROM user WHERE id = ?";
        db.query(sql, [id], callback);
    }
}
module.exports = Users;