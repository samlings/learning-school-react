import React, { useState } from 'react'
import './CHJSoundGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface GameItem {
  id: number
  word: string
  image: string
  correctSound: 'CH' | 'J'
  audioFile?: string
}

const gameData: GameItem[] = [
  { id: 1, word: 'chave', image: '🗝️', correctSound: 'CH' },
  { id: 2, word: 'jarro', image: '🏺', correctSound: 'J' },
  { id: 3, word: 'chapeu', image: '🎩', correctSound: 'CH' },
  { id: 4, word: 'janela', image: '🪟', correctSound: 'J' },
  { id: 5, word: 'chocolate', image: '🍫', correctSound: 'CH' },
  { id: 6, word: 'jardim', image: '🌻', correctSound: 'J' },
  { id: 7, word: 'chuva', image: '🌧️', correctSound: 'CH' },
  { id: 8, word: 'joelho', image: '🦵', correctSound: 'J' },
  { id: 9, word: 'chefe', image: '👔', correctSound: 'CH' },
  { id: 10, word: 'jogo', image: '🎲', correctSound: 'J' },
]

const CHJSoundGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<'CH' | 'J' | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const { t } = useLanguage()

  const currentItem = gameData[currentIndex]

  const handleAnswer = (answer: 'CH' | 'J') => {
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
      <div className="chj-game-container">
        <div className="game-complete">
          <h2>{t('result.congratulations')}</h2>
          <p className="final-score">
            {t('score.final.chj', { score, total: gameData.length })}
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
    <div className="chj-game-container">
      <div className="game-header">
        <h2>🎯 {t('game.chj.title')}</h2>
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
              {currentItem.word.replace(/^(ch|j)/i, (match) => 
                '_'.repeat(match.length)
              )}
            </h3>
            <button className="play-sound-btn" onClick={playWord}>
              {t('button.listen')}
            </button>
          </div>
        </div>

        <div className="question">
          <p>{t('question.chj.sound')}</p>
        </div>

        <div className="answer-buttons">
          <button
            className={`answer-btn ${selectedAnswer === 'CH' ? 'selected' : ''} ${
              showResult && currentItem.correctSound === 'CH' ? 'correct' : ''
            } ${showResult && selectedAnswer === 'CH' && currentItem.correctSound !== 'CH' ? 'incorrect' : ''}`}
            onClick={() => handleAnswer('CH')}
            disabled={showResult}
          >
            <span className="sound-letter">CH</span>
            <span className="sound-example">{t('feature.example.chave')}</span>
          </button>

          <button
            className={`answer-btn ${selectedAnswer === 'J' ? 'selected' : ''} ${
              showResult && currentItem.correctSound === 'J' ? 'correct' : ''
            } ${showResult && selectedAnswer === 'J' && currentItem.correctSound !== 'J' ? 'incorrect' : ''}`}
            onClick={() => handleAnswer('J')}
            disabled={showResult}
          >
            <span className="sound-letter">J</span>
            <span className="sound-example">{t('feature.example.jarro')}</span>
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
                <span>{t('result.incorrect.chj', { answer: currentItem.correctSound })}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CHJSoundGame