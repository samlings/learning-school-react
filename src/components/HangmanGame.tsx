import React, { useState, useEffect } from 'react'
import './HangmanGame.css'
import { useLanguage } from '../contexts/LanguageContext'

const portugueseWords = [
  { word: 'CASA', hint: 'Onde vivemos' },
  { word: 'GATO', hint: 'Animal doméstico que faz miau' },
  { word: 'LIVRO', hint: 'Usamos para ler e aprender' },
  { word: 'ESCOLA', hint: 'Onde vamos para aprender' },
  { word: 'AMIGO', hint: 'Pessoa especial que gostamos' },
  { word: 'FLOR', hint: 'É bonita e tem cor no jardim' },
  { word: 'AGUA', hint: 'Bebemos quando temos sede' },
  { word: 'SOL', hint: 'Brilha no céu durante o dia' },
  { word: 'BOLA', hint: 'Usamos para jogar futebol' },
  { word: 'MESA', hint: 'Onde comemos e estudamos' },
  { word: 'CARRO', hint: 'Meio de transporte com rodas' },
  { word: 'PEIXE', hint: 'Animal que vive na água' },
  { word: 'ARVORE', hint: 'É grande, verde e dá sombra' },
  { word: 'LEITE', hint: 'Bebida branca que vem da vaca' },
  { word: 'CHAPEU', hint: 'Usamos na cabeça' }
]

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const HangmanGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('')
  const [currentHint, setCurrentHint] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const maxWrongGuesses = 6
  const { t } = useLanguage()

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * portugueseWords.length)
    const selectedWord = portugueseWords[randomIndex]
    setCurrentWord(selectedWord.word)
    setCurrentHint(selectedWord.hint)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameStatus('playing')
  }

  const handleLetterGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') return

    const newGuessedLetters = [...guessedLetters, letter]
    setGuessedLetters(newGuessedLetters)

    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1
      setWrongGuesses(newWrongGuesses)
      
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus('lost')
      }
    } else {
      const wordLetters = currentWord.split('')
      const allLettersGuessed = wordLetters.every(wordLetter => 
        newGuessedLetters.includes(wordLetter)
      )
      
      if (allLettersGuessed) {
        setGameStatus('won')
      }
    }
  }

  const getDisplayWord = () => {
    return currentWord
      .split('')
      .map(letter => guessedLetters.includes(letter) ? letter : '_')
      .join(' ')
  }

  const getHangmanDrawing = () => {
    const parts = [
      '  ┌─────┐',
      '  │     │',
      '  │     😵',
      '  │     │',
      '  │    ╱│╲',
      '  │    ╱ ╲',
      '  │',
      '──┴──'
    ]

    const visibleParts = Math.min(wrongGuesses + 2, parts.length)
    return parts.slice(0, visibleParts).join('\n')
  }

  if (gameStatus === 'won') {
    return (
      <div className="hangman-container">
        <div className="game-complete win">
          <h2>{t('result.congratulations')}</h2>
          <p className="win-message">{t('hangman.win.message')}</p>
          <div className="final-word">
            <span className="word-reveal">{currentWord}</span>
            <span className="hint-reveal">"{currentHint}"</span>
          </div>
          <div className="celebration">
            <p>{t('hangman.perfect')}</p>
          </div>
          <button className="play-again-btn" onClick={startNewGame}>
            {t('button.new.word')}
          </button>
        </div>
      </div>
    )
  }

  if (gameStatus === 'lost') {
    return (
      <div className="hangman-container">
        <div className="game-complete lose">
          <h2>{t('result.sorry')}</h2>
          <p className="lose-message">{t('hangman.lose.message')}</p>
          <div className="hangman-final">
            <pre className="hangman-drawing">{getHangmanDrawing()}</pre>
          </div>
          <div className="final-word">
            <span className="word-reveal">{t('hangman.word.was', { word: currentWord })}</span>
            <span className="hint-reveal">"{currentHint}"</span>
          </div>
          <div className="encouragement">
            <p>{t('hangman.encouragement')}</p>
          </div>
          <button className="play-again-btn" onClick={startNewGame}>
            {t('button.try.again')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="hangman-container">
      <div className="game-header">
        <h2>🎯 {t('game.hangman.title')}</h2>
        <div className="game-stats">
          <span className="wrong-count">
            {t('hangman.errors', { current: wrongGuesses, max: maxWrongGuesses })}
          </span>
        </div>
      </div>

      <div className="game-content">
        <div className="hangman-section">
          <div className="hangman-post">
            <pre className="hangman-drawing">{getHangmanDrawing()}</pre>
          </div>
        </div>

        <div className="word-section">
          <div className="hint">
            <span className="hint-label">{t('hangman.hint.label')}</span>
            <span className="hint-text">{currentHint}</span>
          </div>
          
          <div className="word-display">
            <span className="word-letters">{getDisplayWord()}</span>
          </div>
        </div>

        <div className="alphabet-section">
          <h3>{t('hangman.choose.letter')}</h3>
          <div className="alphabet-grid">
            {alphabet.map(letter => (
              <button
                key={letter}
                className={`letter-btn ${
                  guessedLetters.includes(letter) 
                    ? currentWord.includes(letter) 
                      ? 'correct' 
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleLetterGuess(letter)}
                disabled={guessedLetters.includes(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <button className="new-word-btn" onClick={startNewGame}>
          {t('button.new.word')}
        </button>
      </div>
    </div>
  )
}

export default HangmanGame