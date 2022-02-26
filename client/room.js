import { io } from "socket.io-client"
import DrawableCanvas from "./DrawableCanvas"

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
const drawableCanvas = new DrawableCanvas(canvas, socket)
const guessTemplate = document.querySelector("[data-guess-template]")

socket.emit("joined-room", {
  name: name,
  roomId: roomId,
})
socket.on("start-drawing", startRoundDrawing)
socket.on("start-guessing", startRoundGuessing)
socket.on("guess", displayGuess)

readyButton.addEventListener("click", () => {
  hide(readyButton)
  socket.emit("ready") // socket contains the user info so, no need to send that
})

guessForm.addEventListener("submit", e => {
  e.preventDefault()
  if (guessInput.value === "") return

  socket.emit("make-guess", { guess: guessInput.value })
  displayGuess(name, guessInput.value)
  guessInput.value = ""
})

window.addEventListener("resize", resizeCanvas)

function displayGuess(guesserName, guess) {
  const guessElement = guessTemplate.content.cloneNode(true)
  const nameElement = guessElement.querySelector("[data-name]")
  const messageElement = guessElement.querySelector("[data-text]")
  nameElement.innerText = guesserName
  messageElement.innerText = guess
  messagesElement.append(guessElement)
}

function startRoundDrawing(word) {
  drawableCanvas.canDraw = true
  wordElement.innerText = word
}

function startRoundGuessing() {
  show(guessForm)
}

function resizeCanvas() {
  canvas.width = null
  canvas.height = null
  const clientDimensions = canvas.getBoundingClientRect()
  canvas.width = clientDimensions.width
  canvas.height = clientDimensions.height
}

resetRound()
resizeCanvas()

function resetRound() {
  drawableCanvas.canDraw = false
  hide(guessForm)
}

function hide(element) {
  element.classList.add("hide")
}

function show(element) {
  element.classList.remove("hide")
}
