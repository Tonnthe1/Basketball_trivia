import { Suspense, lazy } from 'react'

// Use lazy instead of dynamic
const GameContent = lazy(() => import('@/components/GameContent'))

export default function Game() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl">Loading game... This may take a moment.</p>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}