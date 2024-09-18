'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Question from '@/components/Question'
import GameResult from '@/components/GameResult'
import { GameState, Question as QuestionType } from '@/types'

export default function GameContent() {
  const searchParams = useSearchParams()
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard'

  const [gameState, setGameState] = useState<GameState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    gameOver: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/questions?difficulty=${difficulty}`)
        if (!res.ok) {
          throw new Error('Failed to fetch questions')
        }
        const questions: QuestionType[] = await res.json()
        setGameState((prevState) => ({ ...prevState, questions }))
      } catch (err) {
        setError('Failed to load questions. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuestions()
  }, [difficulty])

  const nextQuestion = useCallback(() => {
    setGameState((prevState) => {
      const newIndex = prevState.currentQuestionIndex + 1
      return {
        ...prevState,
        currentQuestionIndex: newIndex,
        gameOver: newIndex >= prevState.questions.length,
      }
    })
  }, [])

  const handleAnswer = useCallback((selectedAnswer: string) => {
    setGameState((prevState) => {
      const currentQuestion = prevState.questions[prevState.currentQuestionIndex]
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer
      return {
        ...prevState,
        score: isCorrect ? prevState.score + 1 : prevState.score,
      }
    })
    setTimeout(nextQuestion, 1500) // Move to next question after 1.5 seconds
  }, [nextQuestion])

  const handleTimeout = useCallback(() => {
    setTimeout(nextQuestion, 1500) // Move to next question after 1.5 seconds
  }, [nextQuestion])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl">Loading questions... This may take a moment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (gameState.gameOver) {
    return <GameResult score={gameState.score} totalQuestions={gameState.questions.length} />
  }

  if (gameState.questions.length === 0) {
    return <div className="text-center mt-8">No questions available. Please try again.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Basketball Trivia</h1>
      <p className="mb-4">
        Question {gameState.currentQuestionIndex + 1} of {gameState.questions.length} | Score: {gameState.score}
      </p>
      <Question
        key={gameState.currentQuestionIndex}
        question={gameState.questions[gameState.currentQuestionIndex]}
        onAnswer={handleAnswer}
        onTimeout={handleTimeout}
      />
    </div>
  )
}