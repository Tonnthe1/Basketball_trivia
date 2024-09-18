import { NextResponse } from 'next/server'
import { generateQuestions } from '@/lib/aiService'

const cache: { [key: string]: { questions: any[], timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET(request: Request) {
  console.log('API route hit: /api/questions')
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard'
  console.log('Difficulty:', difficulty)

  if (!difficulty) {
    console.log('Error: Difficulty is required')
    return NextResponse.json({ error: 'Difficulty is required' }, { status: 400 })
  }

  const now = Date.now();
  if (cache[difficulty] && now - cache[difficulty].timestamp < CACHE_DURATION) {
    console.log('Returning cached questions')
    return NextResponse.json(cache[difficulty].questions)
  }

  try {
    console.log('Generating new questions')
    const questions = await generateQuestions(difficulty)
    console.log('Questions generated successfully:', questions.length)
    
    // Update cache
    cache[difficulty] = { questions, timestamp: now };

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ 
      error: 'Failed to generate questions',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}