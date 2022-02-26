const { Server } = require("socket.io")

const io = new Server({})
io.on("connection", socket => {
  console.log("Connected Successfully")
})

io.listen(3000)
