import { useState } from 'react'
import Home from './components/Home'
import Game from './components/Game'
import Result from './components/Result'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'game', 'result'
  const [userId, setUserId] = useState('')
  const [gameResult, setGameResult] = useState(null)

  const startGame = (id) => {
    setUserId(id)
    setScreen('game')
  }

  const finishGame = (result) => {
    setGameResult(result)
    setScreen('result')
  }

  const resetGame = () => {
    setScreen('home')
  }

  return (
    <div className="app-container">
      {screen === 'home' && <Home onStart={startGame} />}
      {screen === 'game' && <Game userId={userId} onFinish={finishGame} />}
      {screen === 'result' && <Result userId={userId} result={gameResult} onReset={resetGame} />}
    </div>
  )
}

export default App
