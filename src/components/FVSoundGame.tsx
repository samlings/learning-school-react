import React, { useState } from 'react'
import './FVSoundGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GameItem {
  id: number
  word: string
  image: string
  correctSound: 'F' | 'V'
  audioFile?: string
}

const gameData: GameItem[] = [
  { id: 1, word: 'faca', image: '🔪', correctSound: 'F' },
  { id: 2, word: 'vaca', image: '🐄', correctSound: 'V' },
  { id: 3, word: 'fogo', image: '🔥', correctSound: 'F' },
  { id: 4, word: 'vento', image: '💨', correctSound: 'V' },
  { id: 5, word: 'flor', image: '🌸', correctSound: 'F' },
  { id: 6, word: 'verde', image: '🍃', correctSound: 'V' },
  { id: 7, word: 'feliz', image: '😊', correctSound: 'F' },
  { id: 8, word: 'vidro', image: '🥛', correctSound: 'V' },
]

const FVSoundGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<'F' | 'V' | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const { t } = useLanguage()

  const currentItem = gameData[currentIndex]

  const handleAnswer = (answer: 'F' | 'V') => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentItem.correctSound) {
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
    const utterance = new SpeechSynthesisUtterance(currentItem.word)
    utterance.lang = 'pt-PT'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  if (gameComplete) {
    return (
      <div className="game-container">
        <div className="game-complete">
          <h2>{t('result.congratulations')}</h2>
          <p className="final-score">
            {t('score.final.fv', { score, total: gameData.length })}
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
    <div className="game-container">
      <div className="game-header">
        <h2>🎯 {t('game.fv.title')}</h2>
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
            <h3 className="word">
              {currentItem.word.replace(/^[fvFV]/, '_')}
            </h3>
            <button className="play-sound-btn" onClick={playWord}>
              {t('button.listen')}
            </button>
          </div>
        </div>

        <div className="question">
          <p>{t('question.fv.sound')}</p>
        </div>

        <div className="answer-buttons">
          <button
            className={`answer-btn ${selectedAnswer === 'F' ? 'selected' : ''} ${
              showResult && currentItem.correctSound === 'F' ? 'correct' : ''
            } ${showResult && selectedAnswer === 'F' && currentItem.correctSound !== 'F' ? 'incorrect' : ''}`}
            onClick={() => handleAnswer('F')}
            disabled={showResult}
          >
            <span className="sound-letter">F</span>
            <span className="sound-example">{t('feature.example.faca')}</span>
          </button>

          <button
            className={`answer-btn ${selectedAnswer === 'V' ? 'selected' : ''} ${
              showResult && currentItem.correctSound === 'V' ? 'correct' : ''
            } ${showResult && selectedAnswer === 'V' && currentItem.correctSound !== 'V' ? 'incorrect' : ''}`}
            onClick={() => handleAnswer('V')}
            disabled={showResult}
          >
            <span className="sound-letter">V</span>
            <span className="sound-example">{t('feature.example.vaca')}</span>
          </button>
        </div>

        {showResult && (
          <div className="result-feedback">
            {selectedAnswer === currentItem.correctSound ? (
              <div className="correct-feedback">
                <span>{t('result.correct')}</span>
              </div>
            ) : (
              <div className="incorrect-feedback">
                <span>{t('result.incorrect.fv', { answer: currentItem.correctSound })}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FVSoundGame