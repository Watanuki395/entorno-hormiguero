const Entorno = require('../models/Enemy')

const getAllEntorno = async (req, res) => {
    try {
        res.json({status: 200,
            message: "🌱Estas son tus hormigas 🐜🐜🐜🐜"})
    } catch (e) {
        res.json({status: 404,
            message: "Error 🐜🐜🐜🐜"})
    }
}



module.exports = { getAllEntorno }