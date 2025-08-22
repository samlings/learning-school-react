import React, { useState } from 'react'
import './FamilyGame.css'
import { useLanguage } from '../contexts/LanguageContext'

interface FamilyMember {
  id: number
  portuguese: string
  english: string
  emoji: string
  options: string[]
}

const gameData: FamilyMember[] = [
  {
    id: 1,
    portuguese: 'Pai',
    english: 'Father',
    emoji: '👨',
    options: ['Father', 'Mother', 'Brother', 'Uncle']
  },
  {
    id: 2,
    portuguese: 'Mãe',
    english: 'Mother',
    emoji: '👩',
    options: ['Sister', 'Mother', 'Aunt', 'Grandmother']
  },
  {
    id: 3,
    portuguese: 'Irmão',
    english: 'Brother',
    emoji: '👦',
    options: ['Cousin', 'Son', 'Brother', 'Father']
  },
  {
    id: 4,
    portuguese: 'Irmã',
    english: 'Sister',
    emoji: '👧',
    options: ['Daughter', 'Sister', 'Mother', 'Aunt']
  },
  {
    id: 5,
    portuguese: 'Avô',
    english: 'Grandfather',
    emoji: '👴',
    options: ['Uncle', 'Father', 'Grandfather', 'Brother']
  },
  {
    id: 6,
    portuguese: 'Avó',
    english: 'Grandmother',
    emoji: '👵',
    options: ['Grandmother', 'Mother', 'Aunt', 'Sister']
  },
  {
    id: 7,
    portuguese: 'Filho',
    english: 'Son',
    emoji: '👶',
    options: ['Brother', 'Son', 'Nephew', 'Cousin']
  },
  {
    id: 8,
    portuguese: 'Filha',
    english: 'Daughter',
    emoji: '👶',
    options: ['Sister', 'Niece', 'Daughter', 'Cousin']
  },
  {
    id: 9,
    portuguese: 'Tio',
    english: 'Uncle',
    emoji: '👨‍🦱',
    options: ['Father', 'Uncle', 'Grandfather', 'Cousin']
  },
  {
    id: 10,
    portuguese: 'Tia',
    english: 'Aunt',
    emoji: '👩‍🦱',
    options: ['Mother', 'Sister', 'Aunt', 'Grandmother']
  }
]

const FamilyGame: React.FC = () => {
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
    const isCorrect = answer === currentItem.english

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

  if (gameFinished) {
    const getFeedback = () => {
      const percentage = (score / gameData.length) * 100
      if (percentage === 100) return t('score.perfect')
      if (percentage >= 70) return t('score.good')
      return t('score.practice')
    }

    return (
      <div className="family-game">
        <div className="game-container">
          <div className="game-header">
            <h2>{t('game.family.title')}</h2>
          </div>

          <div className="final-score">
            <h3>{t('result.congratulations')}</h3>
            <div className="score-display">
              <span className="score-number">{score}/{gameData.length}</span>
              <p>{t('score.final.family', { score, total: gameData.length })}</p>
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
    <div className="family-game">
      <div className="game-container">
        <div className="game-header">
          <h2>{t('game.family.title')}</h2>
          <div className="game-info">
            <span>{t('game.question.number', { current: currentQuestion + 1, total: gameData.length })}</span>
            <span>{t('game.score', { score })}</span>
          </div>
        </div>

        <div className="question-container">
          <h3 className="question">{t('question.family.english')}</h3>
          
          <div className="family-member-display">
            <div className="member-card">
              <div className="member-emoji">{currentItem.emoji}</div>
              <div className="member-info">
                <div className="portuguese-name">{currentItem.portuguese}</div>
                <div className="question-mark">?</div>
              </div>
            </div>
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
                <p>{t('result.correct.translation', { 
                  portuguese: currentItem.portuguese, 
                  english: currentItem.english 
                })}</p>
              ) : (
                <p>{t('result.incorrect.translation', { 
                  portuguese: currentItem.portuguese, 
                  english: currentItem.english 
                })}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FamilyGame