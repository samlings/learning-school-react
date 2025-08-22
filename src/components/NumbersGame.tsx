import React, { useState } from 'react'
import './NumbersGame.css'
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
    portuguese: 'Um',
    english: 'One',
    image: '1️⃣',
    options: ['One', 'Two', 'Three', 'Four']
  },
  {
    id: 2,
    portuguese: 'Dois',
    english: 'Two',
    image: '2️⃣',
    options: ['One', 'Two', 'Five', 'Six']
  },
  {
    id: 3,
    portuguese: 'Três',
    english: 'Three',
    image: '3️⃣',
    options: ['Two', 'Four', 'Three', 'Seven']
  },
  {
    id: 4,
    portuguese: 'Quatro',
    english: 'Four',
    image: '4️⃣',
    options: ['Three', 'Four', 'Five', 'Eight']
  },
  {
    id: 5,
    portuguese: 'Cinco',
    english: 'Five',
    image: '5️⃣',
    options: ['Four', 'Six', 'Five', 'Nine']
  },
  {
    id: 6,
    portuguese: 'Seis',
    english: 'Six',
    image: '6️⃣',
    options: ['Five', 'Seven', 'Six', 'Ten']
  },
  {
    id: 7,
    portuguese: 'Sete',
    english: 'Seven',
    image: '7️⃣',
    options: ['Six', 'Eight', 'Seven', 'Nine']
  },
  {
    id: 8,
    portuguese: 'Oito',
    english: 'Eight',
    image: '8️⃣',
    options: ['Seven', 'Nine', 'Eight', 'Ten']
  },
  {
    id: 9,
    portuguese: 'Nove',
    english: 'Nine',
    image: '9️⃣',
    options: ['Eight', 'Ten', 'Nine', 'Eleven']
  },
  {
    id: 10,
    portuguese: 'Dez',
    english: 'Ten',
    image: '🔟',
    options: ['Nine', 'Eleven', 'Ten', 'Twelve']
  }
]

const NumbersGame: React.FC = () => {
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
      <div className="numbers-game-container">
        <div className="game-complete">
          <h2>{t('result.congratulations')}</h2>
          <p className="final-score">
            {t('score.final.numbers', { score, total: gameData.length })}
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
    <div className="numbers-game-container">
      <div className="game-header">
        <h2>🔢 {t('game.numbers.title')}</h2>
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
          <p>{t('question.number.english')}</p>
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

export default NumbersGame