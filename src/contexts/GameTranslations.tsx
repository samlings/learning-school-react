import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

// Game translation types
type GameId = 'fv-sounds' | 'chj-sounds' | 'hangman' | 'colors' | 'numbers' | 'home-objects' | 'geography' | 'family' | 'bubbles' | 'racing'
type Language = 'pt' | 'es' | 'fr' | 'en' | 'it'

interface GameTranslations {
  [key: string]: string
}

interface GameTranslationCache {
  [gameId: string]: {
    [language: string]: GameTranslations
  }
}

interface GameTranslationContextType {
  loadGameTranslations: (gameId: GameId, language: Language) => Promise<GameTranslations>
  getGameTranslation: (gameId: GameId, language: Language, key: string) => string | null
  clearCache: () => void
}

const GameTranslationContext = createContext<GameTranslationContextType | undefined>(undefined)

// Game-specific translations split by game for better performance
const gameTranslations: Record<GameId, Record<Language, GameTranslations>> = {
  'fv-sounds': {
    pt: {
      'game.title': 'Sons F e V',
      'game.description': 'Aprende a distinguir os sons F e V através de imagens e palavras',
      'question.sound': 'Esta palavra começa com que som?',
      'result.incorrect': '❌ Ops! A resposta certa é "{answer}"',
      'score.final': 'Acertaste {score} de {total} palavras!',
      'feature.example.faca': 'como "Faca"',
      'feature.example.vaca': 'como "Vaca"'
    },
    es: {
      'game.title': 'Sonidos F y V',
      'game.description': 'Aprende a distinguir los sonidos F y V a través de imágenes y palabras',
      'question.sound': '¿Con qué sonido empieza esta palabra?',
      'result.incorrect': '❌ ¡Ups! La respuesta correcta es "{answer}"',
      'score.final': '¡Acertaste {score} de {total} palabras!',
      'feature.example.faca': 'como "Faca"',
      'feature.example.vaca': 'como "Vaca"'
    },
    fr: {
      'game.title': 'Sons F et V',
      'game.description': 'Apprends à distinguer les sons F et V à travers des images et des mots',
      'question.sound': 'Par quel son commence ce mot ?',
      'result.incorrect': '❌ Oups ! La bonne réponse est "{answer}"',
      'score.final': 'Tu as eu {score} sur {total} mots !',
      'feature.example.faca': 'comme "Faca"',
      'feature.example.vaca': 'comme "Vaca"'
    },
    en: {
      'game.title': 'F and V Sounds',
      'game.description': 'Learn to distinguish F and V sounds through images and words',
      'question.sound': 'What sound does this word start with?',
      'result.incorrect': '❌ Oops! The correct answer is "{answer}"',
      'score.final': 'You got {score} out of {total} words!',
      'feature.example.faca': 'like "Faca"',
      'feature.example.vaca': 'like "Vaca"'
    },
    it: {
      'game.title': 'Suoni F e V',
      'game.description': 'Impara a distinguere i suoni F e V attraverso immagini e parole',
      'question.sound': 'Con che suono inizia questa parola?',
      'result.incorrect': '❌ Ops! La risposta corretta è "{answer}"',
      'score.final': 'Hai indovinato {score} su {total} parole!',
      'feature.example.faca': 'come "Faca"',
      'feature.example.vaca': 'come "Vaca"'
    }
  },
  'chj-sounds': {
    pt: {
      'game.title': 'Sons CH e J',
      'game.description': 'Aprende a distinguir os sons CH e J através de imagens e palavras',
      'question.sound': 'Esta palavra começa com que som?',
      'result.incorrect': '❌ Ops! A resposta certa é "{answer}"',
      'score.final': 'Acertaste {score} de {total} palavras!',
      'feature.example.chave': 'como "Chave"',
      'feature.example.jarro': 'como "Jarro"'
    },
    es: {
      'game.title': 'Sonidos CH y J',
      'game.description': 'Aprende a distinguir los sonidos CH y J a través de imágenes y palabras',
      'question.sound': '¿Con qué sonido empieza esta palabra?',
      'result.incorrect': '❌ ¡Ups! La respuesta correcta es "{answer}"',
      'score.final': '¡Acertaste {score} de {total} palabras!',
      'feature.example.chave': 'como "Chave"',
      'feature.example.jarro': 'como "Jarro"'
    },
    fr: {
      'game.title': 'Sons CH et J',
      'game.description': 'Apprends à distinguer les sons CH et J à travers des images et des mots',
      'question.sound': 'Par quel son commence ce mot ?',
      'result.incorrect': '❌ Oups ! La bonne réponse est "{answer}"',
      'score.final': 'Tu as eu {score} sur {total} mots !',
      'feature.example.chave': 'comme "Chave"',
      'feature.example.jarro': 'comme "Jarro"'
    },
    en: {
      'game.title': 'CH and J Sounds',
      'game.description': 'Learn to distinguish CH and J sounds through images and words',
      'question.sound': 'What sound does this word start with?',
      'result.incorrect': '❌ Oops! The correct answer is "{answer}"',
      'score.final': 'You got {score} out of {total} words!',
      'feature.example.chave': 'like "Chave"',
      'feature.example.jarro': 'like "Jarro"'
    },
    it: {
      'game.title': 'Suoni CH e J',
      'game.description': 'Impara a distinguere i suoni CH e J attraverso immagini e parole',
      'question.sound': 'Con che suono inizia questa parola?',
      'result.incorrect': '❌ Ops! La risposta corretta è "{answer}"',
      'score.final': 'Hai indovinato {score} su {total} parole!',
      'feature.example.chave': 'come "Chave"',
      'feature.example.jarro': 'come "Jarro"'
    }
  },
  'hangman': {
    pt: {
      'game.title': 'Jogo da Forca',
      'game.description': 'Descobre a palavra secreta letra por letra antes que o boneco seja desenhado',
      'errors': 'Erros: {current}/{max}',
      'hint.label': 'Dica:',
      'choose.letter': 'Escolhe uma letra:',
      'win.message': 'Conseguiste descobrir a palavra!',
      'lose.message': 'Não conseguiste desta vez...',
      'word.was': 'A palavra era: {word}',
      'perfect': 'És fantástico!',
      'encouragement': 'Não desistas! Tenta outra vez!'
    },
    es: {
      'game.title': 'Juego del Ahorcado',
      'game.description': 'Descubre la palabra secreta letra por letra antes de que se dibuje el muñeco',
      'errors': 'Errores: {current}/{max}',
      'hint.label': 'Pista:',
      'choose.letter': 'Elige una letra:',
      'win.message': '¡Conseguiste descubrir la palabra!',
      'lose.message': 'No lo conseguiste esta vez...',
      'word.was': 'La palabra era: {word}',
      'perfect': '¡Eres fantástico!',
      'encouragement': '¡No te rindas! ¡Inténtalo otra vez!'
    },
    fr: {
      'game.title': 'Jeu du Pendu',
      'game.description': 'Découvre le mot secret lettre par lettre avant que le bonhomme soit dessiné',
      'errors': 'Erreurs : {current}/{max}',
      'hint.label': 'Indice :',
      'choose.letter': 'Choisis une lettre :',
      'win.message': 'Tu as réussi à découvrir le mot !',
      'lose.message': 'Tu n\'as pas réussi cette fois...',
      'word.was': 'Le mot était : {word}',
      'perfect': 'Tu es fantastique !',
      'encouragement': 'N\'abandonne pas ! Essaie encore !'
    },
    en: {
      'game.title': 'Hangman Game',
      'game.description': 'Discover the secret word letter by letter before the drawing is completed',
      'errors': 'Errors: {current}/{max}',
      'hint.label': 'Hint:',
      'choose.letter': 'Choose a letter:',
      'win.message': 'You managed to discover the word!',
      'lose.message': 'You didn\'t make it this time...',
      'word.was': 'The word was: {word}',
      'perfect': 'You are fantastic!',
      'encouragement': 'Don\'t give up! Try again!'
    },
    it: {
      'game.title': 'Gioco dell\'Impiccato',
      'game.description': 'Scopri la parola segreta lettera per lettera prima che il disegno sia completato',
      'errors': 'Errori: {current}/{max}',
      'hint.label': 'Suggerimento:',
      'choose.letter': 'Scegli una lettera:',
      'win.message': 'Sei riuscito a scoprire la parola!',
      'lose.message': 'Non ce l\'hai fatta questa volta...',
      'word.was': 'La parola era: {word}',
      'perfect': 'Sei fantastico!',
      'encouragement': 'Non arrenderti! Riprova!'
    }
  },
  'colors': {
    pt: {
      'game.title': 'Cores em Inglês',
      'game.description': 'Aprende as cores em inglês através de imagens coloridas e divertidas',
      'question.english': 'Como se diz esta cor em inglês?',
      'result.incorrect.translation': '❌ Ops! "{portuguese}" é "{english}" em inglês',
      'result.correct.translation': '✅ Correto! "{portuguese}" é "{english}" em inglês!',
      'score.final': 'Acertaste {score} de {total} cores!'
    },
    es: {
      'game.title': 'Colores en Inglés',
      'game.description': 'Aprende los colores en inglés a través de imágenes coloridas y divertidas',
      'question.english': '¿Cómo se dice este color en inglés?',
      'result.incorrect.translation': '❌ ¡Ups! "{portuguese}" es "{english}" en inglés',
      'result.correct.translation': '✅ ¡Correcto! "{portuguese}" es "{english}" en inglés!',
      'score.final': '¡Acertaste {score} de {total} colores!'
    },
    fr: {
      'game.title': 'Couleurs en Anglais',
      'game.description': 'Apprends les couleurs en anglais à travers des images colorées et amusantes',
      'question.english': 'Comment dit-on cette couleur en anglais ?',
      'result.incorrect.translation': '❌ Oups ! "{portuguese}" se dit "{english}" en anglais',
      'result.correct.translation': '✅ Correct ! "{portuguese}" se dit "{english}" en anglais !',
      'score.final': 'Tu as eu {score} sur {total} couleurs !'
    },
    en: {
      'game.title': 'Colors in English',
      'game.description': 'Learn colors in English through colorful and fun images',
      'question.english': 'How do you say this color in English?',
      'result.incorrect.translation': '❌ Oops! "{portuguese}" is "{english}" in English',
      'result.correct.translation': '✅ Correct! "{portuguese}" is "{english}" in English!',
      'score.final': 'You got {score} out of {total} colors!'
    },
    it: {
      'game.title': 'Colori in Inglese',
      'game.description': 'Impara i colori in inglese attraverso immagini colorate e divertenti',
      'question.english': 'Come si dice questo colore in inglese?',
      'result.incorrect.translation': '❌ Ops! "{portuguese}" è "{english}" in inglese',
      'result.correct.translation': '✅ Corretto! "{portuguese}" è "{english}" in inglese!',
      'score.final': 'Hai indovinato {score} su {total} colori!'
    }
  },
  'numbers': {
    pt: {
      'game.title': 'Números em Inglês',
      'game.description': 'Aprende os números de 1 a 10 em inglês de forma divertida',
      'question.english': 'Como se diz este número em inglês?',
      'score.final': 'Acertaste {score} de {total} números!'
    },
    es: {
      'game.title': 'Números en Inglés',
      'game.description': 'Aprende los números del 1 al 10 en inglés de forma divertida',
      'question.english': '¿Cómo se dice este número en inglés?',
      'score.final': '¡Acertaste {score} de {total} números!'
    },
    fr: {
      'game.title': 'Nombres en Anglais',
      'game.description': 'Apprends les nombres de 1 à 10 en anglais de manière amusante',
      'question.english': 'Comment dit-on ce nombre en anglais ?',
      'score.final': 'Tu as eu {score} sur {total} nombres !'
    },
    en: {
      'game.title': 'Numbers in English',
      'game.description': 'Learn numbers 1 to 10 in English in a fun way',
      'question.english': 'How do you say this number in English?',
      'score.final': 'You got {score} out of {total} numbers!'
    },
    it: {
      'game.title': 'Numeri in Inglese',
      'game.description': 'Impara i numeri da 1 a 10 in inglese in modo divertente',
      'question.english': 'Come si dice questo numero in inglese?',
      'score.final': 'Hai indovinato {score} su {total} numeri!'
    }
  },
  'home-objects': {
    pt: {
      'game.title': 'Objetos da Casa',
      'game.description': 'Aprende o nome dos objetos da casa em inglês',
      'question.english': 'Como se diz este objeto em inglês?',
      'score.final': 'Acertaste {score} de {total} objetos!'
    },
    es: {
      'game.title': 'Objetos de la Casa',
      'game.description': 'Aprende el nombre de los objetos de la casa en inglés',
      'question.english': '¿Cómo se dice este objeto en inglês?',
      'score.final': '¡Acertaste {score} de {total} objetos!'
    },
    fr: {
      'game.title': 'Objets de la Maison',
      'game.description': 'Apprends le nom des objets de la maison en anglais',
      'question.english': 'Comment dit-on cet objet en anglais ?',
      'score.final': 'Tu as eu {score} sur {total} objets !'
    },
    en: {
      'game.title': 'Home Objects',
      'game.description': 'Learn the names of home objects in English',
      'question.english': 'How do you say this object in English?',
      'score.final': 'You got {score} out of {total} objects!'
    },
    it: {
      'game.title': 'Oggetti di Casa',
      'game.description': 'Impara i nomi degli oggetti di casa in inglese',
      'question.english': 'Come si dice questo oggetto in inglese?',
      'score.final': 'Hai indovinato {score} su {total} oggetti!'
    }
  },
  'geography': {
    pt: {
      'game.title': 'Quiz de Geografia',
      'game.description': 'Descobre países, capitais e bandeiras do mundo inteiro',
      'question.country': 'Qual é a capital deste país?',
      'question.flag': 'De que país é esta bandeira?',
      'question.capital': 'Qual país tem esta capital?',
      'score.final': 'Acertaste {score} de {total} perguntas de geografia!'
    },
    es: {
      'game.title': 'Quiz de Geografía',
      'game.description': 'Descubre países, capitales y banderas de todo el mundo',
      'question.country': '¿Cuál es la capital de este país?',
      'question.flag': '¿De qué país es esta bandera?',
      'question.capital': '¿Qué país tiene esta capital?',
      'score.final': '¡Acertaste {score} de {total} preguntas de geografía!'
    },
    fr: {
      'game.title': 'Quiz de Géographie',
      'game.description': 'Découvre les pays, capitales et drapeaux du monde entier',
      'question.country': 'Quelle est la capitale de ce pays ?',
      'question.flag': 'De quel pays est ce drapeau ?',
      'question.capital': 'Quel pays a cette capitale ?',
      'score.final': 'Tu as eu {score} sur {total} questions de géographie !'
    },
    en: {
      'game.title': 'Geography Quiz',
      'game.description': 'Discover countries, capitals and flags from around the world',
      'question.country': 'What is the capital of this country?',
      'question.flag': 'Which country does this flag belong to?',
      'question.capital': 'Which country has this capital?',
      'score.final': 'You got {score} out of {total} geography questions!'
    },
    it: {
      'game.title': 'Quiz di Geografia',
      'game.description': 'Scopri paesi, capitali e bandiere di tutto il mondo',
      'question.country': 'Qual è la capitale di questo paese?',
      'question.flag': 'Di quale paese è questa bandiera?',
      'question.capital': 'Quale paese ha questa capitale?',
      'score.final': 'Hai indovinato {score} su {total} domande di geografia!'
    }
  },
  'family': {
    pt: {
      'game.title': 'Membros da Família',
      'game.description': 'Aprende os nomes dos membros da família em inglês',
      'question.member': 'Quem é esta pessoa da família?',
      'question.english': 'Como se diz este membro da família em inglês?',
      'score.final': 'Acertaste {score} de {total} membros da família!'
    },
    es: {
      'game.title': 'Miembros de la Familia',
      'game.description': 'Aprende los nombres de los miembros de la familia en inglés',
      'question.member': '¿Quién es esta persona de la familia?',
      'question.english': '¿Cómo se dice este miembro de la familia en inglés?',
      'score.final': '¡Acertaste {score} de {total} miembros de la familia!'
    },
    fr: {
      'game.title': 'Membres de la Famille',
      'game.description': 'Apprends les noms des membres de la famille en anglais',
      'question.member': 'Qui est cette personne de la famille ?',
      'question.english': 'Comment dit-on ce membre de la famille en anglais ?',
      'score.final': 'Tu as eu {score} sur {total} membres de la famille !'
    },
    en: {
      'game.title': 'Family Members',
      'game.description': 'Learn the names of family members in English',
      'question.member': 'Who is this family member?',
      'question.english': 'How do you say this family member in English?',
      'score.final': 'You got {score} out of {total} family members!'
    },
    it: {
      'game.title': 'Membri della Famiglia',
      'game.description': 'Impara i nomi dei membri della famiglia in inglese',
      'question.member': 'Chi è questo membro della famiglia?',
      'question.english': 'Come si dice questo membro della famiglia in inglese?',
      'score.final': 'Hai indovinato {score} su {total} membri della famiglia!'
    }
  },
  'bubbles': {
    pt: {
      'game.title': 'Bolhas de Palavras',
      'game.description': 'Rebenta as bolhas com as letras ou palavras corretas',
      'question.pop': 'Rebenta as bolhas com a letra {letter}!',
      'question.word': 'Rebenta as bolhas para formar a palavra "{word}"!',
      'score.final': 'Rebentaste {score} de {total} bolhas!'
    },
    es: {
      'game.title': 'Burbujas de Palabras',
      'game.description': 'Revienta las burbujas con las letras o palabras correctas',
      'question.pop': '¡Revienta las burbujas con la letra {letter}!',
      'question.word': '¡Revienta las burbujas para formar la palabra "{word}"!',
      'score.final': '¡Reventaste {score} de {total} burbujas!'
    },
    fr: {
      'game.title': 'Bulles de Mots',
      'game.description': 'Fais éclater les bulles avec les bonnes lettres ou mots',
      'question.pop': 'Fais éclater les bulles avec la lettre {letter} !',
      'question.word': 'Fais éclater les bulles pour former le mot "{word}" !',
      'score.final': 'Tu as fait éclater {score} sur {total} bulles !'
    },
    en: {
      'game.title': 'Word Bubbles',
      'game.description': 'Pop bubbles with the correct letters or words',
      'question.pop': 'Pop the bubbles with the letter {letter}!',
      'question.word': 'Pop the bubbles to form the word "{word}"!',
      'score.final': 'You popped {score} out of {total} bubbles!'
    },
    it: {
      'game.title': 'Bolle di Parole',
      'game.description': 'Fai scoppiare le bolle con le lettere o parole corrette',
      'question.pop': 'Fai scoppiare le bolle con la lettera {letter}!',
      'question.word': 'Fai scoppiare le bolle per formare la parola "{word}"!',
      'score.final': 'Hai fatto scoppiare {score} su {total} bolle!'
    }
  },
  'racing': {
    pt: {
      'game.title': 'Corrida do Alfabeto',
      'game.description': 'Escreve as letras para fazer o carro avançar na corrida',
      'question.type': 'Escreve a letra {letter} para acelerar!',
      'question.progress': 'Continua a escrever para ganhar a corrida!',
      'score.final': 'Completaste {score} de {total} corridas!'
    },
    es: {
      'game.title': 'Carrera del Alfabeto',
      'game.description': 'Escribe las letras para hacer que el coche avance en la carrera',
      'question.type': '¡Escribe la letra {letter} para acelerar!',
      'question.progress': '¡Sigue escribiendo para ganar la carrera!',
      'score.final': '¡Completaste {score} de {total} carreras!'
    },
    fr: {
      'game.title': 'Course de l\'Alphabet',
      'game.description': 'Écris les lettres pour faire avancer la voiture dans la course',
      'question.type': 'Écris la lettre {letter} pour accélérer !',
      'question.progress': 'Continue d\'écrire pour gagner la course !',
      'score.final': 'Tu as terminé {score} sur {total} courses !'
    },
    en: {
      'game.title': 'Racing ABC',
      'game.description': 'Type letters to make the car race forward',
      'question.type': 'Type the letter {letter} to accelerate!',
      'question.progress': 'Keep typing to win the race!',
      'score.final': 'You completed {score} out of {total} races!'
    },
    it: {
      'game.title': 'Corsa dell\'Alfabeto',
      'game.description': 'Scrivi le lettere per far avanzare la macchina nella corsa',
      'question.type': 'Scrivi la lettera {letter} per accelerare!',
      'question.progress': 'Continua a scrivere per vincere la gara!',
      'score.final': 'Hai completato {score} su {total} gare!'
    }
  }
}

interface GameTranslationProviderProps {
  children: ReactNode
}

export const GameTranslationProvider: React.FC<GameTranslationProviderProps> = ({ children }) => {
  const [cache, setCache] = useState<GameTranslationCache>({})

  const loadGameTranslations = useCallback(async (gameId: GameId, language: Language): Promise<GameTranslations> => {
    // Check if already cached
    if (cache[gameId]?.[language]) {
      return cache[gameId][language]
    }

    // Simulate async loading (for future extensibility)
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const translations = gameTranslations[gameId]?.[language] || {}
    
    // Cache the translations
    setCache(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [language]: translations
      }
    }))

    return translations
  }, [cache])

  const getGameTranslation = useCallback((gameId: GameId, language: Language, key: string): string | null => {
    const cached = cache[gameId]?.[language]?.[key]
    return cached || null
  }, [cache])

  const clearCache = useCallback(() => {
    setCache({})
  }, [])

  return (
    <GameTranslationContext.Provider value={{ loadGameTranslations, getGameTranslation, clearCache }}>
      {children}
    </GameTranslationContext.Provider>
  )
}

export const useGameTranslations = (): GameTranslationContextType => {
  const context = useContext(GameTranslationContext)
  if (!context) {
    throw new Error('useGameTranslations must be used within a GameTranslationProvider')
  }
  return context
}