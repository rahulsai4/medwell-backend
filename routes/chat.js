const express = require('express')
const router = express.Router()
const diagnoseChat = require("../controllers/diagnosis");

router.get("/diagnose", diagnoseChat);

module.exports = router;