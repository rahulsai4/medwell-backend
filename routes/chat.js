const express = require('express')
const router = express.Router()
const diagnoseChat = require("../controllers/diagnosis");
const {getAllChats, getDiagnosisChat, getDietChat, getFitnessChat} = require("../controllers/chat");


router.get("/getAllChats", getAllChats)
    .get("/getDiagnosisChat", getDiagnosisChat)
    .get("/getDietChat", getDietChat)
    .get("/getFitnessChat", getFitnessChat);

router.get("/diagnose", diagnoseChat);

module.exports = router;