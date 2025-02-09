const express = require('express')
const router = express.Router()
const { updateUser } = require('../controllers/user')

router.patch('/updateUser/:id', updateUser);

module.exports = router