import Canvas from './components/canvas'
import { useState } from 'react'
import type { GameStatus } from './types'
import packageData from '../package.json'

function App () {
  const [gameStatus, setGameStatus] = useState<GameStatus>('before')
  const [score, setScore] = useState(0)

  const handleClick = () => {
    setGameStatus('started')
    setScore(0)
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
