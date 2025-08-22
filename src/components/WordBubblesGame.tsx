import React, { useState, useEffect, useCallback } from 'react'
import './WordBubblesGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface Bubble {
  id: number
  letter: string
  x: number
  y: number
  isTarget: boolean
  popped: boolean
  speed: number
}

interface GameLevel {
  id: number
  targetLetter: string
  word?: string
  bubbleCount: number
  timeLimit: number
}

const gameLevels: GameLevel[] = [
  { id: 1, targetLetter: 'A', bubbleCount: 5, timeLimit: 10 },
  { id: 2, targetLetter: 'B', bubbleCount: 6, timeLimit: 10 },
  { id: 3, targetLetter: 'C', bubbleCount: 7, timeLimit: 12 },
  { id: 4, targetLetter: 'D', bubbleCount: 8, timeLimit: 12 },
  { id: 5, targetLetter: 'E', bubbleCount: 8, timeLimit: 15 },
  { id: 6, targetLetter: 'F', bubbleCount: 9, timeLimit: 15 },
  { id: 7, targetLetter: 'G', bubbleCount: 10, timeLimit: 18 },
  { id: 8, targetLetter: 'H', bubbleCount: 10, timeLimit: 18 },
  { id: 9, targetLetter: 'I', bubbleCount: 12, timeLimit: 20 },
  { id: 10, targetLetter: 'J', bubbleCount: 12, timeLimit: 20 }
]

const randomLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const WordBubblesGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [targetsPoppedThisLevel, setTargetsPoppedThisLevel] = useState(0)

  const currentGameLevel = gameLevels[currentLevel]

  const generateBubbles = useCallback(() => {
    if (!currentGameLevel) return []

    const newBubbles: Bubble[] = []
    const targetCount = Math.max(2, Math.floor(currentGameLevel.bubbleCount * 0.3))
    
    for (let i = 0; i < currentGameLevel.bubbleCount; i++) {
      const isTarget = i < targetCount
      newBubbles.push({
        id: i,
        letter: isTarget 
          ? currentGameLevel.targetLetter 
          : randomLetters[Math.floor(Math.random() * randomLetters.length)],
        x: Math.random() * 80 + 5, // 5% to 85% to keep bubbles in view
        y: Math.random() * 60 + 100, // Start below the view
        isTarget,
        popped: false,
        speed: Math.random() * 0.5 + 0.3 // Random speed between 0.3 and 0.8
      })
    }
    
    return newBubbles
  }, [currentGameLevel])

  const startLevel = () => {
    if (!currentGameLevel) return
    
    setBubbles(generateBubbles())
    setTimeLeft(currentGameLevel.timeLimit)
    setGameStarted(true)
    setLevelCompleted(false)
    setTargetsPoppedThisLevel(0)
  }

  const handleBubbleClick = (bubbleId: number) => {
    setBubbles(prev => prev.map(bubble => {
      if (bubble.id === bubbleId && !bubble.popped) {
        if (bubble.isTarget) {
          setScore(score => score + 10)
          setTargetsPoppedThisLevel(prev => prev + 1)
        } else {
          setScore(score => Math.max(0, score - 5))
        }
        return { ...bubble, popped: true }
      }
      return bubble
    }))
  }

  const nextLevel = () => {
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setGameStarted(false)
      setLevelCompleted(false)
    } else {
      setGameFinished(true)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setBubbles([])
    setTimeLeft(0)
    setGameStarted(false)
    setGameFinished(false)
    setLevelCompleted(false)
    setTargetsPoppedThisLevel(0)
  }

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !levelCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false)
      if (targetsPoppedThisLevel >= 2) {
        setLevelCompleted(true)
        setTimeout(nextLevel, 2000)
      } else {
        // Failed level, restart
        setTimeout(startLevel, 2000)
      }
    }
  }, [timeLeft, gameStarted, levelCompleted, targetsPoppedThisLevel])

  // Check level completion
  useEffect(() => {
    if (gameStarted && !levelCompleted) {
      const targetBubbles = bubbles.filter(b => b.isTarget && !b.popped)
      if (targetBubbles.length === 0 && targetsPoppedThisLevel >= 2) {
        setLevelCompleted(true)
        setGameStarted(false)
        setTimeout(nextLevel, 2000)
      }
    }
  }, [bubbles, gameStarted, levelCompleted, targetsPoppedThisLevel])

  // Animate bubbles
  useEffect(() => {
    if (!gameStarted) return

    const animationFrame = setInterval(() => {
      setBubbles(prev => prev.map(bubble => {
        if (bubble.popped) return bubble
        
        const newY = bubble.y - bubble.speed
        
        // Remove bubbles that go off screen
        if (newY < -10) {
          return { ...bubble, y: Math.random() * 20 + 100, x: Math.random() * 80 + 5 }
        }
        
        return { ...bubble, y: newY }
      }))
    }, 50)

    return () => clearInterval(animationFrame)
  }, [gameStarted])

  if (gameFinished) {
    const getFeedback = () => {
      const percentage = (currentLevel / gameLevels.length) * 100
      if (percentage === 100) return t('score.perfect')
      if (percentage >= 70) return t('score.good')
      return t('score.practice')
    }

    return (
      <div className="bubbles-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.bubbles.title')}</h2>
          </div>

          <div className="final-score">
            <h3>{t('result.congratulations')}</h3>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <p>{t('score.final.bubbles', { score: currentLevel + 1, total: gameLevels.length })}</p>
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
      <div className="bubbles-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.bubbles.title')}</h2>
            <div className="game-info">
              <span>{t('level.current', { current: currentLevel + 1, total: gameLevels.length })}</span>
              <span>{t('game.score', { score })}</span>
            </div>
          </div>

          <div className="level-intro">
            {levelCompleted ? (
              <div className="level-complete">
                <h3>{t('level.complete')}</h3>
                <p>{t('level.excellent')}</p>
              </div>
            ) : (
              <div className="level-preview">
                <h3>{t('question.bubbles.pop', { letter: currentGameLevel.targetLetter })}</h3>
                <div className="target-letter-display">
                  <div className="big-letter">{currentGameLevel.targetLetter}</div>
                </div>
                <p>Tempo: {currentGameLevel.timeLimit} segundos</p>
                <p>Rebenta pelo menos 2 bolhas com a letra {currentGameLevel.targetLetter}!</p>
                <button className="start-level-btn" onClick={startLevel}>
                  ▶️ Começar Nível
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bubbles-game">
      <div className="game-container">
        <div className="game-header">
          <h2>{t('game.bubbles.title')}</h2>
          <div className="game-info">
            <span>{t('level.current', { current: currentLevel + 1, total: gameLevels.length })}</span>
            <span>⏰ {timeLeft}s</span>
            <span>{t('game.score', { score })}</span>
          </div>
        </div>

        <div className="game-area">
          <div className="target-display">
            <span>Alvo: <strong>{currentGameLevel.targetLetter}</strong></span>
            <span>Rebentadas: {targetsPoppedThisLevel}</span>
          </div>

          <div className="bubbles-container">
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className={`bubble ${bubble.isTarget ? 'target-bubble' : 'normal-bubble'} ${
                  bubble.popped ? 'popped' : ''
                }`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  display: bubble.popped ? 'none' : 'flex'
                }}
                onClick={() => handleBubbleClick(bubble.id)}
              >
                {bubble.letter}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordBubblesGame