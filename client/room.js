import { io } from "socket.io-client"

const production = process.env.NODE_ENV === "production"
const serverUrl = production ? "realsite.com" : "http://localhost:3000"

const socket = io(serverUrl)
console.log(socket)
