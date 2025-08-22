import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { GameTranslationProvider } from './contexts/GameTranslations'
import { GameRegistryProvider } from './contexts/GameRegistry'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameRegistryProvider>
      <LanguageProvider>
        <GameTranslationProvider>
          <App />
          <Analytics />
        </GameTranslationProvider>
      </LanguageProvider>
    </GameRegistryProvider>
  </StrictMode>,
)
