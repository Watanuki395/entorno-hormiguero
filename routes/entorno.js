const express = require('express')
const router = express.Router()
// const checkOrigin = require('../middleware/origin')
//const checkAuth = require('../middleware/auth')
// const checkRoleAuth = require('../middleware/roleAuth')
const { getAllEntorno, setEntorno } = require('../controllers/entornoController')



router.get('/', getAllEntorno )

router.post('/', setEntorno )





module.exports = router