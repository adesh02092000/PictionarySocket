export default function DrawableCanvas(canvas, socket) {
  let prevPosition = null

  canvas.addEventListener("mousemove", e => {
    if (e.buttons !== 1) {
      prevPosition = null
      return
    }

    const newPosition = { x: e.layerX, y: e.layerY }
    if (prevPosition != null) {
      drawLine(prevPosition, newPosition)
      socket.emit("draw", {
        start: prevPosition,
        end: newPosition,
      })
    }

    prevPosition = newPosition
  })
  // Don't continue the stroke once the mouse goes out of bounds
  canvas.addEventListener("mouseleave", () => (prevPosition = null))
  socket.on("draw-line", drawLine)

  function drawLine(start, end) {
    const context = canvas.getContext("2d")
    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
  }
}
