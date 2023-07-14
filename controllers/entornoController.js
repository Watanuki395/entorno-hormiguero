//const { httpError } = require('../helpers/handleError')
//var db = require("../models");

const getAllEntorno = async (req, res) => {
    try {
        res.send({ msg: 'Este es tu entorno 🌱' })
    } catch (e) {
        res.send({ error: 'Esto fue un error de entorno' })
    }
}


module.exports = { getAllEntorno }