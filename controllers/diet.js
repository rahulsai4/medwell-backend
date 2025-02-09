const axios = require("axios");
const Chat = require('../models/Chat')
const User = require('../models/User')

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: 
    `You are an expert nutritionist specializing in creating personalized diet plans.
    Based on the following user inputs, provide a well-balanced, customized meal plan and dietary advice:


    ### Response Guidelines:
    - Meal Plan: Provide a 7-day meal plan with breakfast, lunch, dinner, and snacks.
    - Portion Sizes: Include portion sizes and macronutrient breakdowns (e.g., protein, carbs, fats).
    - Substitutions: Suggest alternatives for restricted foods.
    - Meal Prep Tips: Offer practical advice for meal preparation and grocery shopping.
    if the user has provided somethings completely irrelevent information just ignore it and point the user to provide relevant info only and make sure the reply is small
    `
    
    
});

const dietChat = async (req, res) => {
    
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const userData = "patient data " + JSON.stringify({height: user.height, weight: user.weight, age: user.age, gender: user.gender, diseases: user.diseases});


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
    const chat = model.startChat({
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