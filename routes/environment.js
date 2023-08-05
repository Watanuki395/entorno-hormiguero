const express = require('express')
const router = express.Router()
// const checkOrigin = require('../middleware/origin')
//const checkAuth = require('../middleware/auth')
// const checkRoleAuth = require('../middleware/roleAuth')
const { getFullEnvironment, getAntCost, getUnassignedEnvironment, setNewEnvironment } = require('../controllers/environmentController')


router.get('/next', getUnassignedEnvironment )

router.get('/full', getFullEnvironment )

router.get('/ant-cost', getAntCost )



router.post('/new', setNewEnvironment )





module.exports = router