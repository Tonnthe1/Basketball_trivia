import Link from 'next/link'
import { Difficulty } from '../types'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

export default function StartGame() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Choose difficulty:</h2>
      <div className="flex space-x-4">
        {difficulties.map((difficulty) => (
          <Link
            key={difficulty}
            href={`/game?difficulty=${difficulty}`}
            className={`btn btn-primary ${
              difficulty === 'easy'
                ? 'btn-success'
                : difficulty === 'medium'
                ? 'btn-warning'
                : 'btn-error'
            }`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  )
}