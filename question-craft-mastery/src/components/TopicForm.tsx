
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createTopic, updateTopic } from '../services/api';
import { Topic } from '../types';
import { toast } from '@/components/ui/sonner';

interface TopicFormProps {
  subjectId: string;
  topic?: Topic;
  onClose: () => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ subjectId, topic, onClose }) => {
  const [title, setTitle] = useState(topic?.title || '');
  const [description, setDescription] = useState(topic?.description || '');
  const [shortCode, setShortCode] = useState(topic?.shortCode || '');
  const [tags, setTags] = useState<string[]>(topic?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [rating, setRating] = useState(topic?.rating || 1);
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
      
      const topicData = {
        title,
        description,
        tags,
        rating,
        shortCode,
        lastPaperId: topic?.lastPaperId || 0,
      };
      
      if (topic) {
        await updateTopic(topic._id, topicData);
        toast.success('Topic updated successfully');
      } else {
        await createTopic(subjectId, topicData);
        toast.success('Topic created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['topics', subjectId] });
      onClose();
    } catch (error) {
      toast.error('Failed to save topic', {
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
      <h2 className="text-2xl font-bold mb-6">{topic ? 'Edit Topic' : 'Add New Topic'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="e.g., Algebra, Component Lifecycle"
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
            placeholder="e.g., ALG, COMP, HOOKS"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            A short code used for identifying this topic in paper codes (e.g., ALG, HOOKS, ARR).
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[100px]"
            placeholder="Brief description about this topic..."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Importance Rating (1-5)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full max-w-xs"
            />
            <span className="ml-3 text-yellow-500">
              {[...Array(rating)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </span>
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
            {isSubmitting ? 'Saving...' : topic ? 'Save Changes' : 'Create Topic'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicForm;
