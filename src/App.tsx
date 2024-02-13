import Canvas from './components/canvas'
import { useState, useEffect } from 'react'
import type { GameStatus } from './types'
import packageData from '../package.json'

function App () {
  const [gameStatus, setGameStatus] = useState<GameStatus>('before')
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (gameStatus === 'started') {
      const intervalTimer = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)

      return () => {
        clearInterval(intervalTimer)
      }
    }
  }, [gameStatus])

  const handleClick = () => {
    setGameStatus('started')
    setScore(0)
    setTimer(0)
  }

  return (
    <>
      <section className='tetris'>
        <header>
          <strong>Score: <span>{score}</span></strong>
          {gameStatus === 'finished'
            ? <em>End of the game</em>
            : gameStatus === 'started' && <em>Game in progress</em>
          }
          {gameStatus === 'started' && <span>
            {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60 + '').padStart(2, '0')}
          </span>}
          {gameStatus === 'before'
            ? <button onClick={handleClick}>Play game</button>
            : gameStatus === 'finished' && <button onClick={handleClick}>Play again</button>
          }
        </header>
        <Canvas {...{setScore, gameStatus, setGameStatus}} />
      </section>
      <span className='version'>v{packageData.version}</span>
    </>
  )
}

export default App
