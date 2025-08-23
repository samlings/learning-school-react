import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'pt' | 'es' | 'fr' | 'en' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  pt: {
    // App Header
    'app.title': '🚀 Joga e Aprende 🚀',
    'app.subtitle': 'Onde jogar e aprender se encontram de forma divertida!',
    'app.footer': 'Feito com ❤️ para crianças das escolas de Portugal',
    'back.menu': '← Voltar ao Menu',
    'loading.game': 'A carregar jogo...',
    
    // About page
    'about.button': 'ℹ️ Sobre',
    'about.title': 'Sobre o Joga e Aprende',
    'about.subtitle': 'A tua plataforma de aprendizagem divertida e interativa',
    'about.mission.title': 'A Nossa Missão',
    'about.mission.description': 'Criamos jogos educativos divertidos para ajudar as crianças portuguesas a aprenderem de forma interativa. O nosso objetivo é tornar a aprendizagem uma aventura emocionante!',
    'about.features.title': 'Características Principais',
    'about.features.multilingual': 'Suporte para múltiplas línguas (Português, Inglês, Espanhol, Francês)',
    'about.features.educational': 'Jogos educativos baseados no currículo escolar português',
    'about.features.interactive': 'Experiências de aprendizagem interativas e envolventes',
    'about.features.free': 'Completamente gratuito para todas as crianças e escolas',
    'about.team.title': 'A Nossa Equipa',
    'about.team.description': 'Somos uma equipa de educadores, programadores e designers apaixonados por criar ferramentas educativas inovadoras para as nossas crianças.',
    'about.contact.title': 'Contacta-nos',
    'about.contact.email': 'Email',
    'about.contact.website': 'Website',
    'about.footer.made.with.love': 'Feito com muito ❤️ para as escolas de Portugal',
    
    // Game Menu
    'menu.title': '🎮 Escolhe o teu Jogo! 🎮',
    'menu.subtitle': 'Seleciona um jogo divertido para descobrir novos mundos de aprendizagem!',
    'menu.tip': '💡 Dica: Podes voltar ao menu principal a qualquer momento!',
    'button.play': '▶️ Jogar',
    
    // Game Cards
    'game.fv.title': 'Sons F e V',
    'game.fv.description': 'Aprende a distinguir os sons F e V através de imagens e palavras',
    'game.chj.title': 'Sons CH e J',
    'game.chj.description': 'Aprende a distinguir os sons CH e J através de imagens e palavras',
    'game.hangman.title': 'Jogo da Forca',
    'game.hangman.description': 'Descobre a palavra secreta letra por letra antes que o boneco seja desenhado',
    'game.colors.title': 'Cores em Inglês',
    'game.colors.description': 'Aprende as cores em inglês através de imagens coloridas e divertidas',
    'game.numbers.title': 'Números em Inglês',
    'game.numbers.description': 'Aprende os números de 1 a 10 em inglês de forma divertida',
    'game.home.title': 'Objetos da Casa',
    'game.home.description': 'Aprende o nome dos objetos da casa em inglês',
    'game.geography.title': 'Quiz de Geografia',
    'game.geography.description': 'Descobre países, capitais e bandeiras do mundo inteiro',
    'game.family.title': 'Membros da Família',
    'game.family.description': 'Aprende os nomes dos membros da família em inglês',
    'game.bubbles.title': 'Bolhas de Palavras',
    'game.bubbles.description': 'Rebenta as bolhas com as letras ou palavras corretas',
    'game.racing.title': 'Corrida do Alfabeto',
    'game.racing.description': 'Escreve as letras para fazer o carro avançar na corrida',
    'game.number.bubbles.title': 'Bolhas de Números',
    'game.number.bubbles.description': 'Rebenta as bolhas com os números que cumprem o desafio matemático',
    'game.rocket.math.title': 'Foguetão da Tabuada',
    'game.rocket.math.description': 'Lança o teu foguetão para o espaço resolvendo problemas de multiplicação',
    'game.mult.ninja.title': 'Ninja da Multiplicação',
    'game.mult.ninja.description': 'Derrota os inimigos resolvendo rapidamente multiplicações como um verdadeiro ninja',
    'game.fish.math.title': 'Tabuada do Peixe',
    'game.fish.math.description': 'Ajuda o peixinho a conseguir comida resolvendo multiplicações antes do crocodilo',
    
    // Game Features
    'feature.audio': '🔊 Audio',
    'feature.images': '🖼️ Imagens',
    'feature.easy': '⭐ Fácil',
    'feature.medium': '⭐⭐ Médio',
    'feature.hard': '⭐⭐⭐ Difícil',
    'feature.alphabet': '🔤 Alfabeto',
    'feature.drawing': '🎨 Desenho',
    'feature.colors': '🎨 Cores',
    'feature.english': '🇬🇧 Inglês',
    'feature.numbers': '🔢 Números',
    'feature.home': '🏠 Casa',
    'feature.geography': '🌍 Geografia',
    'feature.family': '👨‍👩‍👧‍👦 Família',
    'feature.world': '🗺️ Mundo',
    'feature.interactive': '🎮 Interativo',
    'feature.bubbles': '💭 Bolhas',
    'feature.typing': '⌨️ Escrita',
    'feature.speed': '⚡ Velocidade',
    'feature.letters': '🔤 Letras',
    
    // Filter System
    'filter.title': 'Filtrar Jogos',
    'filter.category': 'Categoria',
    'filter.difficulty': 'Dificuldade',
    'filter.features': 'Características',
    'filter.clear': 'Limpar Tudo',
    'filter.expand': 'Expandir',
    'filter.collapse': 'Colapsar',
    'filter.of': 'de',
    'filter.games': 'jogos',
    'filter.no.results': 'Nenhum jogo corresponde aos filtros selecionados',
    'filter.no.results.suggestion': 'Tenta limpar alguns filtros para ver mais jogos',
    
    // Categories
    'category.sounds': '🎵 Sons',
    'category.english': '🇬🇧 Inglês',
    'category.words': '📝 Palavras',
    'category.geography': '🌍 Geografia',
    'category.family': '👨‍👩‍👧‍👦 Família',
    'category.interactive': '🎮 Interativo',
    
    // Difficulties
    'difficulty.easy': '⭐ Fácil',
    'difficulty.medium': '⭐⭐ Médio',
    'difficulty.hard': '⭐⭐⭐ Difícil',
    
    // Game Common
    'game.question.number': 'Pergunta {current} de {total}',
    'game.score': 'Pontos: {score}',
    'button.listen': '🔊 Ouvir',
    'button.listen.word': '🔊 Ouvir a Palavra',
    'button.new.game': '🔄 Jogar Outra Vez',
    'button.try.again': '🔄 Tentar Novamente',
    'button.new.word': '🔄 Nova Palavra',
    
    // Level System
    'level.complete': '🎉 Nível Completo! 🎉',
    'level.excellent': 'Excelente trabalho!',
    'level.current': 'Nível {current} de {total}',
    
    // Game Results
    'result.congratulations': '🎉 Parabéns! 🎉',
    'result.sorry': '😔 Que pena! 😔',
    'result.correct': '✅ Correto! Muito bem!',
    'result.incorrect.fv': '❌ Ops! A resposta certa é "{answer}"',
    'result.incorrect.chj': '❌ Ops! A resposta certa é "{answer}"',
    'result.incorrect.translation': '❌ Ops! "{portuguese}" é "{english}" em inglês',
    'result.correct.translation': '✅ Correto! "{portuguese}" é "{english}" em inglês!',
    
    // Questions
    'question.fv.sound': 'Esta palavra começa com que som?',
    'question.chj.sound': 'Esta palavra começa com que som?',
    'question.color.english': 'Como se diz esta cor em inglês?',
    'question.number.english': 'Como se diz este número em inglês?',
    'question.object.english': 'Como se diz este objeto em inglês?',
    'question.geography.country': 'Qual é a capital deste país?',
    'question.geography.flag': 'De que país é esta bandeira?',
    'question.geography.capital': 'Qual país tem esta capital?',
    'question.family.member': 'Quem é esta pessoa da família?',
    'question.family.english': 'Como se diz este membro da família em inglês?',
    'question.bubbles.pop': 'Rebenta as bolhas com a letra {letter}!',
    'question.bubbles.word': 'Rebenta as bolhas para formar a palavra "{word}"!',
    'question.racing.type': 'Escreve a letra {letter} para acelerar!',
    'question.racing.progress': 'Continua a escrever para ganhar a corrida!',
    
    // Number Bubbles Challenges
    'challenge.numbers.even': 'Rebenta as bolhas com números PARES',
    'challenge.numbers.odd': 'Rebenta as bolhas com números ÍMPARES',
    'challenge.numbers.greater': 'Rebenta as bolhas com números MAIORES que {value}',
    'challenge.numbers.less': 'Rebenta as bolhas com números MENORES que {value}',
    'challenge.numbers.multiples': 'Rebenta as bolhas com MÚLTIPLOS de {value}',
    'challenge.numbers.prime': 'Rebenta as bolhas com números PRIMOS',
    'challenge.current': 'Desafio',
    'found.count': 'Encontrados',
    'time.limit': 'Tempo limite',
    'time.seconds': 'segundos',
    'target.find': 'Encontrar',
    'numbers.correct': 'números corretos',
    'number.range': 'Números de',
    'button.start.level': 'Começar Nível',
    'button.launch.rocket': '🚀 Lançar Foguetão',
    'button.next.level': 'Próximo Nível',
    'button.retry.level': 'Repetir Nível',
    'button.play.again': 'Jogar Novamente',
    'button.begin.training': '⚔️ Iniciar Treino',
    'button.start.fishing': '🐟 Começar a Pescar',
    
    // Scores and feedback
    'score.final.fv': 'Acertaste {score} de {total} palavras!',
    'score.final.chj': 'Acertaste {score} de {total} palavras!',
    'score.final.colors': 'Acertaste {score} de {total} cores!',
    'score.final.numbers': 'Acertaste {score} de {total} números!',
    'score.final.home': 'Acertaste {score} de {total} objetos!',
    'score.final.hangman': 'Acertaste {score} de {total} palavras!',
    'score.final.geography': 'Acertaste {score} de {total} perguntas de geografia!',
    'score.final.family': 'Acertaste {score} de {total} membros da família!',
    'score.final.bubbles': 'Rebentaste {score} de {total} bolhas!',
    'score.final.racing': 'Completaste {score} de {total} corridas!',
    'score.final.number.bubbles': 'Completaste {score} de {total} níveis de números!',
    'score.perfect': 'Perfeito! És um campeão! 🏆',
    'score.good': 'Muito bem! Continua a praticar! 👏',
    'score.practice': 'Continua a tentar! Vais conseguir! 💪',
    
    // Examples
    'feature.example.faca': 'como "Faca"',
    'feature.example.vaca': 'como "Vaca"',
    'feature.example.chave': 'como "Chave"',
    'feature.example.jarro': 'como "Jarro"',
    
    // Hangman specific
    'hangman.errors': 'Erros: {current}/{max}',
    'hangman.hint.label': 'Dica:',
    'hangman.choose.letter': 'Escolhe uma letra:',
    'hangman.win.message': 'Conseguiste descobrir a palavra!',
    'hangman.lose.message': 'Não conseguiste desta vez...',
    'hangman.word.was': 'A palavra era: {word}',
    'hangman.perfect': 'És fantástico!',
    'hangman.encouragement': 'Não desistas! Tenta outra vez!'
  },
  es: {
    // App Header
    'app.title': '🚀 Juega y Aprende 🚀',
    'app.subtitle': '¡Donde jugar y aprender se encuentran de forma divertida!',
    'app.footer': 'Hecho con ❤️ para niños en escuelas de Portugal',
    'back.menu': '← Volver al Menú',
    'loading.game': 'Cargando juego...',
    
    // About page
    'about.button': 'ℹ️ Acerca de',
    'about.title': 'Acerca de Juega y Aprende',
    'about.subtitle': 'Tu plataforma de aprendizaje divertida e interactiva',
    'about.mission.title': 'Nuestra Misión',
    'about.mission.description': 'Creamos juegos educativos divertidos para ayudar a los niños portugueses a aprender de forma interactiva. ¡Nuestro objetivo es hacer del aprendizaje una aventura emocionante!',
    'about.features.title': 'Características Principales',
    'about.features.multilingual': 'Soporte para múltiples idiomas (Portugués, Inglés, Español, Francés)',
    'about.features.educational': 'Juegos educativos basados en el currículo escolar portugués',
    'about.features.interactive': 'Experiencias de aprendizaje interactivas y atractivas',
    'about.features.free': 'Completamente gratuito para todos los niños y escuelas',
    'about.team.title': 'Nuestro Equipo',
    'about.team.description': 'Somos un equipo de educadores, programadores y diseñadores apasionados por crear herramientas educativas innovadoras para nuestros niños.',
    'about.contact.title': 'Contáctanos',
    'about.contact.email': 'Email',
    'about.contact.website': 'Sitio web',
    'about.footer.made.with.love': 'Hecho con mucho ❤️ para las escuelas de Portugal',
    
    // Game Menu
    'menu.title': '🎮 ¡Elige tu Juego! 🎮',
    'menu.subtitle': '¡Selecciona un juego divertido para descubrir nuevos mundos de aprendizaje!',
    'menu.tip': '💡 Consejo: ¡Puedes volver al menú principal en cualquier momento!',
    'button.play': '▶️ Jugar',
    
    // Game Cards
    'game.fv.title': 'Sonidos F y V',
    'game.fv.description': 'Aprende a distinguir los sonidos F y V a través de imágenes y palabras',
    'game.chj.title': 'Sonidos CH y J',
    'game.chj.description': 'Aprende a distinguir los sonidos CH y J a través de imágenes y palabras',
    'game.hangman.title': 'Juego del Ahorcado',
    'game.hangman.description': 'Descubre la palabra secreta letra por letra antes de que se dibuje el muñeco',
    'game.colors.title': 'Colores en Inglés',
    'game.colors.description': 'Aprende los colores en inglés a través de imágenes coloridas y divertidas',
    'game.numbers.title': 'Números en Inglés',
    'game.numbers.description': 'Aprende los números del 1 al 10 en inglés de forma divertida',
    'game.home.title': 'Objetos de la Casa',
    'game.home.description': 'Aprende el nombre de los objetos de la casa en inglés',
    'game.geography.title': 'Quiz de Geografía',
    'game.geography.description': 'Descubre países, capitales y banderas de todo el mundo',
    'game.family.title': 'Miembros de la Familia',
    'game.family.description': 'Aprende los nombres de los miembros de la familia en inglés',
    'game.bubbles.title': 'Burbujas de Palabras',
    'game.bubbles.description': 'Revienta las burbujas con las letras o palabras correctas',
    'game.racing.title': 'Carrera del Alfabeto',
    'game.racing.description': 'Escribe las letras para hacer que el coche avance en la carrera',
    'game.number.bubbles.title': 'Burbujas de Números',
    'game.number.bubbles.description': 'Revienta las burbujas con los números que cumplen el desafío matemático',
    'game.rocket.math.title': 'Cohete de la Tabla',
    'game.rocket.math.description': 'Lanza tu cohete al espacio resolviendo problemas de multiplicación',
    'game.mult.ninja.title': 'Ninja de la Multiplicación',
    'game.mult.ninja.description': 'Derrota a los enemigos resolviendo rápidamente multiplicaciones como un verdadero ninja',
    'game.fish.math.title': 'Tabla del Pez',
    'game.fish.math.description': 'Ayuda al pececito a conseguir comida resolviendo multiplicaciones antes que el cocodrilo',
    
    // Game Features
    'feature.audio': '🔊 Audio',
    'feature.images': '🖼️ Imágenes',
    'feature.easy': '⭐ Fácil',
    'feature.medium': '⭐⭐ Medio',
    'feature.hard': '⭐⭐⭐ Difícil',
    'feature.alphabet': '🔤 Alfabeto',
    'feature.drawing': '🎨 Dibujo',
    'feature.colors': '🎨 Colores',
    'feature.english': '🇬🇧 Inglés',
    'feature.numbers': '🔢 Números',
    'feature.home': '🏠 Casa',
    'feature.geography': '🌍 Geografía',
    'feature.family': '👨‍👩‍👧‍👦 Familia',
    'feature.world': '🗺️ Mundo',
    'feature.interactive': '🎮 Interactivo',
    'feature.bubbles': '💭 Burbujas',
    'feature.typing': '⌨️ Escritura',
    'feature.speed': '⚡ Velocidad',
    'feature.letters': '🔤 Letras',
    
    // Filter System
    'filter.title': 'Filtrar Juegos',
    'filter.category': 'Categoría',
    'filter.difficulty': 'Dificultad',
    'filter.features': 'Características',
    'filter.clear': 'Limpiar Todo',
    'filter.expand': 'Expandir',
    'filter.collapse': 'Colapsar',
    'filter.of': 'de',
    'filter.games': 'juegos',
    'filter.no.results': 'Ningún juego coincide con los filtros seleccionados',
    'filter.no.results.suggestion': 'Intenta limpiar algunos filtros para ver más juegos',
    
    // Categories
    'category.sounds': '🎵 Sonidos',
    'category.english': '🇬🇧 Inglés',
    'category.words': '📝 Palabras',
    'category.geography': '🌍 Geografía',
    'category.family': '👨‍👩‍👧‍👦 Familia',
    'category.interactive': '🎮 Interactivo',
    
    // Difficulties
    'difficulty.easy': '⭐ Fácil',
    'difficulty.medium': '⭐⭐ Medio',
    'difficulty.hard': '⭐⭐⭐ Difícil',
    
    // Game Common
    'game.question.number': 'Pregunta {current} de {total}',
    'game.score': 'Puntos: {score}',
    'button.listen': '🔊 Escuchar',
    'button.listen.word': '🔊 Escuchar la Palabra',
    'button.new.game': '🔄 Jugar de Nuevo',
    'button.try.again': '🔄 Intentar de Nuevo',
    'button.new.word': '🔄 Nueva Palabra',
    
    // Level System
    'level.complete': '🎉 ¡Nivel Completado! 🎉',
    'level.excellent': '¡Excelente trabajo!',
    'level.current': 'Nivel {current} de {total}',
    
    // Game Results
    'result.congratulations': '🎉 ¡Felicitaciones! 🎉',
    'result.sorry': '😔 ¡Qué pena! 😔',
    'result.correct': '✅ ¡Correcto! ¡Muy bien!',
    'result.incorrect.fv': '❌ ¡Ups! La respuesta correcta es "{answer}"',
    'result.incorrect.chj': '❌ ¡Ups! La respuesta correcta es "{answer}"',
    'result.incorrect.translation': '❌ ¡Ups! "{portuguese}" es "{english}" en inglés',
    'result.correct.translation': '✅ ¡Correcto! "{portuguese}" es "{english}" en inglés!',
    
    // Questions
    'question.fv.sound': '¿Con qué sonido empieza esta palabra?',
    'question.chj.sound': '¿Con qué sonido empieza esta palabra?',
    'question.color.english': '¿Cómo se dice este color en inglés?',
    'question.number.english': '¿Cómo se dice este número en inglés?',
    'question.object.english': '¿Cómo se dice este objeto en inglés?',
    'question.geography.country': '¿Cuál es la capital de este país?',
    'question.geography.flag': '¿De qué país es esta bandera?',
    'question.geography.capital': '¿Qué país tiene esta capital?',
    'question.family.member': '¿Quién es esta persona de la familia?',
    'question.family.english': '¿Cómo se dice este miembro de la familia en inglés?',
    'question.bubbles.pop': '¡Revienta las burbujas con la letra {letter}!',
    'question.bubbles.word': '¡Revienta las burbujas para formar la palabra "{word}"!',
    'question.racing.type': '¡Escribe la letra {letter} para acelerar!',
    'question.racing.progress': '¡Sigue escribiendo para ganar la carrera!',
    
    // Number Bubbles Challenges
    'challenge.numbers.even': 'Revienta las burbujas con números PARES',
    'challenge.numbers.odd': 'Revienta las burbujas con números IMPARES',
    'challenge.numbers.greater': 'Revienta las burbujas con números MAYORES que {value}',
    'challenge.numbers.less': 'Revienta las burbujas con números MENORES que {value}',
    'challenge.numbers.multiples': 'Revienta las burbujas con MÚLTIPLOS de {value}',
    'challenge.numbers.prime': 'Revienta las burbujas con números PRIMOS',
    'challenge.current': 'Desafío',
    'found.count': 'Encontrados',
    'time.limit': 'Límite de tiempo',
    'time.seconds': 'segundos',
    'target.find': 'Encontrar',
    'numbers.correct': 'números correctos',
    'number.range': 'Números de',
    'button.start.level': 'Empezar Nivel',
    'button.launch.rocket': '🚀 Lanzar Cohete',
    'button.next.level': 'Siguiente Nivel',
    'button.retry.level': 'Repetir Nivel',
    'button.play.again': 'Jugar de Nuevo',
    'button.begin.training': '⚔️ Comenzar Entrenamiento',
    'button.start.fishing': '🐟 Empezar a Pescar',
    
    // Scores and feedback
    'score.final.fv': '¡Acertaste {score} de {total} palabras!',
    'score.final.chj': '¡Acertaste {score} de {total} palabras!',
    'score.final.colors': '¡Acertaste {score} de {total} colores!',
    'score.final.numbers': '¡Acertaste {score} de {total} números!',
    'score.final.home': '¡Acertaste {score} de {total} objetos!',
    'score.final.hangman': '¡Acertaste {score} de {total} palabras!',
    'score.final.geography': '¡Acertaste {score} de {total} preguntas de geografía!',
    'score.final.family': '¡Acertaste {score} de {total} miembros de la familia!',
    'score.final.bubbles': '¡Reventaste {score} de {total} burbujas!',
    'score.final.racing': '¡Completaste {score} de {total} carreras!',
    'score.final.number.bubbles': '¡Completaste {score} de {total} niveles de números!',
    'score.perfect': '¡Perfecto! ¡Eres un campeón! 🏆',
    'score.good': '¡Muy bien! ¡Sigue practicando! 👏',
    'score.practice': '¡Sigue intentando! ¡Lo conseguirás! 💪',
    
    // Examples
    'feature.example.faca': 'como "Faca"',
    'feature.example.vaca': 'como "Vaca"',
    'feature.example.chave': 'como "Chave"',
    'feature.example.jarro': 'como "Jarro"',
    
    // Hangman specific
    'hangman.errors': 'Errores: {current}/{max}',
    'hangman.hint.label': 'Pista:',
    'hangman.choose.letter': 'Elige una letra:',
    'hangman.win.message': '¡Conseguiste descubrir la palabra!',
    'hangman.lose.message': 'No lo conseguiste esta vez...',
    'hangman.word.was': 'La palabra era: {word}',
    'hangman.perfect': '¡Eres fantástico!',
    'hangman.encouragement': '¡No te rindas! ¡Inténtalo otra vez!'
  },
  fr: {
    // App Header
    'app.title': '🚀 Joue et Apprends 🚀',
    'app.subtitle': 'Où jouer et apprendre se rencontrent de façon amusante !',
    'app.footer': 'Fait avec ❤️ pour les écoliers portugais',
    'back.menu': '← Retour au Menu',
    'loading.game': 'Chargement du jeu...',
    
    // About page
    'about.button': 'ℹ️ À propos',
    'about.title': 'À propos de Joue et Apprends',
    'about.subtitle': 'Votre plateforme d\'apprentissage amusante et interactive',
    'about.mission.title': 'Notre Mission',
    'about.mission.description': 'Nous créons des jeux éducatifs amusants pour aider les enfants portugais à apprendre de manière interactive. Notre objectif est de faire de l\'apprentissage une aventure passionnante !',
    'about.features.title': 'Caractéristiques Principales',
    'about.features.multilingual': 'Support pour plusieurs langues (Portugais, Anglais, Espagnol, Français)',
    'about.features.educational': 'Jeux éducatifs basés sur le programme scolaire portugais',
    'about.features.interactive': 'Expériences d\'apprentissage interactives et engageantes',
    'about.features.free': 'Complètement gratuit pour tous les enfants et écoles',
    'about.team.title': 'Notre Équipe',
    'about.team.description': 'Nous sommes une équipe d\'éducateurs, programmeurs et designers passionnés par la création d\'outils éducatifs innovants pour nos enfants.',
    'about.contact.title': 'Contactez-nous',
    'about.contact.email': 'Email',
    'about.contact.website': 'Site web',
    'about.footer.made.with.love': 'Fait avec beaucoup de ❤️ pour les écoles du Portugal',
    
    // Game Menu
    'menu.title': '🎮 Choisis ton Jeu ! 🎮',
    'menu.subtitle': 'Sélectionne un jeu amusant pour découvrir de nouveaux mondes d\'apprentissage !',
    'menu.tip': '💡 Astuce : Tu peux revenir au menu principal à tout moment !',
    'button.play': '▶️ Jouer',
    
    // Game Cards
    'game.fv.title': 'Sons F et V',
    'game.fv.description': 'Apprends à distinguer les sons F et V à travers des images et des mots',
    'game.chj.title': 'Sons CH et J',
    'game.chj.description': 'Apprends à distinguer les sons CH et J à travers des images et des mots',
    'game.hangman.title': 'Jeu du Pendu',
    'game.hangman.description': 'Découvre le mot secret lettre par lettre avant que le bonhomme soit dessiné',
    'game.colors.title': 'Couleurs en Anglais',
    'game.colors.description': 'Apprends les couleurs en anglais à travers des images colorées et amusantes',
    'game.numbers.title': 'Nombres en Anglais',
    'game.numbers.description': 'Apprends les nombres de 1 à 10 en anglais de manière amusante',
    'game.home.title': 'Objets de la Maison',
    'game.home.description': 'Apprends le nom des objets de la maison en anglais',
    'game.geography.title': 'Quiz de Géographie',
    'game.geography.description': 'Découvre les pays, capitales et drapeaux du monde entier',
    'game.family.title': 'Membres de la Famille',
    'game.family.description': 'Apprends les noms des membres de la famille en anglais',
    'game.bubbles.title': 'Bulles de Mots',
    'game.bubbles.description': 'Fais éclater les bulles avec les bonnes lettres ou mots',
    'game.racing.title': 'Course de l\'Alphabet',
    'game.racing.description': 'Écris les lettres pour faire avancer la voiture dans la course',
    'game.number.bubbles.title': 'Bulles de Nombres',
    'game.number.bubbles.description': 'Éclate les bulles avec les nombres qui relèvent le défi mathématique',
    'game.rocket.math.title': 'Fusée des Tables',
    'game.rocket.math.description': 'Lance ta fusée dans l\'espace en résolvant des problèmes de multiplication',
    'game.mult.ninja.title': 'Ninja de la Multiplication',
    'game.mult.ninja.description': 'Défais les ennemis en résolvant rapidement les multiplications comme un vrai ninja',
    'game.fish.math.title': 'Table du Poisson',
    'game.fish.math.description': 'Aide le petit poisson à obtenir de la nourriture en résolvant des multiplications avant le crocodile',
    
    // Game Features
    'feature.audio': '🔊 Audio',
    'feature.images': '🖼️ Images',
    'feature.easy': '⭐ Facile',
    'feature.medium': '⭐⭐ Moyen',
    'feature.hard': '⭐⭐⭐ Difficile',
    'feature.alphabet': '🔤 Alphabet',
    'feature.drawing': '🎨 Dessin',
    'feature.colors': '🎨 Couleurs',
    'feature.english': '🇬🇧 Anglais',
    'feature.numbers': '🔢 Nombres',
    'feature.home': '🏠 Maison',
    'feature.geography': '🌍 Géographie',
    'feature.family': '👨‍👩‍👧‍👦 Famille',
    'feature.world': '🗺️ Monde',
    'feature.interactive': '🎮 Interactif',
    'feature.bubbles': '💭 Bulles',
    'feature.typing': '⌨️ Écriture',
    'feature.speed': '⚡ Vitesse',
    'feature.letters': '🔤 Lettres',
    
    // Filter System
    'filter.title': 'Filtrer les Jeux',
    'filter.category': 'Catégorie',
    'filter.difficulty': 'Difficulté',
    'filter.features': 'Caractéristiques',
    'filter.clear': 'Tout Effacer',
    'filter.expand': 'Développer',
    'filter.collapse': 'Réduire',
    'filter.of': 'sur',
    'filter.games': 'jeux',
    'filter.no.results': 'Aucun jeu ne correspond aux filtres sélectionnés',
    'filter.no.results.suggestion': 'Essayez de supprimer quelques filtres pour voir plus de jeux',
    
    // Categories
    'category.sounds': '🎵 Sons',
    'category.english': '🇬🇧 Anglais',
    'category.words': '📝 Mots',
    'category.geography': '🌍 Géographie',
    'category.family': '👨‍👩‍👧‍👦 Famille',
    'category.interactive': '🎮 Interactif',
    
    // Difficulties
    'difficulty.easy': '⭐ Facile',
    'difficulty.medium': '⭐⭐ Moyen',
    'difficulty.hard': '⭐⭐⭐ Difficile',
    
    // Game Common
    'game.question.number': 'Question {current} sur {total}',
    'game.score': 'Points : {score}',
    'button.listen': '🔊 Écouter',
    'button.listen.word': '🔊 Écouter le Mot',
    'button.new.game': '🔄 Rejouer',
    'button.try.again': '🔄 Réessayer',
    'button.new.word': '🔄 Nouveau Mot',
    
    // Level System
    'level.complete': '🎉 Niveau Terminé! 🎉',
    'level.excellent': 'Excellent travail!',
    'level.current': 'Niveau {current} sur {total}',
    
    // Game Results
    'result.congratulations': '🎉 Félicitations ! 🎉',
    'result.sorry': '😔 Dommage ! 😔',
    'result.correct': '✅ Correct ! Très bien !',
    'result.incorrect.fv': '❌ Oups ! La bonne réponse est "{answer}"',
    'result.incorrect.chj': '❌ Oups ! La bonne réponse est "{answer}"',
    'result.incorrect.translation': '❌ Oups ! "{portuguese}" se dit "{english}" en anglais',
    'result.correct.translation': '✅ Correct ! "{portuguese}" se dit "{english}" en anglais !',
    
    // Questions
    'question.fv.sound': 'Par quel son commence ce mot ?',
    'question.chj.sound': 'Par quel son commence ce mot ?',
    'question.color.english': 'Comment dit-on cette couleur en anglais ?',
    'question.number.english': 'Comment dit-on ce nombre en anglais ?',
    'question.object.english': 'Comment dit-on cet objet en anglais ?',
    'question.geography.country': 'Quelle est la capitale de ce pays ?',
    'question.geography.flag': 'De quel pays est ce drapeau ?',
    'question.geography.capital': 'Quel pays a cette capitale ?',
    'question.family.member': 'Qui est cette personne de la famille ?',
    'question.family.english': 'Comment dit-on ce membre de la famille en anglais ?',
    'question.bubbles.pop': 'Fais éclater les bulles avec la lettre {letter} !',
    'question.bubbles.word': 'Fais éclater les bulles pour former le mot "{word}" !',
    'question.racing.type': 'Écris la lettre {letter} pour accélérer !',
    'question.racing.progress': 'Continue d\'écrire pour gagner la course !',
    
    // Number Bubbles Challenges
    'challenge.numbers.even': 'Éclate les bulles avec nombres PAIRS',
    'challenge.numbers.odd': 'Éclate les bulles avec nombres IMPAIRS',
    'challenge.numbers.greater': 'Éclate les bulles avec nombres PLUS GRANDS que {value}',
    'challenge.numbers.less': 'Éclate les bulles avec nombres PLUS PETITS que {value}',
    'challenge.numbers.multiples': 'Éclate les bulles avec MULTIPLES de {value}',
    'challenge.numbers.prime': 'Éclate les bulles avec nombres PREMIERS',
    'challenge.current': 'Défi',
    'found.count': 'Trouvés',
    'time.limit': 'Limite de temps',
    'time.seconds': 'secondes',
    'target.find': 'Trouver',
    'numbers.correct': 'nombres corrects',
    'number.range': 'Nombres de',
    'button.start.level': 'Commencer Niveau',
    'button.launch.rocket': '🚀 Lancer la Fusée',
    'button.next.level': 'Niveau Suivant',
    'button.retry.level': 'Recommencer le Niveau',
    'button.play.again': 'Rejouer',
    'button.begin.training': '⚔️ Commencer l\'Entraînement',
    'button.start.fishing': '🐟 Commencer à Pêcher',
    
    // Scores and feedback
    'score.final.fv': 'Tu as eu {score} sur {total} mots !',
    'score.final.chj': 'Tu as eu {score} sur {total} mots !',
    'score.final.colors': 'Tu as eu {score} sur {total} couleurs !',
    'score.final.numbers': 'Tu as eu {score} sur {total} nombres !',
    'score.final.home': 'Tu as eu {score} sur {total} objets !',
    'score.final.hangman': 'Tu as eu {score} sur {total} mots !',
    'score.final.geography': 'Tu as eu {score} sur {total} questions de géographie !',
    'score.final.family': 'Tu as eu {score} sur {total} membres de la famille !',
    'score.final.bubbles': 'Tu as fait éclater {score} sur {total} bulles !',
    'score.final.racing': 'Tu as terminé {score} sur {total} courses !',
    'score.final.number.bubbles': 'Tu as terminé {score} sur {total} niveaux de nombres !',
    'score.perfect': 'Parfait ! Tu es un champion ! 🏆',
    'score.good': 'Très bien ! Continue à t\'entraîner ! 👏',
    'score.practice': 'Continue d\'essayer ! Tu y arriveras ! 💪',
    
    // Examples
    'feature.example.faca': 'comme "Faca"',
    'feature.example.vaca': 'comme "Vaca"',
    'feature.example.chave': 'comme "Chave"',
    'feature.example.jarro': 'comme "Jarro"',
    
    // Hangman specific
    'hangman.errors': 'Erreurs : {current}/{max}',
    'hangman.hint.label': 'Indice :',
    'hangman.choose.letter': 'Choisis une lettre :',
    'hangman.win.message': 'Tu as réussi à découvrir le mot !',
    'hangman.lose.message': 'Tu n\'as pas réussi cette fois...',
    'hangman.word.was': 'Le mot était : {word}',
    'hangman.perfect': 'Tu es fantastique !',
    'hangman.encouragement': 'N\'abandonne pas ! Essaie encore !'
  },
  en: {
    // App Header
    'app.title': '🚀 Play & Study 🚀',
    'app.subtitle': 'Where play and learning meet in a fun way!',
    'app.footer': 'Made with ❤️ for Portuguese school children',
    'back.menu': '← Back to Menu',
    'loading.game': 'Loading game...',
    
    // About page
    'about.button': 'ℹ️ About',
    'about.title': 'About Play & Study',
    'about.subtitle': 'Your fun and interactive learning platform',
    'about.mission.title': 'Our Mission',
    'about.mission.description': 'We create fun educational games to help Portuguese children learn interactively. Our goal is to make learning an exciting adventure!',
    'about.features.title': 'Key Features',
    'about.features.multilingual': 'Multi-language support (Portuguese, English, Spanish, French)',
    'about.features.educational': 'Educational games based on the Portuguese school curriculum',
    'about.features.interactive': 'Interactive and engaging learning experiences',
    'about.features.free': 'Completely free for all children and schools',
    'about.team.title': 'Our Team',
    'about.team.description': 'We are a team of educators, programmers, and designers passionate about creating innovative educational tools for our children.',
    'about.contact.title': 'Contact Us',
    'about.contact.email': 'Email',
    'about.contact.website': 'Website',
    'about.footer.made.with.love': 'Made with lots of ❤️ for Portuguese schools',
    
    // Game Menu
    'menu.title': '🎮 Choose your Game! 🎮',
    'menu.subtitle': 'Select a fun game to discover new worlds of learning!',
    'menu.tip': '💡 Tip: You can return to the main menu at any time!',
    'button.play': '▶️ Play',
    
    // Game Cards
    'game.fv.title': 'F and V Sounds',
    'game.fv.description': 'Learn to distinguish F and V sounds through images and words',
    'game.chj.title': 'CH and J Sounds',
    'game.chj.description': 'Learn to distinguish CH and J sounds through images and words',
    'game.hangman.title': 'Hangman Game',
    'game.hangman.description': 'Discover the secret word letter by letter before the drawing is completed',
    'game.colors.title': 'Colors in English',
    'game.colors.description': 'Learn colors in English through colorful and fun images',
    'game.numbers.title': 'Numbers in English',
    'game.numbers.description': 'Learn numbers 1 to 10 in English in a fun way',
    'game.home.title': 'Home Objects',
    'game.home.description': 'Learn the names of home objects in English',
    'game.geography.title': 'Geography Quiz',
    'game.geography.description': 'Discover countries, capitals and flags from around the world',
    'game.family.title': 'Family Members',
    'game.family.description': 'Learn the names of family members in English',
    'game.bubbles.title': 'Word Bubbles',
    'game.bubbles.description': 'Pop bubbles with the correct letters or words',
    'game.racing.title': 'Racing ABC',
    'game.racing.description': 'Type letters to make the car race forward',
    'game.number.bubbles.title': 'Number Bubbles',
    'game.number.bubbles.description': 'Pop bubbles with numbers that meet the mathematical challenge',
    'game.rocket.math.title': 'Times Table Rocket',
    'game.rocket.math.description': 'Launch your rocket to space by solving multiplication problems',
    'game.mult.ninja.title': 'Multiplication Ninja',
    'game.mult.ninja.description': 'Defeat enemies by quickly solving multiplications like a true ninja',
    'game.fish.math.title': 'Fish Times Table',
    'game.fish.math.description': 'Help the little fish get food by solving multiplications before the crocodile',
    
    // Game Features
    'feature.audio': '🔊 Audio',
    'feature.images': '🖼️ Images',
    'feature.easy': '⭐ Easy',
    'feature.medium': '⭐⭐ Medium',
    'feature.hard': '⭐⭐⭐ Hard',
    'feature.alphabet': '🔤 Alphabet',
    'feature.drawing': '🎨 Drawing',
    'feature.colors': '🎨 Colors',
    'feature.english': '🇬🇧 English',
    'feature.numbers': '🔢 Numbers',
    'feature.home': '🏠 Home',
    'feature.geography': '🌍 Geography',
    'feature.family': '👨‍👩‍👧‍👦 Family',
    'feature.world': '🗺️ World',
    'feature.interactive': '🎮 Interactive',
    'feature.bubbles': '💭 Bubbles',
    'feature.typing': '⌨️ Typing',
    'feature.speed': '⚡ Speed',
    'feature.letters': '🔤 Letters',
    
    // Filter System
    'filter.title': 'Filter Games',
    'filter.category': 'Category',
    'filter.difficulty': 'Difficulty',
    'filter.features': 'Features',
    'filter.clear': 'Clear All',
    'filter.expand': 'Expand',
    'filter.collapse': 'Collapse',
    'filter.of': 'of',
    'filter.games': 'games',
    'filter.no.results': 'No games match the selected filters',
    'filter.no.results.suggestion': 'Try clearing some filters to see more games',
    
    // Categories
    'category.sounds': '🎵 Sounds',
    'category.english': '🇬🇧 English',
    'category.words': '📝 Words',
    'category.geography': '🌍 Geography',
    'category.family': '👨‍👩‍👧‍👦 Family',
    'category.interactive': '🎮 Interactive',
    
    // Difficulties
    'difficulty.easy': '⭐ Easy',
    'difficulty.medium': '⭐⭐ Medium',
    'difficulty.hard': '⭐⭐⭐ Hard',
    
    // Game Common
    'game.question.number': 'Question {current} of {total}',
    'game.score': 'Score: {score}',
    'button.listen': '🔊 Listen',
    'button.listen.word': '🔊 Listen to Word',
    'button.new.game': '🔄 Play Again',
    'button.try.again': '🔄 Try Again',
    'button.new.word': '🔄 New Word',
    
    // Level System
    'level.complete': '🎉 Level Complete! 🎉',
    'level.excellent': 'Excellent work!',
    'level.current': 'Level {current} of {total}',
    
    // Game Results
    'result.congratulations': '🎉 Congratulations! 🎉',
    'result.sorry': '😔 Too bad! 😔',
    'result.correct': '✅ Correct! Well done!',
    'result.incorrect.fv': '❌ Oops! The correct answer is "{answer}"',
    'result.incorrect.chj': '❌ Oops! The correct answer is "{answer}"',
    'result.incorrect.translation': '❌ Oops! "{portuguese}" is "{english}" in English',
    'result.correct.translation': '✅ Correct! "{portuguese}" is "{english}" in English!',
    
    // Questions
    'question.fv.sound': 'What sound does this word start with?',
    'question.chj.sound': 'What sound does this word start with?',
    'question.color.english': 'How do you say this color in English?',
    'question.number.english': 'How do you say this number in English?',
    'question.object.english': 'How do you say this object in English?',
    'question.geography.country': 'What is the capital of this country?',
    'question.geography.flag': 'Which country does this flag belong to?',
    'question.geography.capital': 'Which country has this capital?',
    'question.family.member': 'Who is this family member?',
    'question.family.english': 'How do you say this family member in English?',
    'question.bubbles.pop': 'Pop the bubbles with the letter {letter}!',
    'question.bubbles.word': 'Pop the bubbles to form the word "{word}"!',
    'question.racing.type': 'Type the letter {letter} to accelerate!',
    'question.racing.progress': 'Keep typing to win the race!',
    
    // Number Bubbles Challenges
    'challenge.numbers.even': 'Pop bubbles with EVEN numbers',
    'challenge.numbers.odd': 'Pop bubbles with ODD numbers',
    'challenge.numbers.greater': 'Pop bubbles with numbers GREATER than {value}',
    'challenge.numbers.less': 'Pop bubbles with numbers LESS than {value}',
    'challenge.numbers.multiples': 'Pop bubbles with MULTIPLES of {value}',
    'challenge.numbers.prime': 'Pop bubbles with PRIME numbers',
    'challenge.current': 'Challenge',
    'found.count': 'Found',
    'time.limit': 'Time limit',
    'time.seconds': 'seconds',
    'target.find': 'Find',
    'numbers.correct': 'correct numbers',
    'number.range': 'Numbers from',
    'button.start.level': 'Start Level',
    'button.launch.rocket': '🚀 Launch Rocket',
    'button.next.level': 'Next Level',
    'button.retry.level': 'Retry Level',
    'button.play.again': 'Play Again',
    'button.begin.training': '⚔️ Begin Training',
    'button.start.fishing': '🐟 Start Fishing',
    
    // Scores and feedback
    'score.final.fv': 'You got {score} out of {total} words!',
    'score.final.chj': 'You got {score} out of {total} words!',
    'score.final.colors': 'You got {score} out of {total} colors!',
    'score.final.numbers': 'You got {score} out of {total} numbers!',
    'score.final.home': 'You got {score} out of {total} objects!',
    'score.final.hangman': 'You got {score} out of {total} words!',
    'score.final.geography': 'You got {score} out of {total} geography questions!',
    'score.final.family': 'You got {score} out of {total} family members!',
    'score.final.bubbles': 'You popped {score} out of {total} bubbles!',
    'score.final.racing': 'You completed {score} out of {total} races!',
    'score.final.number.bubbles': 'You completed {score} out of {total} number levels!',
    'score.perfect': 'Perfect! You are a champion! 🏆',
    'score.good': 'Very good! Keep practicing! 👏',
    'score.practice': 'Keep trying! You will succeed! 💪',
    
    // Examples
    'feature.example.faca': 'like "Faca"',
    'feature.example.vaca': 'like "Vaca"',
    'feature.example.chave': 'like "Chave"',
    'feature.example.jarro': 'like "Jarro"',
    
    // Hangman specific
    'hangman.errors': 'Errors: {current}/{max}',
    'hangman.hint.label': 'Hint:',
    'hangman.choose.letter': 'Choose a letter:',
    'hangman.win.message': 'You managed to discover the word!',
    'hangman.lose.message': 'You didn\'t make it this time...',
    'hangman.word.was': 'The word was: {word}',
    'hangman.perfect': 'You are fantastic!',
    'hangman.encouragement': 'Don\'t give up! Try again!'
  },
  it: {
    // App Header
    'app.title': '🚀 Gioca e Impara 🚀',
    'app.subtitle': 'Dove giocare e imparare si incontrano in modo divertente!',
    'app.footer': 'Fatto con ❤️ per i bambini delle scuole portoghesi',
    'back.menu': '← Torna al Menu',
    'loading.game': 'Caricamento gioco...',
    
    // About page
    'about.button': 'ℹ️ Informazioni',
    'about.title': 'Informazioni su Gioca e Impara',
    'about.subtitle': 'La tua piattaforma di apprendimento divertente e interattiva',
    'about.mission.title': 'La Nostra Missione',
    'about.mission.description': 'Creiamo giochi educativi divertenti per aiutare i bambini portoghesi ad imparare in modo interattivo. Il nostro obiettivo è rendere l\'apprendimento un\'avventura emozionante!',
    'about.features.title': 'Caratteristiche Principali',
    'about.features.multilingual': 'Supporto per più lingue (Portoghese, Inglese, Spagnolo, Francese, Italiano)',
    'about.features.educational': 'Giochi educativi basati sul curriculum scolastico portoghese',
    'about.features.interactive': 'Esperienze di apprendimento interattive e coinvolgenti',
    'about.features.free': 'Completamente gratuito per tutti i bambini e le scuole',
    'about.team.title': 'Il Nostro Team',
    'about.team.description': 'Siamo un team di educatori, programmatori e designer appassionati di creare strumenti educativi innovativi per i nostri bambini.',
    'about.contact.title': 'Contattaci',
    'about.contact.email': 'Email',
    'about.contact.website': 'Sito web',
    'about.footer.made.with.love': 'Fatto con tanto ❤️ per le scuole del Portogallo',
    
    // Game Menu
    'menu.title': '🎮 Scegli il tuo Gioco! 🎮',
    'menu.subtitle': 'Seleziona un gioco divertente per scoprire nuovi mondi di apprendimento!',
    'menu.tip': '💡 Suggerimento: Puoi tornare al menu principale in qualsiasi momento!',
    'button.play': '▶️ Gioca',
    
    // Game Cards
    'game.fv.title': 'Suoni F e V',
    'game.fv.description': 'Impara a distinguere i suoni F e V attraverso immagini e parole',
    'game.chj.title': 'Suoni CH e J',
    'game.chj.description': 'Impara a distinguere i suoni CH e J attraverso immagini e parole',
    'game.hangman.title': 'Gioco dell\'Impiccato',
    'game.hangman.description': 'Scopri la parola segreta lettera per lettera prima che il disegno sia completato',
    'game.colors.title': 'Colori in Inglese',
    'game.colors.description': 'Impara i colori in inglese attraverso immagini colorate e divertenti',
    'game.numbers.title': 'Numeri in Inglese',
    'game.numbers.description': 'Impara i numeri da 1 a 10 in inglese in modo divertente',
    'game.home.title': 'Oggetti di Casa',
    'game.home.description': 'Impara i nomi degli oggetti di casa in inglese',
    'game.geography.title': 'Quiz di Geografia',
    'game.geography.description': 'Scopri paesi, capitali e bandiere di tutto il mondo',
    'game.family.title': 'Membri della Famiglia',
    'game.family.description': 'Impara i nomi dei membri della famiglia in inglese',
    'game.bubbles.title': 'Bolle di Parole',
    'game.bubbles.description': 'Fai scoppiare le bolle con le lettere o parole corrette',
    'game.racing.title': 'Corsa dell\'Alfabeto',
    'game.racing.description': 'Scrivi le lettere per far avanzare la macchina nella corsa',
    'game.number.bubbles.title': 'Bolle di Numeri',
    'game.number.bubbles.description': 'Fai scoppiare le bolle con i numeri che soddisfano la sfida matematica',
    'game.rocket.math.title': 'Razzo delle Tabelline',
    'game.rocket.math.description': 'Lancia il tuo razzo nello spazio risolvendo problemi di moltiplicazione',
    'game.mult.ninja.title': 'Ninja della Moltiplicazione',
    'game.mult.ninja.description': 'Sconfiggi i nemici risolvendo rapidamente le moltiplicazioni come un vero ninja',
    'game.fish.math.title': 'Tabelline del Pesce',
    'game.fish.math.description': 'Aiuta il pesciolino a ottenere cibo risolvendo moltiplicazioni prima del coccodrillo',
    
    // Game Features
    'feature.audio': '🔊 Audio',
    'feature.images': '🖼️ Immagini',
    'feature.easy': '⭐ Facile',
    'feature.medium': '⭐⭐ Medio',
    'feature.hard': '⭐⭐⭐ Difficile',
    'feature.alphabet': '🔤 Alfabeto',
    'feature.drawing': '🎨 Disegno',
    'feature.colors': '🎨 Colori',
    'feature.english': '🇬🇧 Inglese',
    'feature.numbers': '🔢 Numeri',
    'feature.home': '🏠 Casa',
    'feature.geography': '🌍 Geografia',
    'feature.family': '👨‍👩‍👧‍👦 Famiglia',
    'feature.world': '🗺️ Mondo',
    'feature.interactive': '🎮 Interattivo',
    'feature.bubbles': '💭 Bolle',
    'feature.typing': '⌨️ Scrittura',
    'feature.speed': '⚡ Velocità',
    'feature.letters': '🔤 Lettere',
    
    // Filter System
    'filter.title': 'Filtra Giochi',
    'filter.category': 'Categoria',
    'filter.difficulty': 'Difficoltà',
    'filter.features': 'Caratteristiche',
    'filter.clear': 'Pulisci Tutto',
    'filter.expand': 'Espandi',
    'filter.collapse': 'Comprimi',
    'filter.of': 'di',
    'filter.games': 'giochi',
    'filter.no.results': 'Nessun gioco corrisponde ai filtri selezionati',
    'filter.no.results.suggestion': 'Prova a rimuovere alcuni filtri per vedere più giochi',
    
    // Categories
    'category.sounds': '🎵 Suoni',
    'category.english': '🇬🇧 Inglese',
    'category.words': '📝 Parole',
    'category.geography': '🌍 Geografia',
    'category.family': '👨‍👩‍👧‍👦 Famiglia',
    'category.interactive': '🎮 Interattivo',
    
    // Difficulties
    'difficulty.easy': '⭐ Facile',
    'difficulty.medium': '⭐⭐ Medio',
    'difficulty.hard': '⭐⭐⭐ Difficile',
    
    // Game Common
    'game.question.number': 'Domanda {current} di {total}',
    'game.score': 'Punteggio: {score}',
    'button.listen': '🔊 Ascolta',
    'button.listen.word': '🔊 Ascolta la Parola',
    'button.new.game': '🔄 Gioca Ancora',
    'button.try.again': '🔄 Riprova',
    'button.new.word': '🔄 Nuova Parola',
    
    // Level System
    'level.complete': '🎉 Livello Completato! 🎉',
    'level.excellent': 'Lavoro eccellente!',
    'level.current': 'Livello {current} di {total}',
    
    // Game Results
    'result.congratulations': '🎉 Congratulazioni! 🎉',
    'result.sorry': '😔 Peccato! 😔',
    'result.correct': '✅ Corretto! Molto bene!',
    'result.incorrect.fv': '❌ Ops! La risposta corretta è "{answer}"',
    'result.incorrect.chj': '❌ Ops! La risposta corretta è "{answer}"',
    'result.incorrect.translation': '❌ Ops! "{portuguese}" è "{english}" in inglese',
    'result.correct.translation': '✅ Corretto! "{portuguese}" è "{english}" in inglese!',
    
    // Questions
    'question.fv.sound': 'Con che suono inizia questa parola?',
    'question.chj.sound': 'Con che suono inizia questa parola?',
    'question.color.english': 'Come si dice questo colore in inglese?',
    'question.number.english': 'Come si dice questo numero in inglese?',
    'question.object.english': 'Come si dice questo oggetto in inglese?',
    'question.geography.country': 'Qual è la capitale di questo paese?',
    'question.geography.flag': 'Di quale paese è questa bandiera?',
    'question.geography.capital': 'Quale paese ha questa capitale?',
    'question.family.member': 'Chi è questo membro della famiglia?',
    'question.family.english': 'Come si dice questo membro della famiglia in inglese?',
    'question.bubbles.pop': 'Fai scoppiare le bolle con la lettera {letter}!',
    'question.bubbles.word': 'Fai scoppiare le bolle per formare la parola "{word}"!',
    'question.racing.type': 'Scrivi la lettera {letter} per accelerare!',
    'question.racing.progress': 'Continua a scrivere per vincere la gara!',
    
    // Number Bubbles Challenges
    'challenge.numbers.even': 'Fai scoppiare le bolle con numeri PARI',
    'challenge.numbers.odd': 'Fai scoppiare le bolle con numeri DISPARI',
    'challenge.numbers.greater': 'Fai scoppiare le bolle con numeri MAGGIORI di {value}',
    'challenge.numbers.less': 'Fai scoppiare le bolle con numeri MINORI di {value}',
    'challenge.numbers.multiples': 'Fai scoppiare le bolle con MULTIPLI di {value}',
    'challenge.numbers.prime': 'Fai scoppiare le bolle con numeri PRIMI',
    'challenge.current': 'Sfida',
    'found.count': 'Trovati',
    'time.limit': 'Limite di tempo',
    'time.seconds': 'secondi',
    'target.find': 'Trova',
    'numbers.correct': 'numeri corretti',
    'number.range': 'Numeri da',
    'button.start.level': 'Inizia Livello',
    'button.launch.rocket': '🚀 Lancia Razzo',
    'button.next.level': 'Livello Successivo',
    'button.retry.level': 'Riprova Livello',
    'button.play.again': 'Gioca Ancora',
    'button.begin.training': '⚔️ Inizia Allenamento',
    'button.start.fishing': '🐟 Inizia a Pescare',
    
    // Scores and feedback
    'score.final.fv': 'Hai indovinato {score} su {total} parole!',
    'score.final.chj': 'Hai indovinato {score} su {total} parole!',
    'score.final.colors': 'Hai indovinato {score} su {total} colori!',
    'score.final.numbers': 'Hai indovinato {score} su {total} numeri!',
    'score.final.home': 'Hai indovinato {score} su {total} oggetti!',
    'score.final.hangman': 'Hai indovinato {score} su {total} parole!',
    'score.final.geography': 'Hai indovinato {score} su {total} domande di geografia!',
    'score.final.family': 'Hai indovinato {score} su {total} membri della famiglia!',
    'score.final.bubbles': 'Hai fatto scoppiare {score} su {total} bolle!',
    'score.final.racing': 'Hai completato {score} su {total} gare!',
    'score.final.number.bubbles': 'Hai completato {score} su {total} livelli di numeri!',
    'score.perfect': 'Perfetto! Sei un campione! 🏆',
    'score.good': 'Molto bene! Continua a esercitarti! 👏',
    'score.practice': 'Continua a provare! Ce la farai! 💪',
    
    // Examples
    'feature.example.faca': 'come "Faca"',
    'feature.example.vaca': 'come "Vaca"',
    'feature.example.chave': 'come "Chave"',
    'feature.example.jarro': 'come "Jarro"',
    
    // Hangman specific
    'hangman.errors': 'Errori: {current}/{max}',
    'hangman.hint.label': 'Suggerimento:',
    'hangman.choose.letter': 'Scegli una lettera:',
    'hangman.win.message': 'Sei riuscito a scoprire la parola!',
    'hangman.lose.message': 'Non ce l\'hai fatta questa volta...',
    'hangman.word.was': 'La parola era: {word}',
    'hangman.perfect': 'Sei fantastico!',
    'hangman.encouragement': 'Non arrenderti! Riprova!'
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt')

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = (translations[language] as any)[key] || (translations['pt'] as any)[key] || key
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue))
      })
    }
    
    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}