const production = process.env.NODE_ENV === "production"
const clientUrl = production ? "realsite.com" : "http://localhost:1234"

const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: clientUrl,
  },
})

const rooms = {}
const WORDS = ["Dog", "Man", "Bike", "Women"]

io.on("connection", socket => {
  socket.on("joined-room", data => {
    const user = { id: socket.id, name: data.name, socket: socket }

    let room = rooms[data.roomId]
    if (room == null) {
      room = { users: [], id: data.roomId }
      rooms[data.roomId] = room
    }

    room.users.push(user)
    socket.join(room.id)

    socket.on("ready", () => {
      user.ready = true
      if (room.users.every(u => u.ready)) {
        room.word = getRandomEntry(WORDS)
        room.drawer = getRandomEntry(room.users)
        io.to(room.drawer.id).emit("start-drawing", room.word)
        room.drawer.socket.to(room.id).emit("start-guessing")
      }
    })

    socket.on("draw", data => {
      socket.to(room.id).emit("draw-line", data.start, data.end)
    })

    socket.on("make-guess", data => {
      socket.to(room.id).emit("guess", user.name, data.guess)
    })

    socket.on("disconnect", () => {
      room.users = room.users.filter(u => u !== user)
    })
  })
})

io.listen(3000)

function getRandomEntry(array) {
  return array[Math.floor(Math.random() * array.length)]
}
