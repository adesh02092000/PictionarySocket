import { io } from "socket.io-client"

const production = process.env.NODE_ENV === "production"
const serverUrl = production ? "realsite.com" : "http://localhost:3000"

const urlParams = new URLSearchParams(window.location.search)
const name = urlParams.get("name")
const roomId = urlParams.get("room-id")

if (!name || !roomId) window.location = "/index.html"

const socket = io(serverUrl)
console.log(socket)

const guessForm = document.querySelector("[data-guess-form]")
const guessInput = document.querySelector("[data-guess-input]")
const wordElement = document.querySelector("[data-word]")
const messagesElement = document.querySelector("[data-messages]")
const readyButton = document.querySelector("[data-ready-btn]")
const canvas = document.querySelector("[data-canvas]")

socket.emit("joined-room", {
  name: name,
  roomId: roomId,
})

resetRound()

function resetRound() {
  hide(guessForm)
}

function hide(element) {
  element.classList.add("hide")
}
