import { useState, useEffect } from 'react'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, SHAPES } from '../utils/consts'

console.log('root')

const board: number[][] = []

const piece = {
  position: {
    y: 0,
    x: 0
  },
  shape: SHAPES[0]
}

const generateRandomPiece = () => {
  const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const randomColum = Math.floor(Math.random() * (BOARD_WIDTH - randomShape[0].length + 1))

  piece.position.y = 0
  piece.position.x = randomColum
  piece.shape = randomShape
}
generateRandomPiece()

console.log(piece)

for (let y=0; y<BOARD_HEIGHT; y++) {
  const row = []

  for (let x=0; x<BOARD_WIDTH; x++) {
    row.push(0)
  }

  board.push(row)
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

      const draw = () => {
        context.fillStyle = '#000'
        context.fillRect(0, 0, canvas.width, canvas.height)
      
        board.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              context.fillStyle = 'orange'
              context.fillRect(x, y, 1, 1)
            }
          })
        })
      
        piece.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            const finalY = piece.position.y + y
            if (value) {
              x = piece.position.x + x

              context.fillStyle = 'yellow'
              context.fillRect(x, finalY, 1, 1)
            }
          })
        })
      }

      const checkCollision = (y: number, x: number) => {
        return piece.shape.some((row, rowI) => {
          return row.some((value, columI) => {
            if (value) {
              const boardElement = board[rowI+y]?.[columI+x]
              return boardElement === undefined || boardElement === 1
            } else return false
          })
        })
      }

      const handleRemoveRow = () => {
        if (board.some(r => r.every(c => c))) {
          console.log('remove row')
          board.splice(board.findIndex(r => r.every(c => c)), 1)
          board.unshift(board[0])
        }
      }

      const rotatePiece = () => {
        const rotatedShape: number[][] = []
        const reversedShape = piece.shape.reverse()

        for (let y=0; y<piece.shape.length; y++) {
          const row = reversedShape[y]

          for (let x=0; x<row.length; x++) {
            const value = row[x]

            if (value) {
              const boardElement = board[piece.position.y+x]?.[piece.position.x+y]
              if (boardElement === undefined || boardElement === 1) {
                return
              }
            }
            
            if (!rotatedShape[x]) rotatedShape.push([value])
            else rotatedShape[x][y] = value
          }
        }

        piece.shape = rotatedShape
      }

      const solidifyPiece = () => {
        const { y, x } = piece.position
        piece.shape.forEach((row, rowI) => {
          row.forEach((value, columI) => {
            if (value) board[y+rowI][x+columI] = 1
          })
        })


        handleRemoveRow()
        generateRandomPiece()
      }

      const update = () => {
        draw()
        // window.requestAnimationFrame(update)
      }

      const handleKeydown = ({ key }: KeyboardEvent) => {
        const { y, x } = piece.position
        // console.log(key)

        if (['w', 'ArrowUp'].some(s=> s == key)) {
          rotatePiece()
        }

        if (['s', 'ArrowDown'].some(s=> s == key)) {
          if (checkCollision(y+1, x)) {
            solidifyPiece()
          } else {
            piece.position.y++
          }
        }
        
        if (['d', 'ArrowRight'].some(s=> s == key)) {
          if (!checkCollision(y, x+1)) {
            piece.position.x++
          }
        }
        
        if (['a', 'ArrowLeft'].some(s=> s == key)) {
          if (!checkCollision(y, x-1)) {
            piece.position.x--
          }
        }
      }
    
      update()
      document.addEventListener('keydown', handleKeydown)
      
      let time = 0

      const interval = setInterval(() => {
        const { y, x } = piece.position

        // time++
        if (time === 10) {          
          if (checkCollision(y+1, x)) {
            solidifyPiece()
          } else {
            piece.position.y++
          }
          time=0
        }
        
        update()
        
      }, 100)
  
      return () => {
        clearInterval(interval)
        document.removeEventListener('keyup', handleKeydown)
      }
    }
  }, [canvas])


  return (
    <canvas ref={setCanvas}></canvas>
  )
}