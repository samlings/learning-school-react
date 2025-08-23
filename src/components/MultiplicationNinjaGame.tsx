import React, { useState, useEffect, useCallback } from 'react'
import './MultiplicationNinjaGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface Enemy {
  id: number
  question: string
  correctAnswer: number
  options: number[]
  x: number
  y: number
  speed: number
  defeated: boolean
  attacking: boolean
}

interface GameLevel {
  id: number
  table: number
  enemyCount: number
  enemySpeed: number
  timeLimit: number
  spawnInterval: number
}

const gameLevels: GameLevel[] = [
  { id: 1, table: 2, enemyCount: 8, enemySpeed: 1.0, timeLimit: 60, spawnInterval: 3000 },
  { id: 2, table: 3, enemyCount: 10, enemySpeed: 1.2, timeLimit: 65, spawnInterval: 2800 },
  { id: 3, table: 4, enemyCount: 10, enemySpeed: 1.3, timeLimit: 70, spawnInterval: 2600 },
  { id: 4, table: 5, enemyCount: 12, enemySpeed: 1.4, timeLimit: 75, spawnInterval: 2400 },
  { id: 5, table: 6, enemyCount: 12, enemySpeed: 1.5, timeLimit: 80, spawnInterval: 2200 },
  { id: 6, table: 7, enemyCount: 14, enemySpeed: 1.6, timeLimit: 85, spawnInterval: 2000 },
  { id: 7, table: 8, enemyCount: 14, enemySpeed: 1.7, timeLimit: 90, spawnInterval: 1800 },
  { id: 8, table: 9, enemyCount: 16, enemySpeed: 1.8, timeLimit: 95, spawnInterval: 1600 },
  { id: 9, table: 10, enemySpeed: 1.9, enemyCount: 16, timeLimit: 100, spawnInterval: 1400 },
  { id: 10, table: 12, enemyCount: 20, enemySpeed: 2.0, timeLimit: 120, spawnInterval: 1200 }
]

const MultiplicationNinjaGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [enemiesDefeated, setEnemiesDefeated] = useState(0)
  const [enemiesSpawned, setEnemiesSpawned] = useState(0)
  const [health, setHealth] = useState(100)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const currentGameLevel = gameLevels[currentLevel]

  const generateEnemy = useCallback((enemyId: number, table: number): Enemy => {
    const a = table
    const b = Math.floor(Math.random() * 10) + 1
    const correctAnswer = a * b
    
    // Generate wrong options
    const wrongOptions = new Set<number>()
    while (wrongOptions.size < 3) {
      const wrong = correctAnswer + Math.floor(Math.random() * 30) - 15
      if (wrong !== correctAnswer && wrong > 0 && wrong < 200) {
        wrongOptions.add(wrong)
      }
    }
    
    const options = [correctAnswer, ...Array.from(wrongOptions)]
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }
    
    return {
      id: enemyId,
      question: `${a} × ${b}`,
      correctAnswer,
      options,
      x: Math.random() * 70 + 10, // 10-80% from left
      y: Math.random() * 60 + 20, // 20-80% from top
      speed: currentGameLevel.enemySpeed,
      defeated: false,
      attacking: false
    }
  }, [currentGameLevel])

  const spawnEnemy = useCallback(() => {
    if (enemiesSpawned >= currentGameLevel.enemyCount) return
    
    const newEnemy = generateEnemy(Date.now(), currentGameLevel.table)
    setEnemies(prev => [...prev, newEnemy])
    setEnemiesSpawned(prev => prev + 1)
  }, [currentGameLevel, enemiesSpawned, generateEnemy])

  const startLevel = () => {
    if (!currentGameLevel) return
    
    setEnemies([])
    setEnemiesDefeated(0)
    setEnemiesSpawned(0)
    setHealth(100)
    setCombo(0)
    setTimeLeft(currentGameLevel.timeLimit)
    setGameStarted(true)
    setLevelCompleted(false)
    setSelectedEnemy(null)
    setSelectedAnswer(null)
    setShowResult(false)
    
    // Spawn first enemy immediately
    spawnEnemy()
  }

  const handleEnemyClick = (enemy: Enemy) => {
    if (enemy.defeated || selectedEnemy || showResult) return
    
    setSelectedEnemy(enemy)
  }

  const handleAnswerClick = (answer: number) => {
    if (!selectedEnemy || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    const isCorrect = answer === selectedEnemy.correctAnswer
    
    if (isCorrect) {
      // Correct answer
      setEnemies(prev => prev.map(e => 
        e.id === selectedEnemy.id 
          ? { ...e, defeated: true }
          : e
      ))
      setEnemiesDefeated(prev => prev + 1)
      setCombo(prev => {
        const newCombo = prev + 1
        setMaxCombo(current => Math.max(current, newCombo))
        return newCombo
      })
      
      const comboMultiplier = Math.min(combo + 1, 5)
      const basePoints = 25
      setScore(prev => prev + basePoints * comboMultiplier)
      
      // Health regeneration for correct answers (small amount)
      setHealth(prev => Math.min(100, prev + 2))
      
    } else {
      // Wrong answer - reduced health loss from 15 to 5
      setCombo(0)
      setHealth(prev => {
        const newHealth = Math.max(0, prev - 5)
        if (newHealth === 0) {
          setGameStarted(false)
          setLevelCompleted(true)
        }
        return newHealth
      })
      setScore(prev => Math.max(0, prev - 10))
    }
    
    setTimeout(() => {
      setSelectedEnemy(null)
      setSelectedAnswer(null)
      setShowResult(false)
      
      if (isCorrect) {
        // Remove defeated enemy after animation
        setTimeout(() => {
          setEnemies(prev => prev.filter(e => e.id !== selectedEnemy.id))
        }, 500)
      }
    }, 1500)
  }

  const nextLevel = () => {
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(prev => prev + 1)
      setLevelCompleted(false)
    } else {
      setGameFinished(true)
    }
  }

  const restartLevel = () => {
    setLevelCompleted(false)
    startLevel()
  }

  const restartGame = () => {
    setCurrentLevel(0)
    setGameFinished(false)
    setScore(0)
    setMaxCombo(0)
  }

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false)
      setLevelCompleted(true)
    }
  }, [gameStarted, timeLeft])

  // Enemy spawning effect
  useEffect(() => {
    if (!gameStarted || enemiesSpawned >= currentGameLevel.enemyCount) return
    
    const spawnTimer = setTimeout(() => {
      spawnEnemy()
    }, currentGameLevel.spawnInterval)
    
    return () => clearTimeout(spawnTimer)
  }, [gameStarted, enemiesSpawned, currentGameLevel.spawnInterval, spawnEnemy, currentGameLevel.enemyCount])

  // Enemy movement effect
  useEffect(() => {
    if (!gameStarted) return
    
    const moveTimer = setInterval(() => {
      setEnemies(prev => prev.map(enemy => {
        if (enemy.defeated) return enemy
        
        // Simple movement pattern - enemies move towards ninja
        const centerX = 50
        const centerY = 50
        const dx = centerX - enemy.x
        const dy = centerY - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 15 && !enemy.attacking) {
          // Enemy reached ninja, attack! - reduced damage from 10 to 3
          setHealth(current => {
            const newHealth = Math.max(0, current - 3)
            if (newHealth === 0) {
              setGameStarted(false)
              setLevelCompleted(true)
            }
            return newHealth
          })
          setCombo(0)
          return { ...enemy, attacking: true }
        }
        
        if (!enemy.attacking && distance > 5) {
          const moveX = (dx / distance) * enemy.speed * 0.5
          const moveY = (dy / distance) * enemy.speed * 0.5
          
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY
          }
        }
        
        return enemy
      }))
    }, 100)
    
    return () => clearInterval(moveTimer)
  }, [gameStarted])

  // Check level completion
  useEffect(() => {
    if (gameStarted && enemiesDefeated >= currentGameLevel.enemyCount) {
      setGameStarted(false)
      setLevelCompleted(true)
      setScore(prev => prev + 100) // Level completion bonus
    }
  }, [enemiesDefeated, currentGameLevel.enemyCount, gameStarted])

  const getStarsForLevel = (): number => {
    const accuracyRate = enemiesDefeated / Math.max(currentGameLevel.enemyCount, 1)
    if (accuracyRate >= 0.9 && health > 70) return 3
    if (accuracyRate >= 0.7 && health > 40) return 2
    if (accuracyRate >= 0.5) return 1
    return 0
  }

  if (gameFinished) {
    return (
      <div className="ninja-math-game">
        <div className="game-finished">
          <div className="dojo-background"></div>
          <h2>{t('ninja.master.achieved')}</h2>
          <div className="final-stats">
            <p>{t('ninja.final.score', { score })}</p>
            <p>{t('ninja.max.combo', { combo: maxCombo })}</p>
            <p>{t('ninja.mastered.tables')}</p>
          </div>
          <button onClick={restartGame} className="restart-btn">
            {t('button.play.again')}
          </button>
        </div>
      </div>
    )
  }

  if (levelCompleted) {
    const stars = getStarsForLevel()
    const accuracy = Math.round((enemiesDefeated / Math.max(currentGameLevel.enemyCount, 1)) * 100)
    
    return (
      <div className="ninja-math-game">
        <div className="level-completed">
          <div className="dojo-background"></div>
          <h2>⚔️ {t('level.complete')} ⚔️</h2>
          <div className="level-stats">
            <p>{t('ninja.enemies.defeated', { defeated: enemiesDefeated, total: currentGameLevel.enemyCount })}</p>
            <p>{t('ninja.accuracy', { accuracy })}</p>
            <p>{t('ninja.health.remaining', { health })}</p>
            <p>{t('ninja.max.combo.achieved', { combo: maxCombo })}</p>
            <div className="stars">
              {'⭐'.repeat(stars)}
            </div>
          </div>
          <div className="level-buttons">
            {currentLevel < gameLevels.length - 1 && (
              <button onClick={nextLevel} className="next-level-btn">
                {t('button.next.level')} ⚔️
              </button>
            )}
            <button onClick={restartLevel} className="retry-btn">
              {t('button.retry.level')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="ninja-math-game">
        <div className="game-start">
          <div className="dojo-background"></div>
          <h2>{t('ninja.title')}</h2>
          <div className="level-info">
            <h3>{t('ninja.times.table', { table: currentGameLevel?.table })}</h3>
            <p>{t('ninja.enemies', { count: currentGameLevel?.enemyCount })}</p>
            <p>{t('ninja.time.limit', { time: currentGameLevel?.timeLimit })}</p>
            <p>{t('ninja.defeat.enemies')}</p>
          </div>
          <button onClick={startLevel} className="start-btn">
            {t('button.begin.training')} ⚔️
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ninja-math-game">
      <div className="dojo-background"></div>
      
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">{t('stat.label.level')}</span>
            <span className="stat-value">{currentLevel + 1}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('stat.label.points')}</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('stat.label.time')}</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('stat.label.combo')}</span>
            <span className="stat-value">{combo}x</span>
          </div>
        </div>
        
        <div className="health-bar">
          <div className="health-label">{t('stat.label.health')}</div>
          <div className="health-container">
            <div 
              className="health-fill" 
              style={{ width: `${health}%` }}
            ></div>
          </div>
          <div className="health-amount">{health}%</div>
        </div>
      </div>

      <div className="battle-area">
        <div className="ninja-character">🥷</div>
        
        <div className="progress-info">
          <span>{t('ninja.defeated', { defeated: enemiesDefeated, total: currentGameLevel?.enemyCount })}</span>
        </div>
        
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            className={`enemy ${enemy.defeated ? 'defeated' : ''} ${enemy.attacking ? 'attacking' : ''}`}
            style={{ 
              left: `${enemy.x}%`, 
              top: `${enemy.y}%`,
              cursor: enemy.defeated ? 'default' : 'pointer'
            }}
            onClick={() => handleEnemyClick(enemy)}
          >
            <div className="enemy-sprite">👹</div>
            <div className="enemy-question">{enemy.question}</div>
          </div>
        ))}
      </div>

      {selectedEnemy && (
        <div className="question-modal">
          <div className="modal-content">
            <h3>{selectedEnemy.question} = ?</h3>
            <div className="answer-options">
              {selectedEnemy.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`answer-btn ${
                    showResult 
                      ? option === selectedAnswer
                        ? selectedAnswer === selectedEnemy.correctAnswer 
                          ? 'correct' 
                          : 'incorrect'
                        : ''
                      : ''
                  }`}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`result-message ${showResult ? 'show' : ''}`}>
                {t('ninja.strike.message')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiplicationNinjaGame