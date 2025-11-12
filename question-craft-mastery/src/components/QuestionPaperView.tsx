
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QuestionPaper, Question, QuestionAttempt } from '../types';
import { updateQuestionUserNote, recordAttempt } from '../services/api';
import { Check, X, Info, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface QuestionPaperViewProps {
  questionPaper: QuestionPaper;
}

const QuestionPaperView: React.FC<QuestionPaperViewProps> = ({ questionPaper }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTestMode, setIsTestMode] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [showExplanation, setShowExplanation] = useState<number | null>(null);
  
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questionPaper.questions.length / questionsPerPage);
  const queryClient = useQueryClient();
  
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questionPaper.questions.slice(startIndex, startIndex + questionsPerPage);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTestMode && startTime) {
      timer = setInterval(() => {
        const currentTime = new Date();
        const diff = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestMode, startTime]);
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  const handleStartTest = () => {
    setIsTestMode(true);
    setStartTime(new Date());
    setUserAnswers({});
    setShowResults(false);
  };
  
  const handleEndTest = async () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculate score
    let correctAnswers = 0;
    const answers: QuestionAttempt[] = [];
    
    questionPaper.questions.forEach((question, index) => {
      if (question.options && question.answer) { // Only evaluate MCQ questions
        const userAnswer = userAnswers[index] || '';
        const isCorrect = userAnswer === question.answer;
        
        if (isCorrect) correctAnswers++;
        
        answers.push({
          questionIndex: index,
          selectedOption: userAnswer,
          isCorrect
        });
      }
    });
    
    const totalQuestions = questionPaper.questions.filter(q => q.options && q.answer).length;
    const questionsAttempted = Object.keys(userAnswers).length;
    const score = (correctAnswers / totalQuestions) * 100;
    
    // Record the attempt
    try {
      const attempt = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationInSeconds,
        questionsAttempted,
        questionsCorrect: correctAnswers,
        score,
        answers
      };
      
      await recordAttempt(questionPaper._id, attempt);
      queryClient.invalidateQueries({ queryKey: ['questionPaper', questionPaper._id] });
      
      setIsTestMode(false);
      setShowResults(true);
      toast.success('Test completed and results recorded!');
    } catch (error) {
      toast.error('Failed to record test results', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  const handleSelectOption = (questionIndex: number, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };
  
  const handleSaveNote = async () => {
    if (activeNoteIndex === null) return;
    
    try {
      await updateQuestionUserNote(questionPaper._id, activeNoteIndex, noteContent);
      queryClient.invalidateQueries({ queryKey: ['questionPaper', questionPaper._id] });
      
      // Update local state to reflect the change immediately
      const updatedPaper = {
        ...questionPaper,
        questions: questionPaper.questions.map((q, idx) => 
          idx === activeNoteIndex ? { ...q, userNote: noteContent } : q
        )
      };
      
      queryClient.setQueryData(['questionPaper', questionPaper._id], updatedPaper);
      
      setActiveNoteIndex(null);
      setNoteContent('');
      toast.success('Note saved successfully');
    } catch (error) {
      toast.error('Failed to save note', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  const toggleNoteEditor = (index: number) => {
    if (activeNoteIndex === index) {
      setActiveNoteIndex(null);
      setNoteContent('');
    } else {
      setActiveNoteIndex(index);
      setNoteContent(questionPaper.questions[index].userNote || '');
    }
  };
  
  const toggleExplanation = (index: number) => {
    if (showExplanation === index) {
      setShowExplanation(null);
    } else {
      setShowExplanation(index);
    }
  };
  
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'difficult':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const renderQuestionContent = (question: Question, index: number) => {
    const globalIndex = startIndex + index;
    const userAnswer = userAnswers[globalIndex];
    const isCorrect = userAnswer === question.answer;
    const isAnswered = userAnswer !== undefined;
    const showFeedback = showResults && isAnswered;
    
    return (
      <div className="mb-8 pb-6 border-b last:border-0">
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyClass(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
            {question.category}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {question.time_to_solve}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: question.title }} />
        </div>
        
        {question.options && (
          <div className="space-y-2 mt-4">
            {question.options.map((option, optIndex) => (
              <div 
                key={optIndex}
                className={`
                  p-3 border rounded-lg cursor-pointer transition-colors
                  ${userAnswer === option 
                    ? isTestMode 
                      ? 'bg-blue-100 border-blue-300' 
                      : showFeedback 
                        ? (isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300')
                        : 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50 border-gray-200'}
                  ${showResults && option === question.answer && 'bg-green-100 border-green-300'}
                `}
                onClick={() => isTestMode && handleSelectOption(globalIndex, option)}
              >
                <div className="flex items-center">
                  <div className="mr-3 flex items-center justify-center w-6 h-6 rounded-full border border-gray-400 flex-shrink-0">
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <div className="flex-grow">{option}</div>
                  {showFeedback && userAnswer === option && (
                    <div className="ml-2">
                      {isCorrect ? (
                        <Check className="text-green-500 h-5 w-5" />
                      ) : (
                        <X className="text-red-500 h-5 w-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {question.instructions && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800">Instructions:</h4>
            <p className="text-yellow-800">{question.instructions}</p>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-3">
          {/* Note button */}
          <button
            onClick={() => toggleNoteEditor(globalIndex)}
            className="flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            {question.userNote ? 'Edit Note' : 'Add Note'}
          </button>
          
          {/* Explanation button - only for MCQ questions */}
          {question.options && question.answer && (
            <button
              onClick={() => toggleExplanation(globalIndex)}
              className="flex items-center px-3 py-2 text-sm rounded-md bg-blue-100 hover:bg-blue-200 transition-colors"
              disabled={!showResults && isTestMode}
            >
              <Info className="h-4 w-4 mr-2" />
              {showExplanation === globalIndex ? 'Hide Explanation' : 'Show Explanation'}
            </button>
          )}
        </div>
        
        {/* Note editor */}
        {activeNoteIndex === globalIndex && (
          <div className="mt-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
              placeholder="Add your notes here..."
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
        
        {/* Display saved note */}
        {question.userNote && activeNoteIndex !== globalIndex && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800">Your Note:</h4>
            <p className="text-blue-800 whitespace-pre-wrap">{question.userNote}</p>
          </div>
        )}
        
        {/* Explanation */}
        {showExplanation === globalIndex && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-800">Explanation:</h4>
            <p className="text-purple-800">
              {question.explanation || `The correct answer is "${question.answer}".`}
            </p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="paper-container">
      {/* Paper header */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{questionPaper.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyClass(questionPaper.difficulty)}`}>
                {questionPaper.difficulty}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {questionPaper.time_to_solve}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Code: {questionPaper.paperCode}
              </span>
            </div>
            {questionPaper.link && (
              <div className="mt-2">
                <a 
                  href={questionPaper.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Chat Link
                </a>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {!isTestMode && !showResults && (
              <button
                onClick={handleStartTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Test
              </button>
            )}
            
            {isTestMode && (
              <button
                onClick={handleEndTest}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Submit Test
              </button>
            )}
            
            {showResults && (
              <button
                onClick={() => {
                  setShowResults(false);
                  setUserAnswers({});
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Review Questions
              </button>
            )}
          </div>
        </div>
        
        {isTestMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Time Elapsed:</span>
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        )}
        
        {showResults && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <h3 className="font-medium text-lg mb-2">Test Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-medium">Score:</span> {' '}
                  {Math.round(
                    (Object.entries(userAnswers).filter(
                      ([idx, ans]) => ans === questionPaper.questions[parseInt(idx)].answer
                    ).length / 
                    questionPaper.questions.filter(q => q.options && q.answer).length) * 100
                  )}%
                </p>
                <p>
                  <span className="font-medium">Time Taken:</span> {' '}
                  {formatTime(
                    Math.floor(
                      (new Date(questionPaper.attempts?.slice(-1)[0]?.endTime || '').getTime() - 
                       new Date(questionPaper.attempts?.slice(-1)[0]?.startTime || '').getTime()) / 1000
                    )
                  )}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Correct Answers:</span> {' '}
                  {Object.entries(userAnswers).filter(
                    ([idx, ans]) => ans === questionPaper.questions[parseInt(idx)].answer
                  ).length} {' '}
                  of {questionPaper.questions.filter(q => q.options && q.answer).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Questions */}
      <div className="mb-6">
        {currentQuestions.map((question, index) => renderQuestionContent(question, index))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPaperView;
