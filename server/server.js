const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: "http://localhost:1234",
  },
})
io.on("connection", socket => {
  console.log("Connected Successfully")
})

io.listen(3000)
