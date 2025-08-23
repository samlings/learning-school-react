import React, { useState, useEffect, useCallback } from 'react'
import './RocketMathGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GameLevel {
  id: number
  table: number
  questionsCount: number
  timeLimit: number
  targetFuel: number
}

interface Question {
  id: number
  a: number
  b: number
  answer: number
  options: number[]
}

const gameLevels: GameLevel[] = [
  { id: 1, table: 2, questionsCount: 5, timeLimit: 60, targetFuel: 100 },
  { id: 2, table: 3, questionsCount: 6, timeLimit: 70, targetFuel: 120 },
  { id: 3, table: 4, questionsCount: 6, timeLimit: 75, targetFuel: 120 },
  { id: 4, table: 5, questionsCount: 7, timeLimit: 80, targetFuel: 140 },
  { id: 5, table: 6, questionsCount: 7, timeLimit: 85, targetFuel: 140 },
  { id: 6, table: 7, questionsCount: 8, timeLimit: 90, targetFuel: 160 },
  { id: 7, table: 8, questionsCount: 8, timeLimit: 95, targetFuel: 160 },
  { id: 8, table: 9, questionsCount: 9, timeLimit: 100, targetFuel: 180 },
  { id: 9, table: 10, questionsCount: 10, timeLimit: 110, targetFuel: 200 },
  { id: 10, table: 12, questionsCount: 12, timeLimit: 120, targetFuel: 240 }
]

const RocketMathGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [fuel, setFuel] = useState(0)
  const [rocketHeight, setRocketHeight] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

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
    setFuel(0)
    setRocketHeight(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswerClick = (answer: number) => {
    if (showResult || !currentQuestion) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentQuestion.answer
    
    if (isCorrect) {
      setCorrectAnswers(prev => {
        const newCorrectAnswers = prev + 1
        // Calculate rocket height based on progress: (correct answers / total questions) * 85%
        // 85% so rocket reaches planet but doesn't go beyond it
        const progressPercent = (newCorrectAnswers / (currentGameLevel?.questionsCount || 1)) * 85
        setRocketHeight(progressPercent)
        return newCorrectAnswers
      })
      setScore(prev => prev + 20)
      setFuel(prev => prev + 20)
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }
    
    setTimeout(() => {
      setQuestionsAnswered(prev => prev + 1)
      setShowResult(false)
      setSelectedAnswer(null)
      
      const nextQuestionIndex = questionsAnswered + 1
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestion(questions[nextQuestionIndex])
      } else {
        // Level completed
        setLevelCompleted(true)
        setGameStarted(false)
        
        if (fuel >= currentGameLevel.targetFuel * 0.8) {
          setScore(prev => prev + 50) // Bonus for completing level
        }
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

  const getStarsForLevel = (): number => {
    const accuracyRate = correctAnswers / (questionsAnswered || 1)
    if (accuracyRate >= 0.9) return 3
    if (accuracyRate >= 0.7) return 2
    if (accuracyRate >= 0.5) return 1
    return 0
  }

  const getPlanetName = (level: number): string => {
    const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Alpha Centauri']
    return planets[level] || 'Unknown Planet'
  }

  if (gameFinished) {
    return (
      <div className="rocket-math-game">
        <div className="game-finished">
          <div className="space-background"></div>
          <h2>🚀 {t('result.congratulations')} 🚀</h2>
          <p>{t('rocket.final.score', { score })}</p>
          <p>{t('rocket.reached.destination')}</p>
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
      <div className="rocket-math-game">
        <div className="level-completed">
          <div className="space-background"></div>
          <h2>{t('rocket.planet.reached', { planet: getPlanetName(currentLevel) })}</h2>
          <div className="level-stats">
            <p>{t('rocket.questions.correct', { correct: correctAnswers, total: questionsAnswered })}</p>
            <p>{t('rocket.accuracy', { accuracy })}</p>
            <p>{t('rocket.fuel.collected', { fuel })}</p>
            <div className="stars">
              {'⭐'.repeat(stars)}
            </div>
          </div>
          <div className="level-buttons">
            {currentLevel < gameLevels.length - 1 && (
              <button onClick={nextLevel} className="next-level-btn">
                {t('button.next.level')} 🚀
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
      <div className="rocket-math-game">
        <div className="game-start">
          <div className="space-background"></div>
          <h2>{t('rocket.title')}</h2>
          <div className="level-info">
            <h3>{t('rocket.planet', { planet: getPlanetName(currentLevel) })}</h3>
            <p>{t('rocket.times.table', { table: currentGameLevel?.table })}</p>
            <p>{t('rocket.questions', { count: currentGameLevel?.questionsCount })}</p>
            <p>{t('rocket.time.limit', { time: currentGameLevel?.timeLimit })}</p>
          </div>
          <button onClick={startLevel} className="start-btn">
            {t('button.launch.rocket')} 🚀
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rocket-math-game">
      <div className="space-background"></div>
      
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
            <span className="stat-label">{t('stat.label.progress')}</span>
            <span className="stat-value">{questionsAnswered}/{currentGameLevel?.questionsCount}</span>
          </div>
        </div>
      </div>

      <div className="rocket-container">
        <div className="rocket-track">
          <div 
            className="rocket" 
            style={{ bottom: `${rocketHeight}%` }}
          >
            🚀
          </div>
          <div className="planet-target">🪐</div>
        </div>
        
        <div className="fuel-gauge">
          <div className="fuel-label">{t('stat.label.fuel')}</div>
          <div className="fuel-bar">
            <div 
              className="fuel-fill" 
              style={{ height: `${Math.min(100, (fuel / (currentGameLevel?.targetFuel || 100)) * 100)}%` }}
            ></div>
          </div>
          <div className="fuel-amount">{fuel}</div>
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
              {selectedAnswer === currentQuestion.answer ? t('result.correct') : t('result.incorrect')}
              {selectedAnswer !== currentQuestion.answer && (
                <div>{t('result.correct.answer', { answer: currentQuestion.answer })}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RocketMathGame