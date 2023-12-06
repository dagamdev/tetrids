import { useState, useEffect } from 'react'
import { PIECES } from '../utils/config'

const BLOCK_SIZE = 20
const BOARD_WIDTH = 16
const BOARD_HEIGHT = 18

console.log('root')

const board: number[][] = []
for (let y=0; y<BOARD_HEIGHT; y++) {
  const row = []

  for (let x=0; x<BOARD_WIDTH; x++) {
    row.push(0)
  }

  board.push(row)
}

const randomX = Math.floor(Math.random() * BOARD_WIDTH)
const randomPiece = {
  y: 0,
  x: randomX,
  body: PIECES[Math.floor(Math.random() * PIECES.length)]
}

randomPiece.body.forEach((row, y) => {
  row.forEach((value, x) => {
    if (value === 2) {
      if (y == 0 && x == 0) randomPiece.x = randomX-row.length+x
      board[y].splice(randomX-row.length+x, 1, value)
    }
  })
})
// board[2].splice(1, 1, 2)
// board[2].splice(2, 2, ...[1, 1])
// board[3].splice(2, 2, ...[1, 1])

function draw (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
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
}

function movePice(x: number, y: number) {
  const newX = x < 0 ? randomPiece.x - x : randomPiece.x + randomPiece.body[0].length + x
  const newY = y < 0 ? randomPiece.y - y : randomPiece.y + randomPiece.body.length + y
  
  if (newX >= 0 && newX <= BOARD_WIDTH) {
    randomPiece.body.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 2) {
          if (y == 0 && x == 0) randomPiece.x = newX-row.length+x
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
      }

      const handleKeyUp = ({ key }: KeyboardEvent) => {
        console.log(key)

        if (['s', 'ArrowDown'].some(s=> s == key)) {
        }
        
        if (['d', 'ArrowRight'].some(s=> s == key)) {
          movePice(1, 0)  
        }
        
        if (['a', 'ArrowLeft'].some(s=> s == key)) {
          movePice(-1, 0)  
        }
      }
    
      update()
      document.addEventListener('keyup', handleKeyUp)
      
      const interval = setInterval(() => {
        update()
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