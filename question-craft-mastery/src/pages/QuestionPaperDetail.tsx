
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchQuestionPaperById } from '../services/api';
import QuestionPaperView from '../components/QuestionPaperView';
import AddQuestionForm from '../components/AddQuestionForm';
import { toast } from '@/components/ui/sonner';

const QuestionPaperDetail: React.FC = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  
  const { data: questionPaper, isLoading, error } = useQuery({
    queryKey: ['questionPaper', paperId],
    queryFn: () => fetchQuestionPaperById(paperId as string),
    enabled: !!paperId,
  });
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleToggleAddQuestion = () => {
    setShowAddQuestionForm(!showAddQuestionForm);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="mb-4">Loading question paper...</div>
        </div>
      </div>
    );
  }
  
  if (error || !questionPaper) {
    toast.error('Failed to load question paper');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <div className="mb-4">Error loading question paper. Please try again.</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Dashboard
        </button>
        
        <button
          onClick={handleToggleAddQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showAddQuestionForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>
      
      {showAddQuestionForm ? (
        <AddQuestionForm
          paperId={paperId as string}
          onClose={() => setShowAddQuestionForm(false)}
        />
      ) : (
        <QuestionPaperView questionPaper={questionPaper} />
      )}
    </div>
  );
};

export default QuestionPaperDetail;
