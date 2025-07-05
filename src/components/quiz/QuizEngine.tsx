import React, { useState, useEffect } from 'react';
import { Quiz, Question, QuizAttempt } from '../../types';
import { Clock, CheckCircle, XCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface QuizEngineProps {
  quiz: Quiz;
  onComplete: (attempt: Partial<QuizAttempt>) => void;
  onExit: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ quiz, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quiz.randomizeQuestions 
    ? [...quiz.questions].sort(() => Math.random() - 0.5)
    : quiz.questions;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleSubmit();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    const question = questions[currentQuestionIndex];
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (question.type === 'mcq') {
        return { ...prev, [questionId]: [optionIndex] };
      } else if (question.type === 'multiple') {
        const newAnswers = currentAnswers.includes(optionIndex)
          ? currentAnswers.filter(i => i !== optionIndex)
          : [...currentAnswers, optionIndex];
        return { ...prev, [questionId]: newAnswers };
      }
      
      return prev;
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.points;
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correctAnswers;

      if (question.type === 'mcq') {
        if (userAnswers.length === 1 && correctAnswers.includes(userAnswers[0])) {
          totalScore += question.points;
        }
      } else if (question.type === 'multiple') {
        const correctCount = userAnswers.filter(ans => correctAnswers.includes(ans)).length;
        const incorrectCount = userAnswers.filter(ans => !correctAnswers.includes(ans)).length;
        const missedCount = correctAnswers.filter(ans => !userAnswers.includes(ans)).length;
        
        if (incorrectCount === 0 && missedCount === 0) {
          totalScore += question.points;
        } else if (correctCount > 0) {
          totalScore += (question.points * correctCount) / correctAnswers.length;
        }
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const handleSubmit = () => {
    setIsActive(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);

    const attempt: Partial<QuizAttempt> = {
      quizId: quiz.id,
      answers,
      score: finalScore,
      timeSpent: (quiz.timeLimit * 60) - timeRemaining,
      completedAt: new Date(),
    };

    onComplete(attempt);
  };

  const startQuiz = () => {
    setIsActive(true);
  };

  const pauseQuiz = () => {
    setIsActive(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswers = answers[currentQuestion?.id] || [];

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              score >= quiz.passingScore ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
            }`}>
              {score >= quiz.passingScore ? (
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Completed!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your Score: <span className="font-bold">{score}%</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {score >= quiz.passingScore ? 'Congratulations! You passed!' : `You need ${quiz.passingScore}% to pass.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{questions.length}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime((quiz.timeLimit * 60) - timeRemaining)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{score}%</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive && timeRemaining === quiz.timeLimit * 60) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{quiz.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{quiz.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Questions</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{quiz.questions.length}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Time Limit</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{quiz.timeLimit} min</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Passing Score</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{quiz.passingScore}%</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400">Attempts</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{quiz.maxAttempts}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onExit}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining <= 300 ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
              'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <button
              onClick={isActive ? pauseQuiz : () => setIsActive(true)}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {currentQuestionIndex + 1}
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentQuestion.question}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion.type === 'mcq' ? 'Select one answer' : 'Select all correct answers'} 
                • {currentQuestion.points} points
              </p>
            </div>
          </div>

          {currentQuestion.media && (
            <div className="mb-6">
              <img 
                src={currentQuestion.media} 
                alt="Question media"
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                userAnswers.includes(index)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  userAnswers.includes(index)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {userAnswers.includes(index) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;