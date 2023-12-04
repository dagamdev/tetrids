
const canvas = document.querySelector('canvas')
const context = canvas?.getContext('2d') 

const BLOCK_SIZE = 20
const BOARD_WIDTH = 12
const BOARD_HEIGHT = 18

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
]

if (canvas && context) {
  canvas.width = BOARD_WIDTH * BLOCK_SIZE
  canvas.height = BOARD_HEIGHT * BLOCK_SIZE

  context.scale(BLOCK_SIZE, BLOCK_SIZE)

}

function update () {
  draw()
}

function draw () {
  if (context && canvas) {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          context.fillStyle = 'blue'
          context.fillRect(x, y, 1, 1)
        }
      })
    })
  }
}

update()


export default function Canvas () {
  return (
    <canvas></canvas>
  )
}