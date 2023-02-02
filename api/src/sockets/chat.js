const { APP_URL } = require("../config.js");

const io = require("socket.io")(8090, {
  cors: {
    origin: APP_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join", (organisation) => {
    socket.join(organisation);
  });

  socket.on("messages", (message) => {
    io.to(message.message.organisation).emit("receive message", message);
  });
});
