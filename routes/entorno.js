const express = require('express')
const router = express.Router()
// const checkOrigin = require('../middleware/origin')
//const checkAuth = require('../middleware/auth')
// const checkRoleAuth = require('../middleware/roleAuth')
const { getAllEntorno } = require('../controllers/entornoController')



router.get('/', getAllEntorno )





module.exports = router