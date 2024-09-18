import Link from 'next/link'

interface GameResultProps {
  score: number
  totalQuestions: number
}

export default function GameResult({ score, totalQuestions }: GameResultProps) {
  return (
    <div className="text-center mt-8">
      <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
      <p className="text-xl mb-4">
        Your score: {score} out of {totalQuestions}
      </p>
      <Link href="/" className="btn btn-primary">
        Play Again
      </Link>
    </div>
  )
}