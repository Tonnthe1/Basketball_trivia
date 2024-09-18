import { NextResponse } from 'next/server'
import { generateQuestions } from '@/lib/aiService'
import { Question, Difficulty } from '@/types'

const cache: { [key in Difficulty]?: { questions: Question[], timestamp: number } } = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET(request: Request) {
  console.log('API route hit: /api/questions')
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get('difficulty') as Difficulty | null

  if (!difficulty) {
    console.log('Error: Difficulty is required')
    return NextResponse.json({ error: 'Difficulty is required' }, { status: 400 })
  }

  console.log('Difficulty:', difficulty)

  const now = Date.now();
  const cachedData = cache[difficulty];
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log('Returning cached questions')
    return NextResponse.json(cachedData.questions)
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