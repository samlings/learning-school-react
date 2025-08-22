import React, { useState } from 'react'
import './HomeObjectsGame.css'
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
    portuguese: 'Mesa',
    english: 'Table',
    image: '🪑',
    options: ['Chair', 'Table', 'Bed', 'Sofa']
  },
  {
    id: 2,
    portuguese: 'Cadeira',
    english: 'Chair',
    image: '🪑',
    options: ['Table', 'Chair', 'Lamp', 'Door']
  },
  {
    id: 3,
    portuguese: 'Cama',
    english: 'Bed',
    image: '🛏️',
    options: ['Sofa', 'Chair', 'Bed', 'Pillow']
  },
  {
    id: 4,
    portuguese: 'Televisão',
    english: 'Television',
    image: '📺',
    options: ['Computer', 'Television', 'Radio', 'Phone']
  },
  {
    id: 5,
    portuguese: 'Frigorífico',
    english: 'Refrigerator',
    image: '🧊',
    options: ['Oven', 'Refrigerator', 'Microwave', 'Dishwasher']
  },
  {
    id: 6,
    portuguese: 'Porta',
    english: 'Door',
    image: '🚪',
    options: ['Window', 'Wall', 'Door', 'Floor']
  },
  {
    id: 7,
    portuguese: 'Janela',
    english: 'Window',
    image: '🪟',
    options: ['Door', 'Window', 'Mirror', 'Picture']
  },
  {
    id: 8,
    portuguese: 'Espelho',
    english: 'Mirror',
    image: '🪞',
    options: ['Picture', 'Window', 'Mirror', 'Clock']
  },
  {
    id: 9,
    portuguese: 'Relógio',
    english: 'Clock',
    image: '🕐',
    options: ['Watch', 'Clock', 'Phone', 'Computer']
  },
  {
    id: 10,
    portuguese: 'Telefone',
    english: 'Phone',
    image: '📱',
    options: ['Computer', 'Television', 'Phone', 'Radio']
  }
]

const HomeObjectsGame: React.FC = () => {
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
      <div className="home-objects-game-container">
        <div className="game-complete">
          <h2>{t('result.congratulations')}</h2>
          <p className="final-score">
            {t('score.final.home', { score, total: gameData.length })}
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
    <div className="home-objects-game-container">
      <div className="game-header">
        <h2>🏠 {t('game.home.title')}</h2>
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
          <p>{t('question.object.english')}</p>
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

export default HomeObjectsGame