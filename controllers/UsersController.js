const Users = require ("../models/Users")
class UsersController {
    index(req, res) {
        Users.getAll((err, results) =>{
            if (err) {
                return res.json({ message: "Gagal mengambil data users"});
            }
            res.json({
                message: "Berhasil mengambil data users",
                data: results
            });
        });

    }

    //controller untuk menampilkan data users berdasarkan id
    show (req, res){
        const {id} = req.params;
        Users.getByID(id, (err, result) => {
            if (err) {
                return res.json({ message: "Data tidak ditemukan"});
            }
            res.json({
                message: "Detail users",
                data: result[0]
            });
        });

    }
    store(req, res) {
        res.send ("Menambahkan data users");
    }
    update(req, res) {
        const {id} = req.params;
        res.send (`Mengupdate data users ${id}`);
    }
    destroy(req, res) {
        const {id} = req.params;
        res.send (`Menghapus data users ${id}`);
    }

}
const object = new UsersController();

module.exports = object;