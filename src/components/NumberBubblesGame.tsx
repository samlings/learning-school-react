import React, { useState, useEffect, useCallback } from 'react'
import './NumberBubblesGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface Bubble {
  id: number
  number: number
  x: number
  y: number
  isTarget: boolean
  popped: boolean
  speed: number
}

interface GameLevel {
  id: number
  challengeType: 'odd' | 'even' | 'greater' | 'less' | 'multiples' | 'prime'
  challengeValue?: number
  targetCount: number
  bubbleCount: number
  timeLimit: number
  numberRange: [number, number]
}

const gameLevels: GameLevel[] = [
  { id: 1, challengeType: 'even', targetCount: 3, bubbleCount: 8, timeLimit: 15, numberRange: [1, 10] },
  { id: 2, challengeType: 'odd', targetCount: 3, bubbleCount: 8, timeLimit: 15, numberRange: [1, 10] },
  { id: 3, challengeType: 'greater', challengeValue: 5, targetCount: 3, bubbleCount: 10, timeLimit: 18, numberRange: [1, 10] },
  { id: 4, challengeType: 'less', challengeValue: 8, targetCount: 3, bubbleCount: 10, timeLimit: 18, numberRange: [1, 10] },
  { id: 5, challengeType: 'multiples', challengeValue: 3, targetCount: 4, bubbleCount: 12, timeLimit: 20, numberRange: [1, 15] },
  { id: 6, challengeType: 'even', targetCount: 4, bubbleCount: 12, timeLimit: 18, numberRange: [10, 20] },
  { id: 7, challengeType: 'multiples', challengeValue: 5, targetCount: 3, bubbleCount: 12, timeLimit: 22, numberRange: [1, 25] },
  { id: 8, challengeType: 'greater', challengeValue: 15, targetCount: 4, bubbleCount: 14, timeLimit: 20, numberRange: [10, 25] },
  { id: 9, challengeType: 'prime', targetCount: 4, bubbleCount: 15, timeLimit: 25, numberRange: [1, 20] },
  { id: 10, challengeType: 'less', challengeValue: 12, targetCount: 5, bubbleCount: 16, timeLimit: 22, numberRange: [5, 20] }
]

