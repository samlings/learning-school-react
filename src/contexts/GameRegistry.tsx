import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

// Game registry types
export type GameId = 'fv-sounds' | 'chj-sounds' | 'hangman' | 'colors' | 'numbers' | 'home-objects' | 'geography' | 'family' | 'bubbles' | 'racing' | 'number-bubbles'

export interface GameFeature {
  key: string
  icon: string
  translationKey: string
}

export interface GameMetadata {
  id: GameId
  titleKey: string
  descriptionKey: string
  category: 'sounds' | 'english' | 'words' | 'geography' | 'family' | 'interactive'
  difficulty: 'easy' | 'medium' | 'hard'
  features: GameFeature[]
  chunkSize?: number // Estimated chunk size in KB for performance monitoring
}

const gameRegistry: Record<GameId, GameMetadata> = {
  'fv-sounds': {
    id: 'fv-sounds',
    titleKey: 'game.fv.title',
    descriptionKey: 'game.fv.description',
    category: 'sounds',
    difficulty: 'easy',
    features: [
      { key: 'audio', icon: '🔊', translationKey: 'feature.audio' },
      { key: 'images', icon: '🖼️', translationKey: 'feature.images' },
      { key: 'easy', icon: '⭐', translationKey: 'feature.easy' }
    ],
    chunkSize: 25
  },
  'chj-sounds': {
    id: 'chj-sounds',
    titleKey: 'game.chj.title',
    descriptionKey: 'game.chj.description',
    category: 'sounds',
    difficulty: 'easy',
    features: [
      { key: 'audio', icon: '🔊', translationKey: 'feature.audio' },
      { key: 'images', icon: '🖼️', translationKey: 'feature.images' },
      { key: 'easy', icon: '⭐', translationKey: 'feature.easy' }
    ],
    chunkSize: 25
  },
  'hangman': {
    id: 'hangman',
    titleKey: 'game.hangman.title',
    descriptionKey: 'game.hangman.description',
    category: 'words',
    difficulty: 'medium',
    features: [
      { key: 'alphabet', icon: '🔤', translationKey: 'feature.alphabet' },
      { key: 'drawing', icon: '🎨', translationKey: 'feature.drawing' },
      { key: 'medium', icon: '⭐⭐', translationKey: 'feature.medium' }
    ],
    chunkSize: 30
  },
  'colors': {
    id: 'colors',
    titleKey: 'game.colors.title',
    descriptionKey: 'game.colors.description',
    category: 'english',
    difficulty: 'easy',
    features: [
      { key: 'colors', icon: '🎨', translationKey: 'feature.colors' },
      { key: 'english', icon: '🇬🇧', translationKey: 'feature.english' },
      { key: 'easy', icon: '⭐', translationKey: 'feature.easy' }
    ],
    chunkSize: 20
  },
  'numbers': {
    id: 'numbers',
    titleKey: 'game.numbers.title',
    descriptionKey: 'game.numbers.description',
    category: 'english',
    difficulty: 'easy',
    features: [
      { key: 'numbers', icon: '🔢', translationKey: 'feature.numbers' },
      { key: 'english', icon: '🇬🇧', translationKey: 'feature.english' },
      { key: 'easy', icon: '⭐', translationKey: 'feature.easy' }
    ],
    chunkSize: 18
  },
  'home-objects': {
    id: 'home-objects',
    titleKey: 'game.home.title',
    descriptionKey: 'game.home.description',
    category: 'english',
    difficulty: 'easy',
    features: [
      { key: 'home', icon: '🏠', translationKey: 'feature.home' },
      { key: 'english', icon: '🇬🇧', translationKey: 'feature.english' },
      { key: 'images', icon: '🖼️', translationKey: 'feature.images' }
    ],
    chunkSize: 22
  },
  'geography': {
    id: 'geography',
    titleKey: 'game.geography.title',
    descriptionKey: 'game.geography.description',
    category: 'geography',
    difficulty: 'medium',
    features: [
      { key: 'geography', icon: '🌍', translationKey: 'feature.geography' },
      { key: 'world', icon: '🗺️', translationKey: 'feature.world' },
      { key: 'medium', icon: '⭐⭐', translationKey: 'feature.medium' }
    ],
    chunkSize: 35
  },
  'family': {
    id: 'family',
    titleKey: 'game.family.title',
    descriptionKey: 'game.family.description',
    category: 'family',
    difficulty: 'easy',
    features: [
      { key: 'family', icon: '👨‍👩‍👧‍👦', translationKey: 'feature.family' },
      { key: 'english', icon: '🇬🇧', translationKey: 'feature.english' },
      { key: 'images', icon: '🖼️', translationKey: 'feature.images' }
    ],
    chunkSize: 20
  },
  'bubbles': {
    id: 'bubbles',
    titleKey: 'game.bubbles.title',
    descriptionKey: 'game.bubbles.description',
    category: 'interactive',
    difficulty: 'medium',
    features: [
      { key: 'interactive', icon: '🎮', translationKey: 'feature.interactive' },
      { key: 'bubbles', icon: '💭', translationKey: 'feature.bubbles' },
      { key: 'letters', icon: '🔤', translationKey: 'feature.letters' }
    ],
    chunkSize: 40
  },
  'racing': {
    id: 'racing',
    titleKey: 'game.racing.title',
    descriptionKey: 'game.racing.description',
    category: 'interactive',
    difficulty: 'medium',
    features: [
      { key: 'typing', icon: '⌨️', translationKey: 'feature.typing' },
      { key: 'speed', icon: '⚡', translationKey: 'feature.speed' },
      { key: 'letters', icon: '🔤', translationKey: 'feature.letters' }
    ],
    chunkSize: 45
  },
  'number-bubbles': {
    id: 'number-bubbles',
    titleKey: 'game.number.bubbles.title',
    descriptionKey: 'game.number.bubbles.description',
    category: 'english',
    difficulty: 'hard',
    features: [
      { key: 'numbers', icon: '🔢', translationKey: 'feature.numbers' },
      { key: 'interactive', icon: '🎮', translationKey: 'feature.interactive' },
      { key: 'hard', icon: '⭐⭐⭐', translationKey: 'feature.hard' }
    ],
    chunkSize: 50
  }
}

