import React, { useState } from 'react'
import './ColorsGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GameItem {
  id: number
  portuguese: string
  english: string
  image: string
  options: string[]
}

const gameData: GameItem[] = [
  {
    id: 1,
    portuguese: 'Vermelho',
    english: 'Red',
    image: '🔴',
    options: ['Red', 'Blue', 'Green', 'Yellow']
  },
  {
    id: 2,
    portuguese: 'Azul',
    english: 'Blue',
    image: '🔵',
    options: ['Green', 'Blue', 'Purple', 'Orange']
  },
  {
    id: 3,
    portuguese: 'Verde',
    english: 'Green',
    image: '🟢',
    options: ['Yellow', 'Red', 'Green', 'Pink']
  },
  {
    id: 4,
    portuguese: 'Amarelo',
    english: 'Yellow',
    image: '🟡',
    options: ['Blue', 'Yellow', 'Purple', 'Black']
  },
  {
    id: 5,
    portuguese: 'Rosa',
    english: 'Pink',
    image: '🌸',
    options: ['Orange', 'White', 'Pink', 'Brown']
  },
  {
    id: 6,
    portuguese: 'Roxo',
    english: 'Purple',
    image: '🟣',
    options: ['Red', 'Blue', 'Purple', 'Green']
  },
  {
    id: 7,
    portuguese: 'Laranja',
    english: 'Orange',
    image: '🟠',
    options: ['Yellow', 'Orange', 'Red', 'Pink']
  },
  {
    id: 8,
    portuguese: 'Preto',
    english: 'Black',
    image: '⚫',
    options: ['White', 'Gray', 'Black', 'Brown']
  },
  {
    id: 9,
    portuguese: 'Branco',
    english: 'White',
    image: '⚪',
    options: ['Black', 'White', 'Gray', 'Silver']
  },
  {
    id: 10,
    portuguese: 'Castanho',
    english: 'Brown',
    image: '🤎',
    options: ['Black', 'Orange', 'Brown', 'Red']
  }
]

const ColorsGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const { t } = useLanguage()

  const currentItem = gameData[currentIndex]

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentItem.english) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentIndex < gameData.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowResult(false)
        setSelectedAnswer(null)
      } else {
        setGameComplete(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setGameComplete(false)
  }

  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentItem.portuguese)
    utterance.lang = 'pt-PT'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  if (gameComplete) {
    return (
      <div className="colors-game-container">
        <div className="game-complete">
          <h2>{t('result.congratulations')}</h2>
          <p className="final-score">
            {t('score.final.colors', { score, total: gameData.length })}
          </p>
          <div className="score-feedback">
            {score === gameData.length ? (
              <p className="perfect">{t('score.perfect')}</p>
            ) : score >= gameData.length * 0.7 ? (
              <p className="good">{t('score.good')}</p>
            ) : (
              <p className="practice">{t('score.practice')}</p>
            )}
          </div>
          <button className="play-again-btn" onClick={resetGame}>
            {t('button.new.game')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="colors-game-container">
      <div className="game-header">
        <h2>🌈 {t('game.colors.title')}</h2>
        <div className="progress">
          <span>{t('game.question.number', { current: currentIndex + 1, total: gameData.length })}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / gameData.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="score">{t('game.score', { score })}</div>
      </div>

      <div className="game-content">
        <div className="word-display">
          <div className="image-container">
            <span className="emoji-image">{currentItem.image}</span>
          </div>
          <div className="word-info">
            <h3 className="portuguese-word">{currentItem.portuguese}</h3>
            <button className="play-sound-btn" onClick={playWord}>
              {t('button.listen')}
            </button>
          </div>
        </div>

        <div className="question">
          <p>{t('question.color.english')}</p>
        </div>

        <div className="answer-options">
          {currentItem.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${
                showResult && option === currentItem.english ? 'correct' : ''
              } ${showResult && selectedAnswer === option && option !== currentItem.english ? 'incorrect' : ''}`}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result-feedback">
            {selectedAnswer === currentItem.english ? (
              <div className="correct-feedback">
                <span>{t('result.correct.translation', { portuguese: currentItem.portuguese, english: currentItem.english })}</span>
              </div>
            ) : (
              <div className="incorrect-feedback">
                <span>{t('result.incorrect.translation', { portuguese: currentItem.portuguese, english: currentItem.english })}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorsGame