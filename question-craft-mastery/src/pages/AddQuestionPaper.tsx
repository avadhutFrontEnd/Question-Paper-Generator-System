
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTopicById } from '../services/api';
import QuestionPaperForm from '../components/QuestionPaperForm';
import { toast } from '@/components/ui/sonner';

const AddQuestionPaper: React.FC = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  
  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => fetchTopicById(topicId as string),
    enabled: !!topicId,
  });
  
  const handleClose = () => {
    navigate(`/`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (error || !topic) {
    toast.error('Failed to load topic details');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <div className="mb-4">Error loading topic. Please try again.</div>
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
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button
            onClick={handleClose}
            className="px-3 py-1 mr-3 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold">Add Question Paper to Topic: {topic.title}</h1>
        </div>
        <p className="text-gray-600">{topic.description}</p>
      </div>
      
      <QuestionPaperForm
        topicId={topicId as string}
        onClose={handleClose}
      />
    </div>
  );
};

export default AddQuestionPaper;
