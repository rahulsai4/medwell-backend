require('dotenv').config();
require('express-async-errors');
// express

const express = require('express');
const app = express();
app.use(express.json())
const cors = require('cors');
app.use(cors());

app.get("/", (req, res) => res.send("test"));

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddleware = require('./middleware/auth');



// routers
const authRouter = require('./routes/auth');
const chatRouter = require("./routes/chat");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chat", authMiddleware, chatRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();