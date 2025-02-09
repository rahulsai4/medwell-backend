const axios = require("axios");
const Chat = require('../models/Chat')
const User = require('../models/User')

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: 
    `
            You are an expert fitness coach specializing in designing personalized exercise routines and wellness strategies.
        Based on the following user inputs, provide a tailored fitness plan and general wellness advice:
        
        if the user has provided somethings completely irrelevent information just ignore it and point the user to provide relevant info only and make sure the reply is small
        ### Response Guidelines:
        - Workout Plan: Design a weekly workout plan with specific exercises (e.g., cardio, strength training, flexibility).
        - Warm-Up/Cool-Down: Include warm-up and cool-down routines.
        - Intensity Adjustment: Adjust intensity based on user metrics and fitness goals.
        - Recovery Tips: Offer advice for recovery, hydration, and injury prevention.
    `
});

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
    const chat = model.startChat({
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