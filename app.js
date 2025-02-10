require("dotenv").config();
require("express-async-errors");
const http = require("http");
// express

const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const { Server } = require("socket.io");

const morgan = require("morgan");
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("test"));

const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/auth");

// routers
const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");

app.use("/auth", authRouter);
app.use("/chat", authMiddleware, chatRouter);
app.use("/user", authMiddleware, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // Allow frontend access
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle joining room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // Handle signaling messages
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.emit("user-left", socket.id);
  });
});

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
