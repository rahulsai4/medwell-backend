const Chat = require("../models/Chat");

const getAllChats = async (req, res) => {
  const userId = req.user.userId;

  const diagnosisChat = await extractChat(userId, "diagnosis");
  const dietChat = await extractChat(userId, "diet");
  const fitnessChat = await extractChat(userId, "fitness");

  res.status(200).json({ diagnosisChat, dietChat, fitnessChat });
};

const getDiagnosisChat = async (req, res) => {
  const userId = req.user.userId;
  const diagnosisChat = await extractChat(userId, "diagnosis");
  res.status(200).json(diagnosisChat);
};

const getDietChat = async (req, res) => {
  const userId = req.user.userId;
  const dietChat = await extractChat(userId, "diet");
  res.status(200).json(dietChat);
};

const getFitnessChat = async (req, res) => {
  const userId = req.user.userId;
  const fitnessChat = await extractChat(userId, "fitness");
  res.status(200).json(fitnessChat);
};

const extractChat = async (userId, type) => {
  let chat = await Chat.findOne({ userId, chatType: type });
  let data = extractData(chat) || [];
  if (data.length > 0) data.shift();
  return data;
};

const extractData = (chat) => {
  const data = chat?.history?.map((obj) => {
    return {
      role: obj.role,
      msg: obj.parts[0].text,
    };
  });

  return data;
};

module.exports = { getAllChats, getDiagnosisChat, getDietChat, getFitnessChat };
