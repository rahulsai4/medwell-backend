const express = require('express')
const router = express.Router()
const { updateUser } = require('../controllers/user')

router.patch('/updateUser', updateUser);

module.exports = router