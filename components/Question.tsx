import React, { useState, useEffect, useCallback } from 'react';
import { Question as QuestionType } from '@/types';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (selectedAnswer: string) => void;
  onTimeout: () => void;
}

export default function Question({ question, onAnswer, onTimeout }: QuestionProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleTimeout = useCallback(() => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      onTimeout();
    }, 1500); // Reduced to 1.5 seconds
  }, [onTimeout]);

  useEffect(() => {
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [question]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleTimeout]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      onAnswer(answer);
    }, 1500); // Reduced to 1.5 seconds
  };

  const getButtonClass = (option: string) => {
    if (!showFeedback) return 'btn btn-outline btn-primary';
    if (option === question.correctAnswer) return 'btn btn-success';
    if (option === selectedAnswer && option !== question.correctAnswer) return 'btn btn-error';
    return 'btn btn-outline btn-primary';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <div className="text-2xl font-bold bg-blue-100 px-3 py-1 rounded">{timeLeft}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && handleAnswer(option)}
            className={getButtonClass(option)}
            disabled={showFeedback}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}