interface GameRegistryContextType {
  games: Record<GameId, GameMetadata>
  getGameById: (id: GameId) => GameMetadata | undefined
  getGamesByCategory: (category: GameMetadata['category']) => GameMetadata[]
  getGamesByDifficulty: (difficulty: GameMetadata['difficulty']) => GameMetadata[]
  getAllGameIds: () => GameId[]
  getTotalEstimatedSize: () => number
  getCategoryGames: () => Record<string, GameMetadata[]>
}

const GameRegistryContext = createContext<GameRegistryContextType | undefined>(undefined)

interface GameRegistryProviderProps {
  children: ReactNode
}

export const GameRegistryProvider: React.FC<GameRegistryProviderProps> = ({ children }) => {
  const getGameById = (id: GameId): GameMetadata | undefined => {
    return gameRegistry[id]
  }

  const getGamesByCategory = (category: GameMetadata['category']): GameMetadata[] => {
    return Object.values(gameRegistry).filter(game => game.category === category)
  }

  const getGamesByDifficulty = (difficulty: GameMetadata['difficulty']): GameMetadata[] => {
    return Object.values(gameRegistry).filter(game => game.difficulty === difficulty)
  }

  const getAllGameIds = (): GameId[] => {
    return Object.keys(gameRegistry) as GameId[]
  }

  const getTotalEstimatedSize = (): number => {
    return Object.values(gameRegistry).reduce((total, game) => total + (game.chunkSize || 30), 0)
  }

  const getCategoryGames = (): Record<string, GameMetadata[]> => {
    const categories: Record<string, GameMetadata[]> = {}
    Object.values(gameRegistry).forEach(game => {
      if (!categories[game.category]) {
        categories[game.category] = []
      }
      categories[game.category].push(game)
    })
    return categories
  }

  return (
    <GameRegistryContext.Provider value={{
      games: gameRegistry,
      getGameById,
      getGamesByCategory,
      getGamesByDifficulty,
      getAllGameIds,
      getTotalEstimatedSize,
      getCategoryGames
    }}>
      {children}
    </GameRegistryContext.Provider>
  )
}

export const useGameRegistry = (): GameRegistryContextType => {
  const context = useContext(GameRegistryContext)
  if (!context) {
    throw new Error('useGameRegistry must be used within a GameRegistryProvider')
  }
  return context
}