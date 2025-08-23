# Learning App - Development Guidelines

## Translation System Requirements

**CRITICAL**: All new features MUST respect the translation system. NO hardcoded labels are allowed.

### Translation Rules:
1. **All user-facing text must use translation keys** with `t('key.name')`
2. **Add new keys to ALL language sections** in `src/contexts/LanguageContext.tsx`:
   - `pt` (Portuguese) - primary language
   - `es` (Spanish)
   - `fr` (French) 
   - `en` (English)
   - `it` (Italian)
3. **Never hardcode text** in JSX - always use `{t('translation.key')}`
4. **Check existing translations** before adding new keys to avoid duplicates

### Translation File Location:
- `src/contexts/LanguageContext.tsx` - Contains all translations

### Example:
```tsx
// ❌ Wrong - hardcoded text
<button>Start Game</button>

// ✅ Correct - using translation
<button>{t('button.start.game')}</button>
```

## Project Structure
- **Components**: `src/components/` - All game components
- **Contexts**: `src/contexts/` - Language context, game translations, and registry
- **Games Available**: FV Sounds, CHJ Sounds, Hangman, Colors, Numbers, Home Objects, Geography, Family, Word Bubbles, Racing

## Performance Requirements

**CRITICAL**: The app is optimized for scaling to hundreds of games. ALL new features MUST follow performance guidelines.

### Performance Rules:
1. **All new game components MUST be lazy loaded** using `React.lazy()`
2. **Add games to the lazy import pattern** in `src/App.tsx`
3. **Use Suspense boundaries** - wrap games with `<GameLoader>` component
4. **Register new games** in `src/contexts/GameRegistry.tsx` with metadata
5. **Add game translations** to `src/contexts/GameTranslations.tsx`
6. **Keep components modular** - avoid importing heavy dependencies in main bundle

### Adding New Games:
```tsx
// 1. Create lazy import in App.tsx
const NewGame = lazy(() => import('./components/NewGame'))

// 2. Add to renderCurrentScreen switch
case 'new-game':
  return <GameLoader><NewGame /></GameLoader>

// 3. Register in GameRegistry.tsx
'new-game': {
  id: 'new-game',
  titleKey: 'game.new.title',
  descriptionKey: 'game.new.description',
  category: 'interactive',
  difficulty: 'medium',
  features: [...],
  chunkSize: 25 // Estimated KB for monitoring
}

// 4. Add translations in GameTranslations.tsx
'new-game': {
  pt: { 'game.title': '...' },
  es: { 'game.title': '...' },
  fr: { 'game.title': '...' },
  en: { 'game.title': '...' },
  it: { 'game.title': '...' }
}
```

### Performance Monitoring:
- **Target chunk size**: 3-6KB per game (1-2KB gzipped)
- **Initial bundle**: Keep under 250KB
- **Monitor with**: `npm run build` - check chunk sizes
- **Memory usage**: Should scale with usage, not total games

### Architecture Components:
- `GameRegistry` - Game metadata and categorization
- `GameTranslations` - Lazy-loaded game-specific translations  
- `LanguageContext` - Core app translations
- `React.lazy()` - Component-level code splitting
- `Suspense` - Loading states for better UX

## Game Filtering System

**CRITICAL**: When adding new games, carefully consider filtering to maintain a clean, organized user experience.

### Filter Categories (USE EXISTING ONES):
- **sounds**: Sound-based learning games (F/V sounds, CH/J sounds)
- **english**: English vocabulary games (colors, numbers, home objects, family)
- **words**: Word/text-based games (hangman, word puzzles)
- **geography**: Location/world knowledge games
- **family**: Family-related content games
- **interactive**: Action/coordination games (bubbles, racing)

### Filter Difficulties (USE EXISTING ONES):
- **easy**: Simple games for beginners (⭐)
- **medium**: Moderate challenge games (⭐⭐)
- **hard**: Advanced games (⭐⭐⭐)

### Filter Features - Use Existing When Possible:
**Existing Features** (prefer these):
- `audio`: Games with sound/audio elements
- `images`: Games with visual/image elements  
- `easy`, `medium`, `hard`: Difficulty indicators
- `alphabet`, `letters`: Letter/alphabet learning
- `drawing`: Games involving drawing/sketching
- `colors`: Color-based games
- `english`: English language learning
- `numbers`: Number/math-based games
- `home`: Home/household items
- `geography`, `world`: Geography/world knowledge
- `family`: Family-related content
- `interactive`: Interactive/action games
- `bubbles`: Bubble-popping mechanics
- `typing`: Keyboard/typing games
- `speed`: Fast-paced/timed games

### Adding New Filters - ONLY IF NECESSARY:
**⚠️ WARNING**: Only add new categories/features if the game is genuinely different from existing types.

**Before adding new filters, ask:**
1. Does this game fit into an existing category?
2. Can existing features describe this game?
3. Will this filter be useful for users to find similar games?
4. Are there at least 2-3 games that would use this new filter?

**If you MUST add new filters:**
1. **Add translations** to ALL 5 languages in `LanguageContext.tsx`
2. **Use descriptive, clear names** with emojis for visual appeal
3. **Update this documentation** with the new filter and rationale

### Filter Design Principles:
- **Keep minimal**: Fewer filters = better user experience
- **Be descriptive**: Users should understand what each filter means
- **Group related**: Similar games should share filters
- **Consider scalability**: Will this filter still make sense with 100+ games?

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build and analyze bundle sizes
- Check for linting/typecheck commands in package.json before committing

## Code Style
- Follow existing patterns in the codebase
- Use TypeScript consistently
- Maintain component structure similar to existing games