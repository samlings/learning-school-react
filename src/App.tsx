import { useState, lazy, Suspense } from 'react'
import './App.css'
import { useLanguage } from './contexts/LanguageContext'
import LanguageSelector from './components/LanguageSelector'
import GameMenu from './components/GameMenu'
import { SEOHead } from './components/SEOHead'
import type { GameId } from './contexts/GameRegistry'

// Lazy load game components for better performance
const FVSoundGame = lazy(() => import('./components/FVSoundGame'))
const HangmanGame = lazy(() => import('./components/HangmanGame'))
const CHJSoundGame = lazy(() => import('./components/CHJSoundGame'))
const ColorsGame = lazy(() => import('./components/ColorsGame'))
const NumbersGame = lazy(() => import('./components/NumbersGame'))
const HomeObjectsGame = lazy(() => import('./components/HomeObjectsGame'))
const GeographyGame = lazy(() => import('./components/GeographyGame'))
const FamilyGame = lazy(() => import('./components/FamilyGame'))
const WordBubblesGame = lazy(() => import('./components/WordBubblesGame'))
const RacingGame = lazy(() => import('./components/RacingGame'))
const NumberBubblesGame = lazy(() => import('./components/NumberBubblesGame'))
const RocketMathGame = lazy(() => import('./components/RocketMathGame'))
const MultiplicationNinjaGame = lazy(() => import('./components/MultiplicationNinjaGame'))
const About = lazy(() => import('./components/About'))

type CurrentScreen = 'menu' | 'about' | GameId

function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('menu')
  const { t } = useLanguage()

  const handleSelectGame = (game: GameId) => {
    setCurrentScreen(game)
  }

  const handleShowAbout = () => {
    setCurrentScreen('about')
  }

  const handleBackToMenu = () => {
    setCurrentScreen('menu')
  }

  const GameLoader = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <p>{t('loading.game')}</p>
      </div>
    }>
      {children}
    </Suspense>
  )

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'about':
        return <GameLoader><About /></GameLoader>
      case 'fv-sounds':
        return <GameLoader><FVSoundGame /></GameLoader>
      case 'chj-sounds':
        return <GameLoader><CHJSoundGame /></GameLoader>
      case 'hangman':
        return <GameLoader><HangmanGame /></GameLoader>
      case 'colors':
        return <GameLoader><ColorsGame /></GameLoader>
      case 'numbers':
        return <GameLoader><NumbersGame /></GameLoader>
      case 'home-objects':
        return <GameLoader><HomeObjectsGame /></GameLoader>
      case 'geography':
        return <GameLoader><GeographyGame /></GameLoader>
      case 'family':
        return <GameLoader><FamilyGame /></GameLoader>
      case 'bubbles':
        return <GameLoader><WordBubblesGame /></GameLoader>
      case 'racing':
        return <GameLoader><RacingGame /></GameLoader>
      case 'number-bubbles':
        return <GameLoader><NumberBubblesGame /></GameLoader>
      case 'rocket-math':
        return <GameLoader><RocketMathGame /></GameLoader>
      case 'mult-ninja':
        return <GameLoader><MultiplicationNinjaGame /></GameLoader>
      default:
        return <GameMenu onSelectGame={handleSelectGame} />
    }
  }

  // Determine SEO props based on current screen
  const isGameScreen = currentScreen !== 'menu' && currentScreen !== 'about'
  const gameId = isGameScreen ? currentScreen as GameId : undefined

  return (
    <div className="app">
      {/* Dynamic SEO Head component */}
      <SEOHead 
        gameId={gameId}
        title={currentScreen === 'about' ? 'About Learning Games' : undefined}
        description={currentScreen === 'about' ? 'Learn more about our educational games platform and how it helps kids learn through interactive play.' : undefined}
      />
      
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">{t('app.title')}</h1>
            <p className="app-subtitle">{t('app.subtitle')}</p>
          </div>
          <div className="header-controls">
            <button className="about-btn" onClick={handleShowAbout}>
              {t('about.button')}
            </button>
            <LanguageSelector />
          </div>
        </div>
        {currentScreen !== 'menu' && (
          <button className="back-btn" onClick={handleBackToMenu}>
            {t('back.menu')}
          </button>
        )}
      </header>
      
      <main className="app-main">
        {renderCurrentScreen()}
      </main>
      
      <footer className="app-footer">
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  )
}

export default App
