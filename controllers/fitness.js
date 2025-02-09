const axios = require("axios");
const Chat = require('../models/Chat')
const User = require('../models/User')

const {fitnessModel} = require("../gemini-models/models");


const fitnessChat = async (req, res) => {
    
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const userData = "patient data " + JSON.stringify(user);


    // get all diagnose chats of user
    let prevChat = await Chat.findOne({ userId, chatType: 'fitness' });

    if(!prevChat){
        const his = {
            role: "user",
            parts: [{ text: userData}],
        }

        prevChat = await Chat.create({userId, chatType: "fitness", history:[his]});
    } 

    // use the history of the diagnose chat
    const chat = fitnessModel.startChat({
        history: prevChat.history || []
    });

    
    const { message } = req.body;
    const result = await chat.sendMessage(message);    
    const reply = result.response.text();
    
    // set chats of user to current chat._history
    let updatedChat = await Chat.findOneAndUpdate(
        { userId, chatType: 'fitness' }, 
        { $set: { history :  chat._history} },
        {new : true}
    );

    
    res.status(200).json({reply})
}

module.exports = fitnessChat;