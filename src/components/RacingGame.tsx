import React, { useState, useEffect, useCallback } from 'react'
import './RacingGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface RaceLevel {
  id: number
  letters: string[]
  timeLimit: number
  targetSpeed: number
}

const raceLevels: RaceLevel[] = [
  { id: 1, letters: ['A', 'B', 'C'], timeLimit: 15, targetSpeed: 20 },
  { id: 2, letters: ['D', 'E', 'F'], timeLimit: 15, targetSpeed: 25 },
  { id: 3, letters: ['G', 'H', 'I'], timeLimit: 18, targetSpeed: 30 },
  { id: 4, letters: ['J', 'K', 'L'], timeLimit: 18, targetSpeed: 35 },
  { id: 5, letters: ['M', 'N', 'O'], timeLimit: 20, targetSpeed: 40 },
  { id: 6, letters: ['P', 'Q', 'R'], timeLimit: 20, targetSpeed: 45 },
  { id: 7, letters: ['S', 'T', 'U'], timeLimit: 22, targetSpeed: 50 },
  { id: 8, letters: ['V', 'W', 'X'], timeLimit: 22, targetSpeed: 55 },
  { id: 9, letters: ['Y', 'Z', 'A'], timeLimit: 25, targetSpeed: 60 },
  { id: 10, letters: ['A', 'B', 'C', 'D', 'E'], timeLimit: 30, targetSpeed: 65 }
]

const RacingGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [playerCarPosition, setPlayerCarPosition] = useState(0)
  const [computerCarPosition, setComputerCarPosition] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [raceFinished, setRaceFinished] = useState(false)
  const [raceWon, setRaceWon] = useState(false)
  const [score, setScore] = useState(0)
  const [inputValue, setInputValue] = useState('')

  const currentRaceLevel = raceLevels[currentLevel]
  const currentLetter = currentRaceLevel?.letters[currentLetterIndex]

  const startRace = useCallback(() => {
    if (!currentRaceLevel) return
    
    setTimeLeft(currentRaceLevel.timeLimit)
    setGameStarted(true)
    setRaceFinished(false)
    setRaceWon(false)
    setPlayerCarPosition(0)
    setComputerCarPosition(0)
    setCurrentLetterIndex(0)
    setInputValue('')
  }, [currentRaceLevel])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameStarted || raceFinished) return
    
    const pressedKey = event.key.toLowerCase()
    const targetKey = currentLetter?.toLowerCase()
    
    if (pressedKey === targetKey) {
      // Correct letter typed
      const nextLetterIndex = currentLetterIndex + 1
      
      // Check if this was the last letter
      if (nextLetterIndex >= currentRaceLevel.letters.length) {
        // Race completed successfully
        setPlayerCarPosition(100)
        setRaceFinished(true)
        setRaceWon(true)
        setScore(prev => prev + 100)
      } else {
        // Move to next letter
        setCurrentLetterIndex(nextLetterIndex)
        setPlayerCarPosition(prev => prev + (100 / currentRaceLevel.letters.length))
      }
      
      setScore(prev => prev + 10)
    }
  }, [gameStarted, raceFinished, currentLetter, currentRaceLevel, currentLetterIndex])

  const nextRace = useCallback(() => {
    if (currentLevel < raceLevels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setGameStarted(false)
      setRaceFinished(false)
      setRaceWon(false)
      setCurrentLetterIndex(0)
      setPlayerCarPosition(0)
      setComputerCarPosition(0)
    } else {
      setGameFinished(true)
    }
  }, [currentLevel])

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setPlayerCarPosition(0)
    setComputerCarPosition(0)
    setCurrentLetterIndex(0)
    setTimeLeft(0)
    setGameStarted(false)
    setGameFinished(false)
    setRaceFinished(false)
    setRaceWon(false)
    setInputValue('')
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        setInputValue(event.key.toUpperCase())
        handleKeyPress(event)
        setTimeout(() => setInputValue(''), 500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !raceFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted && !raceFinished) {
      setRaceFinished(true)
      setRaceWon(false)
    }
  }, [timeLeft, gameStarted, raceFinished])

  // Computer car movement
  useEffect(() => {
    if (!gameStarted || raceFinished) return

    const computerSpeed = currentRaceLevel.targetSpeed / 10 // Speed per second
    const interval = setInterval(() => {
      setComputerCarPosition(prev => {
        const newPosition = prev + computerSpeed
        if (newPosition >= 100) {
          setRaceFinished(true)
          setRaceWon(false)
          return 100
        }
        return newPosition
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, raceFinished, currentRaceLevel])

  // Check race completion
  useEffect(() => {
    if (raceFinished && gameStarted) {
      setGameStarted(false)
      setTimeout(() => {
        if (raceWon) {
          nextRace()
        } else {
          startRace() // Restart the race
        }
      }, 3000)
    }
  }, [raceFinished, raceWon, gameStarted, nextRace, startRace])

  if (gameFinished) {
    const getFeedback = () => {
      const percentage = (currentLevel / raceLevels.length) * 100
      if (percentage === 100) return t('score.perfect')
      if (percentage >= 70) return t('score.good')
      return t('score.practice')
    }

    return (
      <div className="racing-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.racing.title')}</h2>
          </div>

          <div className="final-score">
            <h3>{t('result.congratulations')}</h3>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <p>{t('score.final.racing', { score: currentLevel + 1, total: raceLevels.length })}</p>
            </div>
            <p className="feedback">{getFeedback()}</p>
            <button className="new-game-btn" onClick={resetGame}>
              {t('button.new.game')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="racing-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.racing.title')}</h2>
            <div className="game-info">
              <span>Corrida {currentLevel + 1} de {raceLevels.length}</span>
              <span>{t('game.score', { score })}</span>
            </div>
          </div>

          <div className="race-intro">
            {raceFinished ? (
              <div className="race-result">
                {raceWon ? (
                  <div className="race-won">
                    <h3>🏆 Ganhaste a Corrida! 🏆</h3>
                    <p>Excelente velocidade!</p>
                  </div>
                ) : (
                  <div className="race-lost">
                    <h3>😅 O computador ganhou!</h3>
                    <p>Tenta escrever mais rápido!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="race-preview">
                <h3>Prepara-te para a corrida!</h3>
                <div className="letters-display">
                  <p>Escreve estas letras o mais rápido possível:</p>
                  <div className="letters-list">
                    {currentRaceLevel.letters.map((letter, index) => (
                      <span key={index} className="preview-letter">
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
                <p>Tempo: {currentRaceLevel.timeLimit} segundos</p>
                <button className="start-race-btn" onClick={startRace}>
                  🏁 Começar Corrida
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="racing-game">
      <div className="game-container">
        <div className="game-header">
          <h2>{t('game.racing.title')}</h2>
          <div className="game-info">
            <span>Corrida {currentLevel + 1}</span>
            <span>⏰ {timeLeft}s</span>
            <span>{t('game.score', { score })}</span>
          </div>
        </div>

        <div className="race-track">
          <div className="track-header">
            <div className="current-letter-display">
              <span>Escreve: <strong>{currentLetter}</strong></span>
              <span>Progresso: {currentLetterIndex}/{currentRaceLevel.letters.length}</span>
            </div>
          </div>

          <div className="race-area">
            <div className="finish-line">🏁</div>
            
            <div className="car-lane player-lane">
              <div 
                className="car player-car"
                style={{ left: `${playerCarPosition}%` }}
              >
                🏎️
              </div>
              <div className="lane-label">Tu</div>
            </div>

            <div className="car-lane computer-lane">
              <div 
                className="car computer-car"
                style={{ left: `${computerCarPosition}%` }}
              >
                🚗
              </div>
              <div className="lane-label">Computador</div>
            </div>
          </div>

          <div className="input-display">
            <div className="typing-indicator">
              {inputValue && (
                <div className="typed-letter">
                  {inputValue}
                </div>
              )}
            </div>
            <div className="instructions">
              <p>🎯 {t('question.racing.type', { letter: currentLetter })}</p>
            </div>
          </div>
        </div>

        {raceFinished && (
          <div className={`race-result-overlay ${raceWon ? 'won' : 'lost'}`}>
            <div className="result-message">
              {raceWon ? (
                <div>
                  <h3>🏆 Ganhaste! 🏆</h3>
                  <p>Velocidade incrível!</p>
                </div>
              ) : (
                <div>
                  <h3>😅 Perdeste!</h3>
                  <p>Tenta de novo!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RacingGame