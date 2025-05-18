"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Gamepad2, RefreshCw, Trophy } from 'lucide-react'

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fun Games</h1>
        <p className="text-muted-foreground">
          Take a short break with these quick games to refresh your mind and reduce stress.
        </p>
      </div>

      <Tabs defaultValue="memory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="memory">Memory Game</TabsTrigger>
          <TabsTrigger value="puzzle">Word Puzzle</TabsTrigger>
          <TabsTrigger value="reaction">Reaction Test</TabsTrigger>
        </TabsList>

        <TabsContent value="memory">
          <MemoryGame />
        </TabsContent>

        <TabsContent value="puzzle">
          <WordPuzzle />
        </TabsContent>

        <TabsContent value="reaction">
          <ReactionTest />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const emojis = ["🙂", "😊", "🤔", "😌", "😎", "🧘", "💪", "🌱"]

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create pairs of cards
    const cardValues = [...emojis, ...emojis]

    // Shuffle the cards
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameComplete(false)
  }

  const handleCardClick = (id) => {
    // Ignore if card is already flipped or matched
    if (cards[id].flipped || cards[id].matched) return

    // Ignore if two cards are already flipped
    if (flippedCards.length === 2) return

    // Flip the card
    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstId, secondId] = newFlippedCards

      if (cards[firstId].value === cards[secondId].value) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstId].matched = true
          matchedCards[secondId].matched = true
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Check if game is complete
          if (matchedPairs + 1 === emojis.length) {
            setGameComplete(true)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[firstId].flipped = false
          resetCards[secondId].flipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Memory Match
        </CardTitle>
        <CardDescription>Find all matching pairs with the fewest moves</CardDescription>
      </CardHeader>
      <CardContent>
        {gameComplete ? (
          <div className="text-center py-8 space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            <h3 className="text-2xl font-bold">Congratulations!</h3>
            <p>You completed the game in {moves} moves</p>
            <Button onClick={initializeGame} className="bg-primary text-primary-foreground hover:bg-primary/90">Play Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square flex items-center justify-center text-2xl rounded-md cursor-pointer transition-all duration-300 ${
                  card.flipped || card.matched
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                } ${card.matched ? "opacity-50" : ""}`}
                onClick={() => handleCardClick(card.id)}
                style={{ 
                  transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                {(card.flipped || card.matched) && card.value}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm">Moves: {moves}</p>
          <p className="text-sm text-muted-foreground">
            Pairs: {matchedPairs}/{emojis.length}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={initializeGame}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  )
}

function WordPuzzle() {
  const [currentWord, setCurrentWord] = useState({ original: "", scrambled: "", hint: "" })
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [isCorrect, setIsCorrect] = useState(null)
  
  const wordList = [
    { word: "MEDITATION", hint: "Taking time to clear your mind" },
    { word: "WELLNESS", hint: "Overall state of good health" },
    { word: "BALANCE", hint: "Equal distribution of weight" },
    { word: "MINDFUL", hint: "Being conscious or aware" },
    { word: "HEALTHY", hint: "In good physical condition" },
    { word: "RELAXATION", hint: "State of being free from tension" },
    { word: "EXERCISE", hint: "Physical activity for fitness" },
    { word: "NUTRITION", hint: "Process of providing food for growth" }
  ]
  
  useEffect(() => {
    getNewWord()
  }, [])
  
  const scrambleWord = (word) => {
    const wordArray = word.split('')
    let scrambled = wordArray.sort(() => Math.random() - 0.5).join('')
    
    // Make sure the scrambled word is different from the original
    while (scrambled === word && word.length > 1) {
      scrambled = wordArray.sort(() => Math.random() - 0.5).join('')
    }
    
    return scrambled
  }
  
  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length)
    const selectedWord = wordList[randomIndex]
    
    setCurrentWord({
      original: selectedWord.word,
      scrambled: scrambleWord(selectedWord.word),
      hint: selectedWord.hint
    })
    setUserAnswer("")
    setIsCorrect(null)
  }
  
  const checkAnswer = () => {
    const isAnswerCorrect = userAnswer.toUpperCase() === currentWord.original
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      setScore(score + 1)
    }
    
    setTotalAttempts(totalAttempts + 1)
    
    // Get a new word after a short delay to let the user see the result
    setTimeout(() => {
      if (isAnswerCorrect) {
        getNewWord()
      }
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Word Scramble
        </CardTitle>
        <CardDescription>Unscramble the letters to form a word related to wellness</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <div className="text-3xl font-bold tracking-wider py-8">{currentWord.scrambled}</div>

          <div className="flex gap-2 max-w-md mx-auto">
            <Input 
              placeholder="Your answer" 
              className="flex-1" 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <Button 
              onClick={checkAnswer}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Check
            </Button>
          </div>

          {isCorrect !== null && (
            <div className={`text-lg font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : 'Try again!'}
            </div>
          )}

          <div className="text-sm text-muted-foreground">Hint: {currentWord.hint}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Score: {score}/{totalAttempts}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={getNewWord}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          New Word
        </Button>
      </CardFooter>
    </Card>
  )
}

function ReactionTest() {
  const [state, setState] = useState('waiting') // waiting, ready, testing, result
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [bestTime, setBestTime] = useState(null)
  const [countdownTimer, setCountdownTimer] = useState(null)
  
  const handleClick = () => {
    if (state === 'waiting') {
      // Start the game
      setState('ready')
      
      // Random delay between 2-6 seconds
      const randomDelay = Math.floor(Math.random() * 4000) + 2000
      
      // Set a timeout to change the color
      setCountdownTimer(setTimeout(() => {
        setStartTime(Date.now())
        setState('testing')
      }, randomDelay))
      
    } else if (state === 'ready') {
      // Clicked too early
      clearTimeout(countdownTimer)
      setState('waiting')
      
    } else if (state === 'testing') {
      // Calculate reaction time
      const endTime = Date.now()
      const timeTaken = endTime - startTime
      setReactionTime(timeTaken)
      
      // Update best time if needed
      if (bestTime === null || timeTaken < bestTime) {
        setBestTime(timeTaken)
      }
      
      setState('result')
    } else if (state === 'result') {
      // Reset for a new attempt
      setState('waiting')
    }
  }
  
  const getBackgroundColor = () => {
    switch(state) {
      case 'waiting': return 'bg-muted'
      case 'ready': return 'bg-red-500'
      case 'testing': return 'bg-green-500'
      case 'result': return 'bg-blue-500'
      default: return 'bg-muted'
    }
  }
  
  const getMessage = () => {
    switch(state) {
      case 'waiting': return 'Click to start'
      case 'ready': return 'Wait for green...'
      case 'testing': return 'Click now!'
      case 'result': return `Your time: ${reactionTime}ms\nClick to try again`
      default: return 'Click to start'
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Reaction Time Test
        </CardTitle>
        <CardDescription>Test your reaction speed. Click when the color changes!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <div 
            className={`h-60 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300 ${getBackgroundColor()}`}
            onClick={handleClick}
          >
            <p className="text-lg whitespace-pre-line">{getMessage()}</p>
          </div>

          <div>
            <p className="text-lg font-medium">
              Your time: <span>{reactionTime > 0 ? `${reactionTime}ms` : '0ms'}</span>
            </p>
            <p className="text-sm text-muted-foreground">Average: 273ms</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Best: {bestTime ? `${bestTime}ms` : '0ms'}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setState('waiting')}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  )
}

function Input({ className, ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}