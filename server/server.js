const production = process.env.NODE_ENV === "production"
const clientUrl = production ? "realsite.com" : "http://localhost:1234"

const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: clientUrl,
  },
})
io.on("connection", socket => {
  socket.on("joined-room", data => {
    console.log(data)
  })
})

io.listen(3000)
