const express = require('express')
const router = express.Router()
const diagnoseChat = require("../controllers/diagnosis");
const dietChat = require("../controllers/diet");
const fitnessChat = require("../controllers/fitness");
const {getAllChats, getDiagnosisChat, getDietChat, getFitnessChat} = require("../controllers/chat");


router.get("/getAllChats", getAllChats)
    .get("/getDiagnosisChat", getDiagnosisChat)
    .get("/getDietChat", getDietChat)
    .get("/getFitnessChat", getFitnessChat);

router.post("/diagnose", diagnoseChat);
router.post("/diet", dietChat);
router.post("/fitness", fitnessChat);

module.exports = router;