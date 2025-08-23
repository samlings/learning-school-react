import React, { useState, useMemo } from 'react'
import './GameMenu.css'
import { useLanguage } from '../contexts/LanguageContext'
import { useGameRegistry } from '../contexts/GameRegistry'
import type { GameId, GameMetadata } from '../contexts/GameRegistry'
import GameFilter from './GameFilter'

interface FilterState {
  categories: string[]
  difficulties: string[]
  features: string[]
}

interface GameMenuProps {
  onSelectGame: (game: GameId) => void
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const { t } = useLanguage()
  const { games } = useGameRegistry()
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    difficulties: [],
    features: []
  })

  // Game icon mapping
  const gameIcons: Record<GameId, string> = {
    'fv-sounds': '🔤',
    'chj-sounds': '🎵',
    'hangman': '🎯',
    'colors': '🌈',
    'numbers': '🔢',
    'home-objects': '🏠',
    'geography': '🌍',
    'family': '👨‍👩‍👧‍👦',
    'bubbles': '💭',
    'racing': '🚗',
    'number-bubbles': '🫧',
    'rocket-math': '🚀',
    'mult-ninja': '🥷',
    'fish-math': '🐟'
  }

  // English games that should show the UK flag
  const englishGames: GameId[] = ['colors', 'numbers', 'home-objects', 'family']

  // Filter games based on selected filters
  const filteredGames = useMemo(() => {
    const gameList = Object.values(games)
    
    if (filters.categories.length === 0 && 
        filters.difficulties.length === 0 && 
        filters.features.length === 0) {
      return gameList
    }

    return gameList.filter(game => {
      const matchesCategory = filters.categories.length === 0 || 
                             filters.categories.includes(game.category)
      
      const matchesDifficulty = filters.difficulties.length === 0 || 
                               filters.difficulties.includes(game.difficulty)
      
      const matchesFeatures = filters.features.length === 0 || 
                             filters.features.some(feature => 
                               game.features.some(gameFeature => gameFeature.key === feature)
                             )
      
      return matchesCategory && matchesDifficulty && matchesFeatures
    })
  }, [games, filters])

  const renderGameCard = (game: GameMetadata) => (
    <div key={game.id} className="game-card" onClick={() => onSelectGame(game.id)}>
      {englishGames.includes(game.id) && (
        <div className="uk-flag-indicator">🇬🇧</div>
      )}
      <div className="game-icon">{gameIcons[game.id]}</div>
      <h3>{t(game.titleKey)}</h3>
      <p>{t(game.descriptionKey)}</p>
      <div className="game-features">
        {game.features.map((feature, index) => (
          <span key={index}>{t(feature.translationKey)}</span>
        ))}
      </div>
      <button className="play-btn">
        {t('button.play')}
      </button>
    </div>
  )

  return (
    <div className="game-menu">
      <div className="menu-header">
        <h2>{t('menu.title')}</h2>
        <p>{t('menu.subtitle')}</p>
      </div>

      <GameFilter
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredGames.length}
        totalCount={Object.keys(games).length}
      />

      <div className="game-options">
        {filteredGames.length > 0 ? (
          filteredGames.map(renderGameCard)
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>{t('filter.no.results')}</h3>
            <p>{t('filter.no.results.suggestion')}</p>
          </div>
        )}
      </div>

      <div className="menu-footer">
        <p>{t('menu.tip')}</p>
      </div>
    </div>
  )
}

export default GameMenu