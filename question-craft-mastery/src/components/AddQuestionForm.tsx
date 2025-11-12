
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { addQuestionToPaper } from '../services/api';
import { toast } from '@/components/ui/sonner';

interface AddQuestionFormProps {
  paperId: string;
  onClose: () => void;
}

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const CATEGORY_OPTIONS = [
  'Theory (MCQ)',
  'Code Question (Non-MCQ)',
  'Code Snippet Output Guess (MCQ)',
  'Note',
  'Fact'
];

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ paperId, onClose }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('Theory (MCQ)');
  const [timeToSolve, setTimeToSolve] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [instructions, setInstructions] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (answer === options[index]) {
      setAnswer('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!title.trim()) {
        throw new Error('Question title is required');
      }
      
      if (!timeToSolve.trim()) {
        throw new Error('Time to solve is required');
      }
      
      // Check if MCQ and validate options
      const isMCQ = category !== 'Code Question (Non-MCQ)';
      if (isMCQ) {
        // Filter out empty options
        const validOptions = options.filter(opt => opt.trim() !== '');
        
        if (validOptions.length < 2) {
          throw new Error('MCQ questions must have at least 2 options');
        }
        
        if (!answer.trim()) {
          throw new Error('Please select the correct answer');
        }
        
        if (!validOptions.includes(answer)) {
          throw new Error('The answer must be one of the options');
        }
      }
      
      const questionData = {
        title,
        difficulty,
        category,
        time_to_solve: timeToSolve,
        ...(isMCQ && { options: options.filter(opt => opt.trim() !== '') }),
        ...(isMCQ && { answer }),
        ...(instructions && { instructions }),
        ...(explanation && { explanation }),
      };
      
      await addQuestionToPaper(paperId, questionData);
      queryClient.invalidateQueries({ queryKey: ['questionPaper', paperId] });
      toast.success('Question added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add question', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isMCQ = category !== 'Code Question (Non-MCQ)';
  
  return (
    <div className="paper-container">
      <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">Question Title/Text *</label>
          <textarea
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input min-h-[100px]"
            placeholder="Enter the question text..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use markdown or HTML for formatting code snippets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Difficulty *</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-input"
              required
            >
              {DIFFICULTY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              required
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="timeToSolve" className="block text-sm font-medium mb-1">Time to Solve *</label>
            <input
              type="text"
              id="timeToSolve"
              value={timeToSolve}
              onChange={(e) => setTimeToSolve(e.target.value)}
              className="form-input"
              placeholder="e.g., 2 minutes"
              required
            />
          </div>
        </div>
        
        {isMCQ && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Options *</label>
            
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  id={`option-${index}`}
                  checked={answer === option}
                  onChange={() => setAnswer(option)}
                  className="mr-2"
                  disabled={!option.trim()}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="form-input flex-grow"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  disabled={options.length <= 2}
                >
                  ×
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addOption}
              className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              + Add Option
            </button>
            
            <p className="text-xs text-gray-500 mt-1">
              Select the radio button next to the correct answer
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="instructions" className="block text-sm font-medium mb-1">Instructions (Optional)</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="form-input"
            placeholder="Enter any special instructions for this question..."
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="explanation" className="block text-sm font-medium mb-1">Explanation (Optional)</label>
          <textarea
            id="explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="form-input"
            placeholder="Enter an explanation for the correct answer..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be shown to users after they answer the question
          </p>
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
            {isSubmitting ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionForm;
