const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatType: {
        type: String,
        enum: ["diagnosis", "diet", "fitness"],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    history: [
        new mongoose.Schema(
            {
                role: {
                    type: String, 
                    enum: ["user", "model"],
                    required: true
                },
                parts: [
                    {
                        text: {
                            type: String,
                            required: true
                        }
                    }
                ]
            },
            { _id: false } 
        )
    ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
