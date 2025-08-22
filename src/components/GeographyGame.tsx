import React, { useState } from 'react'
import './GeographyGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GeographyItem {
  id: number
  country: string
  capital: string
  flag: string
  options: string[]
  type: 'capital' | 'flag' | 'country'
}

const gameData: GeographyItem[] = [
  {
    id: 1,
    country: 'Portugal',
    capital: 'Lisboa',
    flag: '🇵🇹',
    options: ['Lisboa', 'Porto', 'Madrid', 'Barcelona'],
    type: 'capital'
  },
  {
    id: 2,
    country: 'Espanha',
    capital: 'Madrid',
    flag: '🇪🇸',
    options: ['Barcelona', 'Madrid', 'Sevilha', 'Valencia'],
    type: 'capital'
  },
  {
    id: 3,
    country: 'França',
    capital: 'Paris',
    flag: '🇫🇷',
    options: ['França', 'Itália', 'Alemanha', 'Reino Unido'],
    type: 'flag'
  },
  {
    id: 4,
    country: 'Reino Unido',
    capital: 'Londres',
    flag: '🇬🇧',
    options: ['Reino Unido', 'Irlanda', 'França', 'Holanda'],
    type: 'flag'
  },
  {
    id: 5,
    country: 'Alemanha',
    capital: 'Berlim',
    flag: '🇩🇪',
    options: ['Munique', 'Hamburgo', 'Berlim', 'Frankfurt'],
    type: 'capital'
  },
  {
    id: 6,
    country: 'Itália',
    capital: 'Roma',
    flag: '🇮🇹',
    options: ['Itália', 'Grécia', 'Croácia', 'Malta'],
    type: 'flag'
  },
  {
    id: 7,
    country: 'Brasil',
    capital: 'Brasília',
    flag: '🇧🇷',
    options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    type: 'capital'
  },
  {
    id: 8,
    country: 'Estados Unidos',
    capital: 'Washington',
    flag: '🇺🇸',
    options: ['Estados Unidos', 'Canadá', 'México', 'Argentina'],
    type: 'flag'
  }
]

const GeographyGame: React.FC = () => {
  const { t } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const currentItem = gameData[currentQuestion]

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return

    setSelectedAnswer(answer)
    
    let isCorrect = false
    if (currentItem.type === 'capital') {
      isCorrect = answer === currentItem.capital
    } else if (currentItem.type === 'flag') {
      isCorrect = answer === currentItem.country
    }

    if (isCorrect) {
      setScore(score + 1)
      setAnswerFeedback('correct')
    } else {
      setAnswerFeedback('incorrect')
    }
    
    setShowResult(true)
    
    setTimeout(() => {
      if (currentQuestion < gameData.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setAnswerFeedback(null)
      } else {
        setGameFinished(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameFinished(false)
    setAnswerFeedback(null)
  }

  const getQuestion = () => {
    if (currentItem.type === 'capital') {
      return t('question.geography.country')
    } else if (currentItem.type === 'flag') {
      return t('question.geography.flag')
    }
    return ''
  }

  const getCorrectAnswer = () => {
    if (currentItem.type === 'capital') {
      return currentItem.capital
    } else if (currentItem.type === 'flag') {
      return currentItem.country
    }
    return ''
  }

  if (gameFinished) {
    const getFeedback = () => {
      const percentage = (score / gameData.length) * 100
      if (percentage === 100) return t('score.perfect')
      if (percentage >= 70) return t('score.good')
      return t('score.practice')
    }

    return (
      <div className="geography-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.geography.title')}</h2>
          </div>

          <div className="final-score">
            <h3>{t('result.congratulations')}</h3>
            <div className="score-display">
              <span className="score-number">{score}/{gameData.length}</span>
              <p>{t('score.final.geography', { score, total: gameData.length })}</p>
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

  return (
    <div className="geography-game">
      <div className="game-container">
        <div className="game-header">
          <h2>{t('game.geography.title')}</h2>
          <div className="game-info">
            <span>{t('game.question.number', { current: currentQuestion + 1, total: gameData.length })}</span>
            <span>{t('game.score', { score })}</span>
          </div>
        </div>

        <div className="question-container">
          <h3 className="question">{getQuestion()}</h3>
          
          <div className="geography-display">
            {currentItem.type === 'capital' ? (
              <div className="country-info">
                <div className="flag">{currentItem.flag}</div>
                <div className="country-name">{currentItem.country}</div>
              </div>
            ) : (
              <div className="flag-display">
                <div className="flag large">{currentItem.flag}</div>
              </div>
            )}
          </div>

          <div className="options-container">
            {currentItem.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === option
                    ? answerFeedback === 'correct'
                      ? 'correct'
                      : 'incorrect'
                    : ''
                } ${selectedAnswer && selectedAnswer !== option ? 'disabled' : ''}`}
                onClick={() => handleAnswerClick(option)}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`result-message ${answerFeedback}`}>
              {answerFeedback === 'correct' ? (
                <p>{t('result.correct')}</p>
              ) : (
                <p>{t('result.incorrect.translation', { 
                  portuguese: currentItem.type === 'capital' ? currentItem.country : 'Esta bandeira', 
                  english: getCorrectAnswer() 
                })}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeographyGame