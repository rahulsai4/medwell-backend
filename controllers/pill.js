const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const pillIdentifier = async (req, res) => {
    const uploadResult = await fileManager.uploadFile(
      `${mediaPath}/jetpack.jpg`,
      {
        mimeType: "image/jpeg",
        displayName: "pill image",
      },
    );
    // View the response.
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );
    
    const result = await model.generateContent([
      "Tell me about this image which contains a pill image tell me everthing i need to know about that image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    res.status(200).json({info : result.response.text()});
}