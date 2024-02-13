import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, SHAPES } from '../utils/consts'
import type { GameStatus } from '../types'

const fps = 50

const borderColor = '#9ca3af'
const backgroundColor = '#030712'
const pieceColor = '#737373'
const solidPieceColor = '#525252'

const board: number[][] = []
let boardStatus: 'empty' | 'content' = 'empty'

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

for (let y=0; y<BOARD_HEIGHT; y++) {
  const row = []

  for (let x=0; x<BOARD_WIDTH; x++) {
    row.push(0)
  }

  board.push(row)
}

export default function Canvas ({ setScore, gameStatus, setGameStatus }: {
  setScore: Dispatch<SetStateAction<number>>
  gameStatus: GameStatus
  setGameStatus: Dispatch<SetStateAction<GameStatus>>
}) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (gameStatus === 'started' && boardStatus === 'content') {
      board.forEach(row => row.fill(0))
    }
    // console.log(canvas)
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      canvas.width = BOARD_WIDTH * BLOCK_SIZE
      canvas.height = BOARD_HEIGHT * BLOCK_SIZE
    
      const draw = () => {      
        board.forEach((row, y) => {
          row.forEach((value, x) => {
            context.fillStyle = backgroundColor
            context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
            context.strokeStyle = borderColor
            context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)

            if (value) {
              context.fillStyle = solidPieceColor
              context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
              context.strokeStyle = backgroundColor
              context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
            }
          })
        })
      
        if (gameStatus === 'started') {
          piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
              const finalY = piece.position.y + y
              if (value) {
                x = piece.position.x + x
  
                context.fillStyle = pieceColor
                context.fillRect(x * BLOCK_SIZE, finalY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
                context.strokeStyle = backgroundColor
                context.strokeRect(x * BLOCK_SIZE, finalY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
              }
            })
          })

          boardStatus = 'content'
        }
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
          board.splice(board.findIndex(r => r.every(c => c)), 1)
          board.unshift(board[0])
          setScore(s => s + BOARD_WIDTH)
        }
      }

      const handleEndGame = () => {
        if (board[0].some(s => s !== 0)) {
          setGameStatus('finished')
          return true
        }

        return false
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
        if (handleEndGame()) return
        generateRandomPiece()
      }

      const update = () => {
        draw()
        // window.requestAnimationFrame(update)
      }

      const cooldowns = {
        down: 0,
        right: 0,
        left: 0
      }

      const isCooldown = (key: keyof typeof cooldowns) => {
        const time = Date.now() 
        const res = time - cooldowns[key] < fps
        
        if (!res) cooldowns[key] = time
        
        return res
      }

      const handleKeydown = ({ key }: KeyboardEvent) => {
        const { y, x } = piece.position

        if (['w', 'ArrowUp'].some(s=> s == key)) {
          rotatePiece()
        }
        
        if (['s', 'ArrowDown'].some(s=> s == key)) {
          if (isCooldown('down')) return

          if (checkCollision(y+1, x)) {
            solidifyPiece()
          } else {
            piece.position.y++
          }
        }
        
        if (['d', 'ArrowRight'].some(s=> s == key)) {
          if (isCooldown('right')) return

          if (!checkCollision(y, x+1)) {
            piece.position.x++
          }
        }
        
        if (['a', 'ArrowLeft'].some(s=> s == key)) {
          if (isCooldown('left')) return

          if (!checkCollision(y, x-1)) {
            piece.position.x--
          }
        }
      }
    
      update()
      
      if (gameStatus === 'started') {
        document.addEventListener('keydown', handleKeydown)
        
        let time = 0

        const interval = setInterval(() => {
          const { y, x } = piece.position
  
          time++
          if (time === 1000 / fps) {          
            if (checkCollision(y+1, x)) {
              solidifyPiece()
            } else {
              piece.position.y++
            }
            time=0
          }
          
          update()
          
        }, fps)
    
        return () => {
          clearInterval(interval)
          document.removeEventListener('keyup', handleKeydown)
        }
      }
    }
  }, [canvas, setScore, gameStatus, setGameStatus])


  return (
    <canvas ref={setCanvas}></canvas>
  )
}