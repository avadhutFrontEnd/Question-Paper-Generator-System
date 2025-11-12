
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchQuestionPaperByCode } from '../services/api';
import { QuestionPaper } from '../types';
import { toast } from '@/components/ui/sonner';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  
  const paperCode = searchParams.get('code');
  
  useEffect(() => {
    const searchPaper = async () => {
      if (!paperCode) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedPaper = await fetchQuestionPaperByCode(paperCode);
        setPaper(fetchedPaper);
      } catch (error) {
        setError('No question paper found with that code. Please check the code and try again.');
        toast.error('Paper not found', {
          description: 'No question paper found with that code.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    searchPaper();
  }, [paperCode]);
  
  const handleViewPaper = () => {
    if (paper) {
      navigate(`/question-papers/${paper._id}`);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={handleBack}
        className="px-3 py-1 mb-6 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        Back to Dashboard
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      {isLoading ? (
        <div className="text-center p-8">
          <div className="mb-4">Searching for paper code: {paperCode}...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-medium mb-2">Paper Not Found</h3>
          <p>{error}</p>
        </div>
      ) : paper ? (
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-3">{paper.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium block text-gray-500">Paper Code</span>
              <span>{paper.paperCode}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium block text-gray-500">Difficulty</span>
              <span>{paper.difficulty}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium block text-gray-500">Time to Solve</span>
              <span>{paper.time_to_solve}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium block text-gray-500">Questions</span>
              <span>{paper.questions.length}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleViewPaper}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Question Paper
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p>Please enter a question paper code to search.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