const NumberBubblesGame: React.FC = () => {
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

  const isPrime = (num: number): boolean => {
    if (num < 2) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false
    }
    return true
  }

  const isTargetNumber = (number: number, level: GameLevel): boolean => {
    switch (level.challengeType) {
      case 'even':
        return number % 2 === 0
      case 'odd':
        return number % 2 === 1
      case 'greater':
        return number > (level.challengeValue || 0)
      case 'less':
        return number < (level.challengeValue || 0)
      case 'multiples':
        return number % (level.challengeValue || 1) === 0 && number > 0
      case 'prime':
        return isPrime(number)
      default:
        return false
    }
  }

  const generateBubbles = useCallback(() => {
    if (!currentGameLevel) return []

    const newBubbles: Bubble[] = []
    const [min, max] = currentGameLevel.numberRange
    const possibleNumbers: number[] = []
    
    // Generate all possible numbers in range
    for (let i = min; i <= max; i++) {
      possibleNumbers.push(i)
    }
    
    // Separate target and non-target numbers
    const targetNumbers = possibleNumbers.filter(num => isTargetNumber(num, currentGameLevel))
    const nonTargetNumbers = possibleNumbers.filter(num => !isTargetNumber(num, currentGameLevel))
    
    // Ensure we have enough target numbers
    const actualTargetCount = Math.min(currentGameLevel.targetCount, targetNumbers.length)
    
    // Add target bubbles
    for (let i = 0; i < actualTargetCount; i++) {
      const number = targetNumbers[Math.floor(Math.random() * targetNumbers.length)]
      newBubbles.push({
        id: i,
        number,
        x: Math.random() * 80 + 5,
        y: Math.random() * 60 + 100,
        isTarget: true,
        popped: false,
        speed: Math.random() * 0.5 + 0.3
      })
    }
    
    // Add non-target bubbles
    const remainingBubbles = currentGameLevel.bubbleCount - actualTargetCount
    for (let i = 0; i < remainingBubbles; i++) {
      const number = nonTargetNumbers[Math.floor(Math.random() * nonTargetNumbers.length)]
      newBubbles.push({
        id: actualTargetCount + i,
        number,
        x: Math.random() * 80 + 5,
        y: Math.random() * 60 + 100,
        isTarget: false,
        popped: false,
        speed: Math.random() * 0.5 + 0.3
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
          setScore(score => score + 15)
          setTargetsPoppedThisLevel(prev => prev + 1)
        } else {
          setScore(score => Math.max(0, score - 8))
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

  const getChallengeDescription = () => {
    if (!currentGameLevel) return ''
    
    switch (currentGameLevel.challengeType) {
      case 'even':
        return t('challenge.numbers.even')
      case 'odd':
        return t('challenge.numbers.odd')
      case 'greater':
        return t('challenge.numbers.greater', { value: currentGameLevel.challengeValue })
      case 'less':
        return t('challenge.numbers.less', { value: currentGameLevel.challengeValue })
      case 'multiples':
        return t('challenge.numbers.multiples', { value: currentGameLevel.challengeValue })
      case 'prime':
        return t('challenge.numbers.prime')
      default:
        return ''
    }
  }

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !levelCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false)
      if (targetsPoppedThisLevel >= currentGameLevel.targetCount) {
        setLevelCompleted(true)
        setTimeout(nextLevel, 2000)
      } else {
        // Failed level, restart
        setTimeout(startLevel, 2000)
      }
    }
  }, [timeLeft, gameStarted, levelCompleted, targetsPoppedThisLevel, currentGameLevel])

  // Check level completion
  useEffect(() => {
    if (gameStarted && !levelCompleted && currentGameLevel) {
      const targetBubbles = bubbles.filter(b => b.isTarget && !b.popped)
      if (targetBubbles.length === 0 && targetsPoppedThisLevel >= currentGameLevel.targetCount) {
        setLevelCompleted(true)
        setGameStarted(false)
        setTimeout(nextLevel, 2000)
      }
    }
  }, [bubbles, gameStarted, levelCompleted, targetsPoppedThisLevel, currentGameLevel])

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
      <div className="number-bubbles-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.number.bubbles.title')}</h2>
          </div>

          <div className="final-score">
            <h3>{t('result.congratulations')}</h3>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <p>{t('score.final.number.bubbles', { score: currentLevel + 1, total: gameLevels.length })}</p>
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
      <div className="number-bubbles-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.number.bubbles.title')}</h2>
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
                <h3>{getChallengeDescription()}</h3>
                <div className="challenge-display">
                  <div className="challenge-info">
                    <p>⏰ {t('time.limit')}: {currentGameLevel.timeLimit} {t('time.seconds')}</p>
                    <p>🎯 {t('target.find')}: {currentGameLevel.targetCount} {t('numbers.correct')}</p>
                    <p>📊 {t('number.range')}: {currentGameLevel.numberRange[0]} - {currentGameLevel.numberRange[1]}</p>
                  </div>
                </div>
                <button className="start-level-btn" onClick={startLevel}>
                  ▶️ {t('button.start.level')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="number-bubbles-game">
      <div className="game-container">
        <div className="game-header">
          <h2>{t('game.number.bubbles.title')}</h2>
          <div className="game-info">
            <span>{t('level.current', { current: currentLevel + 1, total: gameLevels.length })}</span>
            <span>⏰ {timeLeft}s</span>
            <span>{t('game.score', { score })}</span>
          </div>
        </div>

        <div className="game-area">
          <div className="target-display">
            <span>{t('challenge.current')}: {getChallengeDescription()}</span>
            <span>{t('found.count')}: {targetsPoppedThisLevel}/{currentGameLevel.targetCount}</span>
          </div>

          <div className="bubbles-container">
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className={`bubble number-bubble ${bubble.isTarget ? 'target-bubble' : 'normal-bubble'} ${
                  bubble.popped ? 'popped' : ''
                }`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  display: bubble.popped ? 'none' : 'flex'
                }}
                onClick={() => handleBubbleClick(bubble.id)}
              >
                {bubble.number}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberBubblesGame