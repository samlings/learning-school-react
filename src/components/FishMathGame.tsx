import React, { useState, useEffect, useCallback } from 'react'
import './FishMathGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GameLevel {
  id: number
  table: number
  questionsCount: number
  timeLimit: number
  targetScore: number
}

interface Question {
  id: number
  a: number
  b: number
  answer: number
  options: number[]
}

interface FallingFood {
  id: number
  x: number
  y: number
  speed: number
  eaten: boolean
  eatenBy: 'fish' | 'crocodile' | null
}

const gameLevels: GameLevel[] = [
  { id: 1, table: 2, questionsCount: 6, timeLimit: 60, targetScore: 120 },
  { id: 2, table: 3, questionsCount: 7, timeLimit: 65, targetScore: 140 },
  { id: 3, table: 4, questionsCount: 7, timeLimit: 70, targetScore: 140 },
  { id: 4, table: 5, questionsCount: 8, timeLimit: 75, targetScore: 160 },
  { id: 5, table: 6, questionsCount: 8, timeLimit: 80, targetScore: 160 },
  { id: 6, table: 7, questionsCount: 9, timeLimit: 85, targetScore: 180 },
  { id: 7, table: 8, questionsCount: 9, timeLimit: 90, targetScore: 180 },
  { id: 8, table: 9, questionsCount: 10, timeLimit: 95, targetScore: 200 },
  { id: 9, table: 10, questionsCount: 10, timeLimit: 100, targetScore: 200 },
  { id: 10, table: 12, questionsCount: 12, timeLimit: 120, targetScore: 240 }
]

const FishMathGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [fishFood, setFishFood] = useState(0)
  const [crocodileFood, setCrocodileFood] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [fallingFood, setFallingFood] = useState<FallingFood | null>(null)
  const [fishEmotion, setFishEmotion] = useState<'happy' | 'sad' | 'neutral'>('neutral')
  const [crocodileEmotion, setCrocodileEmotion] = useState<'happy' | 'neutral'>('neutral')
  const [characterMoving, setCharacterMoving] = useState<'fish' | 'crocodile' | null>(null)
  const [movementTarget, setMovementTarget] = useState<{ x: number; y: number } | null>(null)

  const currentGameLevel = gameLevels[currentLevel]

  const generateQuestion = (table: number, questionId: number): Question => {
    const a = table
    const b = Math.floor(Math.random() * 10) + 1
    const answer = a * b
    
    // Generate 3 incorrect options
    const wrongOptions = new Set<number>()
    while (wrongOptions.size < 3) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10
      if (wrong !== answer && wrong > 0) {
        wrongOptions.add(wrong)
      }
    }
    
    const options = [answer, ...Array.from(wrongOptions)]
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }
    
    return {
      id: questionId,
      a,
      b,
      answer,
      options
    }
  }

  const generateQuestions = useCallback((level: GameLevel): Question[] => {
    const newQuestions: Question[] = []
    for (let i = 0; i < level.questionsCount; i++) {
      newQuestions.push(generateQuestion(level.table, i))
    }
    return newQuestions
  }, [])

  const dropFood = () => {
    // Always drop new food, regardless of previous state
    setFallingFood({
      id: Date.now(),
      x: Math.random() * 60 + 20, // 20-80% from left
      y: 0,
      speed: 1,
      eaten: false,
      eatenBy: null
    })
  }

  const startLevel = () => {
    if (!currentGameLevel) return
    
    const newQuestions = generateQuestions(currentGameLevel)
    setQuestions(newQuestions)
    setCurrentQuestion(newQuestions[0])
    setTimeLeft(currentGameLevel.timeLimit)
    setGameStarted(true)
    setLevelCompleted(false)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setFishFood(0)
    setCrocodileFood(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setFallingFood(null)
    setFishEmotion('neutral')
    setCrocodileEmotion('neutral')
    setCharacterMoving(null)
    setMovementTarget(null)
    
    // Drop first food
    setTimeout(() => {
      dropFood()
    }, 1000)
  }

  const handleAnswerClick = (answer: number) => {
    if (showResult || !currentQuestion || characterMoving) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentQuestion.answer
    
    // Set movement target to food position
    if (fallingFood) {
      setMovementTarget({ x: fallingFood.x, y: fallingFood.y })
      
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1)
        setScore(prev => prev + 20)
        setFishFood(prev => prev + 1)
        
        // Start fish movement sequence
        setCharacterMoving('fish')
        
        // Phase 1: Fish moves to food (800ms)
        setTimeout(() => {
          setFishEmotion('happy')
          // Phase 2: Fish eats food (300ms)
          if (fallingFood) {
            setFallingFood(prev => prev ? { ...prev, eaten: true, eatenBy: 'fish' } : null)
          }
          
          setTimeout(() => {
            // Phase 3: Fish returns to position (800ms)
            setCharacterMoving(null)
            setMovementTarget(null)
            
            setTimeout(() => {
              // Phase 4: Complete sequence
              proceedToNextQuestion()
            }, 800)
          }, 300)
        }, 800)
        
      } else {
        setScore(prev => Math.max(0, prev - 5))
        setCrocodileFood(prev => prev + 1)
        
        // Start crocodile movement sequence
        setCharacterMoving('crocodile')
        
        // Phase 1: Crocodile moves to food (800ms)
        setTimeout(() => {
          setFishEmotion('sad')
          setCrocodileEmotion('happy')
          // Phase 2: Crocodile eats food (300ms)
          if (fallingFood) {
            setFallingFood(prev => prev ? { ...prev, eaten: true, eatenBy: 'crocodile' } : null)
          }
          
          setTimeout(() => {
            // Phase 3: Crocodile returns to position (800ms)
            setCharacterMoving(null)
            setMovementTarget(null)
            
            setTimeout(() => {
              // Phase 4: Complete sequence
              proceedToNextQuestion()
            }, 800)
          }, 300)
        }, 800)
      }
    }
  }

  const proceedToNextQuestion = () => {
    const currentQuestionIndex = questionsAnswered
    setQuestionsAnswered(prev => prev + 1)
    setShowResult(false)
    setSelectedAnswer(null)
    setFishEmotion('neutral')
    setCrocodileEmotion('neutral')
    
    const nextQuestionIndex = currentQuestionIndex + 1
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestion(questions[nextQuestionIndex])
      
      // Clear food and drop new one immediately
      setFallingFood(null)
      setTimeout(() => {
        dropFood()
      }, 800)
    } else {
      // Level completed
      setLevelCompleted(true)
      setGameStarted(false)
      setFallingFood(null)
      
      // Bonus for good performance
      if (fishFood >= currentGameLevel.questionsCount * 0.8) {
        setScore(prev => prev + 50)
      }
    }
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

  // Food falling animation
  useEffect(() => {
    if (!gameStarted || !fallingFood || fallingFood.eaten) return
    
    const fallTimer = setInterval(() => {
      setFallingFood(prev => {
        if (!prev || prev.eaten) return null // Clear eaten food instead of keeping it
        
        const newY = prev.y + prev.speed
        if (newY > 85) {
          // Food reached bottom - crocodile gets it by default
          setCrocodileFood(current => current + 1)
          setFishEmotion('sad')
          setCrocodileEmotion('happy')
          
          setTimeout(() => {
            setFishEmotion('neutral')
            setCrocodileEmotion('neutral')
          }, 1500)
          
          return { ...prev, eaten: true, eatenBy: 'crocodile' }
        }
        
        return { ...prev, y: newY }
      })
    }, 50)
    
    return () => clearInterval(fallTimer)
  }, [gameStarted, fallingFood])

  const getStarsForLevel = (): number => {
    const accuracyRate = correctAnswers / (questionsAnswered || 1)
    if (accuracyRate >= 0.9 && fishFood > crocodileFood) return 3
    if (accuracyRate >= 0.7 && fishFood >= crocodileFood) return 2
    if (accuracyRate >= 0.5) return 1
    return 0
  }

  const getAquariumName = (level: number): string => {
    const aquariums = ['Lago Pequeno', 'Rio Azul', 'Lagoa Verde', 'Mar Calmo', 'Oceano Profundo', 'Recife Coral', 'Baía Tropical', 'Mar Cristalino', 'Oceano Atlântico', 'Grande Barreira']
    return aquariums[level] || 'Aquário Mágico'
  }

  if (gameFinished) {
    return (
      <div className="fish-math-game">
        <div className="game-finished">
          <div className="underwater-background"></div>
          <h2>🐟 Mestre Pescador Alcançado! 🐟</h2>
          <p>Pontuação final: {score}</p>
          <p>O peixinho cresceu e está muito feliz!</p>
          <button onClick={restartGame} className="restart-btn">
            {t('button.play.again')}
          </button>
        </div>
      </div>
    )
  }

  if (levelCompleted) {
    const stars = getStarsForLevel()
    const accuracy = Math.round((correctAnswers / questionsAnswered) * 100)
    
    return (
      <div className="fish-math-game">
        <div className="level-completed">
          <div className="underwater-background"></div>
          <h2>🐟 Aquário: {getAquariumName(currentLevel)} 🐟</h2>
          <div className="level-stats">
            <p>Perguntas corretas: {correctAnswers}/{questionsAnswered}</p>
            <p>Precisão: {accuracy}%</p>
            <p>Comida do peixe: {fishFood}</p>
            <p>Comida do crocodilo: {crocodileFood}</p>
            <div className="stars">
              {'⭐'.repeat(stars)}
            </div>
          </div>
          <div className="level-buttons">
            {currentLevel < gameLevels.length - 1 && (
              <button onClick={nextLevel} className="next-level-btn">
                {t('button.next.level')} 🐟
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
      <div className="fish-math-game">
        <div className="game-start">
          <div className="underwater-background"></div>
          <h2>🐟 Tabuada do Peixe 🐟</h2>
          <div className="level-info">
            <h3>Aquário: {getAquariumName(currentLevel)}</h3>
            <p>Tabuada do: {currentGameLevel?.table}x</p>
            <p>Perguntas: {currentGameLevel?.questionsCount}</p>
            <p>Tempo limite: {currentGameLevel?.timeLimit}s</p>
            <p>Ajuda o peixinho a conseguir mais comida que o crocodilo!</p>
          </div>
          <button onClick={startLevel} className="start-btn">
            {t('button.start.fishing')} 🐟
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fish-math-game">
      <div className="underwater-background"></div>
      
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Nível</span>
            <span className="stat-value">{currentLevel + 1}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pontos</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Tempo</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Progresso</span>
            <span className="stat-value">{questionsAnswered}/{currentGameLevel?.questionsCount}</span>
          </div>
        </div>
      </div>

      <div className="aquarium-container">
        <div 
          className={`fish-character ${characterMoving === 'fish' ? 'moving-to-food' : ''}`} 
          data-emotion={fishEmotion}
          style={{
            '--target-x': movementTarget && characterMoving === 'fish' ? `${movementTarget.x}%` : '15%'
          } as React.CSSProperties}
        >
          <div className="fish-sprite">🐟</div>
          {fishEmotion === 'happy' && <div className="fish-emotion">😊✨</div>}
          {fishEmotion === 'sad' && <div className="fish-emotion">😢💔</div>}
        </div>
        
        <div 
          className={`crocodile-character ${characterMoving === 'crocodile' ? 'moving-to-food' : ''}`} 
          data-emotion={crocodileEmotion}
          style={{
            '--target-x': movementTarget && characterMoving === 'crocodile' ? `${100 - movementTarget.x}%` : '15%'
          } as React.CSSProperties}
        >
          <div className="crocodile-sprite">🐊</div>
          {crocodileEmotion === 'happy' && <div className="crocodile-emotion">😈💪</div>}
        </div>
        
        {fallingFood && (
          <div 
            className={`falling-food ${fallingFood.eaten ? 'eaten' : ''}`}
            style={{ 
              left: `${fallingFood.x}%`, 
              top: `${fallingFood.y}%`,
              opacity: fallingFood.eaten ? 0 : 1
            }}
          >
            🪱
          </div>
        )}
        
        <div className="food-counters">
          <div className="fish-food-counter">
            <span className="counter-label">🐟 Peixe</span>
            <span className="counter-value">{fishFood}</span>
          </div>
          <div className="crocodile-food-counter">
            <span className="counter-label">🐊 Crocodilo</span>
            <span className="counter-value">{crocodileFood}</span>
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="question-container">
          <div className="question">
            <h3>{currentQuestion.a} × {currentQuestion.b} = ?</h3>
          </div>
          
          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={`answer-btn ${
                  showResult 
                    ? option === selectedAnswer
                      ? selectedAnswer === currentQuestion.answer 
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
            <div className={`result-message ${selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.answer 
                ? '🐟 O peixe conseguiu a comida!' 
                : '🐊 O crocodilo levou a comida!'
              }
              {selectedAnswer !== currentQuestion.answer && (
                <div>Resposta correta: {currentQuestion.answer}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FishMathGame