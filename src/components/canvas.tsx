import { useState, useEffect } from 'react'
import { SHAPES } from '../utils/consts'

const BLOCK_SIZE = 20
const BOARD_WIDTH = 16
const BOARD_HEIGHT = 18

console.log('root')

const board: number[][] = []
const randomColum = Math.floor(Math.random() * BOARD_WIDTH)

const piece = {
  position: {
    y: 0,
    x: randomColum,
  },
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

console.log(piece)

for (let y=0; y<BOARD_HEIGHT; y++) {
  const row = []

  for (let x=0; x<BOARD_WIDTH; x++) {
    row.push(0)
  }

  board.push(row)
}

// piece.shape.forEach((row, y) => {
//   row.forEach((value, x) => {
//     if (value === 2) {
//       if (y == 0 && x == 0) piece.position.x = randomColum-row.length+x
//       board[y].splice(randomColum-row.length+x, 1, value)
//     }
//   })
// })
// board[2].splice(1, 1, 2)
// board[2].splice(2, 2, ...[1, 1])
// board[3].splice(2, 2, ...[1, 1])

function draw (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  // console.log(piece.position)
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'orange'
        context.fillRect(x, y, 1, 1)
      }

      if (value === 2) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 2) {
        if (y == 0 && x == 0) piece.position.x = randomColum-row.length+x
        x = randomColum+x > BOARD_WIDTH-1 ? randomColum + x - piece.shape[0].length : randomColum+x
        piece.position.x = x
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })
}

function movePice(x: number, y: number) {
  const newX = x < 0 ? piece.position.x - x : piece.position.x + piece.shape[0].length + x
  const newY = y < 0 ? piece.position.y - y : piece.position.y + piece.shape.length + y
  
  if (newX >= 0 && newX <= BOARD_WIDTH) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 2) {
          if (y == 0 && x == 0) piece.position.x = newX-row.length+x
          board[y].splice(newX-row.length+x, 1, value)
        }
      })
    })
  }
}

export default function Canvas () {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // console.log(canvas)
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      canvas.width = BOARD_WIDTH * BLOCK_SIZE
      canvas.height = BOARD_HEIGHT * BLOCK_SIZE
    
      context.scale(BLOCK_SIZE, BLOCK_SIZE)
      
      const update = () => {
        draw(canvas, context)
        // window.requestAnimationFrame(update)
      }

      const handleKeyUp = ({ key }: KeyboardEvent) => {
        console.log(key)

        if (['s', 'ArrowDown'].some(s=> s == key)) {
          piece.position.y++
          console.log(piece.position)
        }
        
        if (['d', 'ArrowRight'].some(s=> s == key)) {
          piece.position.x++
        }
        
        if (['a', 'ArrowLeft'].some(s=> s == key)) {
          piece.position.x--
        }
      }
    
      update()
      document.addEventListener('keyup', handleKeyUp)
      
      // let time = 0

      const interval = setInterval(() => {
        update()

        // time++
        // if (time === 10) {
        //   piece.position.y++
        //   time=0
        // }
      }, 100)
  
      return () => {
        clearInterval(interval)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [canvas])


  return (
    <canvas ref={setCanvas}></canvas>
  )
}