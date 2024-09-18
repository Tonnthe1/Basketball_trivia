import { Question } from '@/types';

const fallbackQuestions: { [key: string]: Question[] } = {
  easy: [
    {
      question: "Who holds the NBA record for most points scored in a single game?",
      options: ["Wilt Chamberlain", "Kobe Bryant", "Michael Jordan", "LeBron James"],
      correctAnswer: "Wilt Chamberlain"
    },
    {
      question: "How many players are on the court for each team during a basketball game?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5"
    },
    // Add more easy questions...
  ],
  medium: [
    {
      question: "Which NBA team has won the most championships?",
      options: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
      correctAnswer: "Boston Celtics"
    },
    {
      question: "What is the diameter of a basketball hoop in inches?",
      options: ["16 inches", "18 inches", "20 inches", "22 inches"],
      correctAnswer: "18 inches"
    },
    // Add more medium questions...
  ],
  hard: [
    {
      question: "Who was the first player to achieve a quadruple-double in NBA history?",
      options: ["Nate Thurmond", "Hakeem Olajuwon", "David Robinson", "Alvin Robertson"],
      correctAnswer: "Nate Thurmond"
    },
    {
      question: "In what year was the three-point line first introduced in the NBA?",
      options: ["1967", "1979", "1984", "1991"],
      correctAnswer: "1979"
    },
    // Add more hard questions...
  ]
};

export default fallbackQuestions;