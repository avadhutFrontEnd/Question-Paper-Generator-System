
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSubject, updateSubject } from '../services/api';
import { Subject } from '../types';
import { toast } from '@/components/ui/sonner';

interface SubjectFormProps {
  subject?: Subject;
  onClose: () => void;
}

const COLORS = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Yellow', value: 'bg-yellow-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Pink', value: 'bg-pink-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Teal', value: 'bg-teal-500' },
  { label: 'Orange', value: 'bg-orange-500' },
];

const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onClose }) => {
  const [title, setTitle] = useState(subject?.title || '');
  const [description, setDescription] = useState(subject?.description || '');
  const [shortCode, setShortCode] = useState(subject?.shortCode || '');
  const [tags, setTags] = useState<string[]>(subject?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [colorCode, setColorCode] = useState(subject?.colorCode || 'bg-blue-500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!shortCode.trim()) {
        throw new Error('Short code is required');
      }
      
      const subjectData = {
        title,
        description,
        tags,
        colorCode,
        shortCode
      };
      
      if (subject) {
        await updateSubject(subject._id, subjectData);
        toast.success('Subject updated successfully');
      } else {
        await createSubject(subjectData as Omit<Subject, '_id'>);
        toast.success('Subject created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onClose();
    } catch (error) {
      toast.error('Failed to save subject', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="paper-container">
      <h2 className="text-2xl font-bold mb-6">{subject ? 'Edit Subject' : 'Add New Subject'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="e.g., Mathematics, React.js"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="shortCode" className="block text-sm font-medium mb-1">Short Code *</label>
          <input
            type="text"
            id="shortCode"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="form-input"
            placeholder="e.g., MATH, JS, REACT"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            A short code used for identifying this subject in paper codes (e.g., MATH, JS, REACT).
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[100px]"
            placeholder="Brief description about this subject..."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => setColorCode(color.value)}
                className={`w-8 h-8 rounded-full ${color.value} border-2 ${
                  colorCode === color.value ? 'border-black dark:border-white' : 'border-transparent'
                }`}
                aria-label={`Select ${color.label} color`}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="form-input flex-grow rounded-r-none"
              placeholder="Add tags..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
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
            {isSubmitting ? 'Saving...' : subject ? 'Save Changes' : 'Create Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;
