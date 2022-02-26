function DrawableCanvas(canvas, socket) {
  let prevPosition = null

  canvas.addEventListener("mousemove", e => {
    if (e.buttons !== 1) {
      prevPosition = null
      return
    }

    const newPosition = { x: e.layerX, y: e.layerY }
    if (prevPosition != null) {
      drawLine(prevPosition, newPosition)
    }

    prevPosition = newPosition
  })
}
