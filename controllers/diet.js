const axios = require("axios");
const Chat = require('../models/Chat')
const User = require('../models/User')

const {dietModel} = require("../gemini-models/models");

const dietChat = async (req, res) => {
    
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const userData = "patient data " + JSON.stringify(user);


    // get all diagnose chats of user
    let prevChat = await Chat.findOne({ userId, chatType: 'diet' });

    if(!prevChat){
        const his = {
            role: "user",
            parts: [{ text: userData}],
        }

        prevChat = await Chat.create({userId, chatType: "diet", history:[his]});
    } 

    // use the history of the diagnose chat
    const chat = dietModel.startChat({
        history: prevChat.history || []
    });

    
    const { message } = req.body;
    const result = await chat.sendMessage(message);    
    const reply = result.response.text();
    
    // set chats of user to current chat._history
    let updatedChat = await Chat.findOneAndUpdate(
        { userId, chatType: 'diet' }, 
        { $set: { history :  chat._history} },
        {new : true}
    );

    
    res.status(200).json({reply})
}

module.exports = dietChat;