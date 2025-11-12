
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createQuestionPaper } from '../services/api';
import { toast } from '@/components/ui/sonner';

interface QuestionPaperFormProps {
  topicId: string;
  onClose: () => void;
}

interface JsonErrors {
  structure?: string;
  parse?: string;
}

const QuestionPaperForm: React.FC<QuestionPaperFormProps> = ({ topicId, onClose }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<JsonErrors>({});
  
  const queryClient = useQueryClient();
  
  const validateJsonStructure = (data: any): boolean => {
    const errors: JsonErrors = {};
    
    // Check for required paper-level fields
    if (!data.title || typeof data.title !== 'string') {
      errors.structure = 'Paper title is required and must be a string';
      return false;
    }
    
    if (!data.difficulty || typeof data.difficulty !== 'string') {
      errors.structure = 'Paper difficulty is required and must be a string';
      return false;
    }
    
    if (!data.time_to_solve || typeof data.time_to_solve !== 'string') {
      errors.structure = 'Paper time_to_solve is required and must be a string';
      return false;
    }
    
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      errors.structure = 'Paper must include at least one question';
      return false;
    }
    
    // Check each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      
      if (!q.title || typeof q.title !== 'string') {
        errors.structure = `Question ${i + 1} must have a title string`;
        return false;
      }
      
      if (!q.difficulty || typeof q.difficulty !== 'string') {
        errors.structure = `Question ${i + 1} must have a difficulty string`;
        return false;
      }
      
      if (!q.category || typeof q.category !== 'string') {
        errors.structure = `Question ${i + 1} must have a category string`;
        return false;
      }
      
      if (!q.time_to_solve || typeof q.time_to_solve !== 'string') {
        errors.structure = `Question ${i + 1} must have a time_to_solve string`;
        return false;
      }
      
      // Check for MCQ questions
      if (q.category !== 'Code Question (Non-MCQ)') {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.structure = `Question ${i + 1} must have at least two options`;
          return false;
        }
        
        if (!q.answer || typeof q.answer !== 'string') {
          errors.structure = `Question ${i + 1} must have an answer`;
          return false;
        }
        
        if (!q.options.includes(q.answer)) {
          errors.structure = `Question ${i + 1}'s answer must be one of its options`;
          return false;
        }
      }
    }
    
    setJsonErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setJsonErrors({});
    
    try {
      // Parse JSON
      let questionPaperData;
      try {
        questionPaperData = JSON.parse(jsonInput);
      } catch (error) {
        setJsonErrors({ parse: 'Invalid JSON format' });
        setIsSubmitting(false);
        return;
      }
      
      // Validate JSON structure
      if (!validateJsonStructure(questionPaperData)) {
        setIsSubmitting(false);
        return;
      }
      
      // Add link to the data
      const paperData = {
        ...questionPaperData,
        link: link.trim(),
      };
      
      // Submit question paper
      await createQuestionPaper(topicId, paperData);
      toast.success('Question paper created successfully');
      
      queryClient.invalidateQueries({ queryKey: ['questionPapers', topicId] });
      onClose();
    } catch (error) {
      toast.error('Failed to create question paper', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="paper-container">
      <h2 className="text-2xl font-bold mb-6">Add New Question Paper</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium mb-1">Link (Optional)</label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="form-input"
            placeholder="https://chat.openai.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Link to the original conversation where the question paper was generated
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="jsonInput" className="block text-sm font-medium mb-1">JSON Input *</label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="form-input min-h-[300px] font-mono text-sm"
            placeholder='Paste JSON here...'
            required
          />
          
          {jsonErrors.parse && (
            <p className="text-sm text-red-500 mt-1">{jsonErrors.parse}</p>
          )}
          
          {jsonErrors.structure && (
            <p className="text-sm text-red-500 mt-1">{jsonErrors.structure}</p>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            <p>Paper code will be automatically generated following this format: #_SUBJECT-TOPIC-ID_</p>
            <p className="mt-1">The JSON should include the following structure:</p>
            <pre className="code-block mt-2 text-xs">
{`{
  "title": "Question Paper Title",
  "difficulty": "Easy/Medium/Hard",
  "time_to_solve": "30 minutes",
  "questions": [
    {
      "title": "Question text",
      "difficulty": "Easy",
      "category": "MCQ/Code Question/etc",
      "time_to_solve": "5 minutes",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Option 2"
    },
    // more questions...
  ]
}`}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Question Paper'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionPaperForm;
