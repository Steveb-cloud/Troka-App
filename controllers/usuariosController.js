const { poolPromise, sql } = require('../config/db.js');

const getUsuarios = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getUsuarios,
};
