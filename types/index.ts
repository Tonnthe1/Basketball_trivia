export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  gameOver: boolean;
}