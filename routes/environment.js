const express = require('express')
const router = express.Router()
// const checkOrigin = require('../middleware/origin')
//const checkAuth = require('../middleware/auth')
// const checkRoleAuth = require('../middleware/roleAuth')
const { getFullEnvironment, getAntCost, getUnassignedEnvironment, setNewEnvironment, updateAssignedObjects, deleteEnvironmentById } = require('../controllers/environmentController')


router.get('/next-task', getUnassignedEnvironment )

router.get('/full', getFullEnvironment )

router.get('/ant-cost', getAntCost )

router.patch('/update-task', updateAssignedObjects);

router.post('/new', setNewEnvironment )

router.delete('/destroy', deleteEnvironmentById )





module.exports = router