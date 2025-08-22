import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useGameRegistry } from '../contexts/GameRegistry'
import './GameFilter.css'

interface FilterState {
  categories: string[]
  difficulties: string[]
  features: string[]
}

interface GameFilterProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  filteredCount: number
  totalCount: number
}

const GameFilter: React.FC<GameFilterProps> = ({
  filters,
  onFiltersChange,
  filteredCount,
  totalCount
}) => {
  const { t } = useLanguage()
  const { games } = useGameRegistry()
  const [isExpanded, setIsExpanded] = React.useState(false)

  // Get all unique categories, difficulties, and features from games
  const allCategories = Array.from(new Set(Object.values(games).map(game => game.category)))
  const allDifficulties = Array.from(new Set(Object.values(games).map(game => game.difficulty)))
  const allFeatures = Array.from(new Set(
    Object.values(games).flatMap(game => game.features.map(f => f.key))
  ))

  const toggleFilter = (type: keyof FilterState, value: string) => {
    const currentValues = filters[type]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    onFiltersChange({
      ...filters,
      [type]: newValues
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      difficulties: [],
      features: []
    })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.difficulties.length > 0 || 
                          filters.features.length > 0

  return (
    <div className={`game-filter ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="filter-header-left">
          <h3>{t('filter.title')}</h3>
          <div className="filter-results">
            {filteredCount} {t('filter.of')} {totalCount} {t('filter.games')}
          </div>
        </div>
        <div className="filter-header-right">
          {hasActiveFilters && (
            <button 
              className="clear-filters-btn" 
              onClick={(e) => {
                e.stopPropagation()
                clearAllFilters()
              }}
            >
              {t('filter.clear')}
            </button>
          )}
          <button className="expand-toggle-btn">
            <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
            <span className="expand-text">
              {isExpanded ? t('filter.collapse') : t('filter.expand')}
            </span>
          </button>
        </div>
      </div>

      <div className={`filter-sections ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Categories */}
        <div className="filter-section">
          <h4>{t('filter.category')}</h4>
          <div className="filter-options">
            {allCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filters.categories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleFilter('categories', category)}
              >
                {t(`category.${category}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulties */}
        <div className="filter-section">
          <h4>{t('filter.difficulty')}</h4>
          <div className="filter-options">
            {allDifficulties.map(difficulty => (
              <button
                key={difficulty}
                className={`filter-btn ${filters.difficulties.includes(difficulty) ? 'active' : ''}`}
                onClick={() => toggleFilter('difficulties', difficulty)}
              >
                {t(`difficulty.${difficulty}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="filter-section">
          <h4>{t('filter.features')}</h4>
          <div className="filter-options features-grid">
            {allFeatures.map(feature => (
              <button
                key={feature}
                className={`filter-btn ${filters.features.includes(feature) ? 'active' : ''}`}
                onClick={() => toggleFilter('features', feature)}
              >
                {t(`feature.${feature}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameFilter