import React from 'react'
import { useGameRegistry } from '../contexts/GameRegistry'
import { useLanguage } from '../contexts/LanguageContext'
import type { GameId } from '../contexts/GameRegistry'

interface SEOHeadProps {
  gameId?: GameId
  title?: string
  description?: string
  keywords?: string[]
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  gameId, 
  title: customTitle, 
  description: customDescription, 
  keywords: customKeywords = [] 
}) => {
  const { getGameById } = useGameRegistry()
  const { t, language } = useLanguage()

  // Get game-specific data if gameId is provided
  const game = gameId ? getGameById(gameId) : undefined
  
  // Build title
  const baseTitle = "Play & Study"
  let pageTitle = baseTitle
  
  if (customTitle) {
    pageTitle = `${customTitle} | ${baseTitle}`
  } else if (game) {
    const gameTitle = t(game.titleKey)
    pageTitle = `${gameTitle} | ${baseTitle}`
  }

  // Build description
  let description = "Interactive educational games for kids featuring sound games, vocabulary learning, hangman, geography, and more. Available in English, Portuguese, Spanish, and French."
  
  if (customDescription) {
    description = customDescription
  } else if (game) {
    const gameDescription = t(game.descriptionKey)
    const categoryName = t(`category.${game.category}`)
    const difficultyName = t(`difficulty.${game.difficulty}`)
    description = `${gameDescription} Category: ${categoryName}. Difficulty: ${difficultyName}. Interactive educational game available in multiple languages.`
  }

  // Build keywords
  const baseKeywords = [
    "educational games", "kids games", "learning games", "language learning", 
    "multilingual games", language === 'pt' ? 'jogos educativos' : '',
    language === 'es' ? 'juegos educativos' : '',
    language === 'fr' ? 'jeux éducatifs' : ''
  ].filter(Boolean)

  if (game) {
    // Add game-specific keywords
    const gameKeywords = [
      t(game.titleKey).toLowerCase(),
      t(`category.${game.category}`).toLowerCase(),
      t(`difficulty.${game.difficulty}`).toLowerCase(),
      ...game.features.map(feature => t(feature.translationKey).toLowerCase())
    ]
    baseKeywords.push(...gameKeywords)
  }

  const allKeywords = [...baseKeywords, ...customKeywords].join(', ')

  // Build canonical URL
  const baseUrl = 'https://joga-aprende.vercel.app'
  let canonicalUrl = baseUrl
  
  if (gameId) {
    canonicalUrl = `${baseUrl}/game/${gameId}`
  }
  
  if (language !== 'en') {
    canonicalUrl += `?lang=${language}`
  }

  // Create structured data for games using useMemo to avoid re-creation on every render
  const structuredData = React.useMemo(() => game ? {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": t(game.titleKey),
    "description": t(game.descriptionKey),
    "genre": t(`category.${game.category}`),
    "educationalLevel": t(`difficulty.${game.difficulty}`),
    "inLanguage": [
      { "@type": "Language", "name": "English", "alternateName": "en" },
      { "@type": "Language", "name": "Portuguese", "alternateName": "pt" },
      { "@type": "Language", "name": "Spanish", "alternateName": "es" },
      { "@type": "Language", "name": "French", "alternateName": "fr" }
    ],
    "isAccessibleForFree": true,
    "educationalUse": "learning",
    "interactivityType": "active",
    "learningResourceType": "game",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Play & Study",
      "url": baseUrl
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Play & Study",
    "description": "Interactive educational games for kids and language learning",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "web browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "inLanguage": ["en", "pt", "es", "fr"],
    "publisher": {
      "@type": "Organization",
      "name": "Play & Study",
      "url": baseUrl
    }
  }, [game, t, baseUrl])

  React.useEffect(() => {
    // Update document title
    document.title = pageTitle

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (metaDescription) {
      metaDescription.content = description
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
    if (metaKeywords) {
      metaKeywords.content = allKeywords
    }

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl
    }

    // Update Open Graph tags
    const updateMetaProperty = (property: string, content: string) => {
      const metaTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (metaTag) {
        metaTag.content = content
      }
    }

    updateMetaProperty('og:title', pageTitle)
    updateMetaProperty('og:description', description)
    updateMetaProperty('og:url', canonicalUrl)
    updateMetaProperty('twitter:title', pageTitle)
    updateMetaProperty('twitter:description', description)
    updateMetaProperty('twitter:url', canonicalUrl)

    // Update or create structured data
    const structuredDataScript = document.querySelector('script[type="application/ld+json"]')
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData)
    } else {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // Update language in html tag
    document.documentElement.lang = language

  }, [pageTitle, description, allKeywords, canonicalUrl, language, structuredData])

  return null // This component doesn't render anything visually
}