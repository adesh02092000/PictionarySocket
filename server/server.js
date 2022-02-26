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
      }
    })

    socket.on("disconnect", () => {
      room.users = room.users.filter(u => u !== user)
    })
  })
})

io.listen(3000)

function getRandomEntry(array) {
  array[Math.floor(Math.random() * array.length)]
}
