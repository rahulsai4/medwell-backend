const axios = require("axios");
const Chat = require('../models/Chat')
const User = require('../models/User')

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: `You are an expert doctor and nutritionist specializing in diagnosing symptoms, creating personalized diet plans, and providing health advice. 
    Your responses should be **concise, evidence-based, and practical**. 

    - **Diagnosing**: Provide possible causes based on symptoms, but do not make definitive medical diagnoses. Instead, suggest potential conditions and further evaluation steps.
    - **Diet Plans**: Offer well-balanced, customized meal plans considering nutritional value, food preferences, and medical conditions.
    - **Health Advice**: Recommend lifestyle changes, exercise routines, and general wellness strategies based on scientific research.

    ### **Response Guidelines:**
    - Keep responses **structured** (e.g., bullet points or step-by-step guidance).
    - **Do not** include disclaimers like "I'm not a doctor"—assume the role of an expert advisor.
    - If more information is needed, ask relevant follow-up questions.
    - Prioritize **scientific accuracy and practical recommendations** over general information.
    
    ### **Example Response Structure:**
    **User's Query:** "I feel tired all the time and have headaches."  
    **Response:**  
    - **Possible Causes:** (e.g., dehydration, anemia, poor sleep, stress)  
    - **Next Steps:** (e.g., check hydration, track sleep, possible lab tests)  
    - **Dietary Adjustments:** (e.g., increase iron-rich foods, hydration tips)  
    - **Lifestyle Tips:** (e.g., better sleep schedule, stress management)  
    
    also, please solve any questions that the user may ask
    Always tailor responses based on user-provided details for **precise and practical** advice.`
});

const diagnoseChat = async (req, res) => {
    
    const userId = req.user.userId;
    const user = await User.findById(userId);

    const userData = "patient data" + JSON.stringify({height: user.height, weight: user.weight, age: user.age, gender: user.gender, diseases: user.diseases});


    // get all diagnose chats of user
    let prevChat = await Chat.findOne({ userId, chatType: 'diagnosis' });

    if(!prevChat){
        const his = {
            role: "user",
            parts: [{ text: userData}],
        }

        prevChat = await Chat.create({userId, chatType: "diagnosis", history:[his]});
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
        { userId, chatType: 'diagnosis' }, 
        { $set: { history :  chat._history} },
        {new : true}
    );

    
    res.status(200).json({reply})
}

module.exports = diagnoseChat;