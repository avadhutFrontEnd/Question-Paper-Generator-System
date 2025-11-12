
import { Subject, Topic, QuestionPaper, Attempt, Question } from '../types';

const API_URL = 'http://localhost:5000/api';

// Subjects API
export const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await fetch(`${API_URL}/subjects`);
  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }
  return response.json();
};

export const fetchSubjectById = async (id: string): Promise<Subject> => {
  const response = await fetch(`${API_URL}/subjects/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch subject');
  }
  return response.json();
};

export const createSubject = async (subject: Omit<Subject, '_id'>): Promise<Subject> => {
  const response = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subject),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create subject');
  }
  return response.json();
};

export const updateSubject = async (id: string, subject: Partial<Subject>): Promise<Subject> => {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subject),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update subject');
  }
  return response.json();
};

export const deleteSubject = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete subject');
  }
};

// Topics API
export const fetchTopics = async (): Promise<Topic[]> => {
  const response = await fetch(`${API_URL}/topics`);
  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }
  return response.json();
};

export const fetchTopicById = async (id: string): Promise<Topic> => {
  const response = await fetch(`${API_URL}/topics/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch topic');
  }
  return response.json();
};

export const fetchTopicsBySubject = async (subjectId: string): Promise<Topic[]> => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/topics`);
  if (!response.ok) {
    throw new Error('Failed to fetch topics for subject');
  }
  return response.json();
};

export const createTopic = async (subjectId: string, topic: Omit<Topic, '_id' | 'subject'>): Promise<Topic> => {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(topic),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create topic');
  }
  return response.json();
};

export const updateTopic = async (id: string, topic: Partial<Topic>): Promise<Topic> => {
  const response = await fetch(`${API_URL}/topics/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(topic),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update topic');
  }
  return response.json();
};

export const deleteTopic = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/topics/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete topic');
  }
};

export const incrementLastPaperId = async (topicId: string): Promise<Topic> => {
  const response = await fetch(`${API_URL}/topics/${topicId}/increment-paper-id`, {
    method: 'PUT',
  });
  
  if (!response.ok) {
    throw new Error('Failed to increment paper ID');
  }
  return response.json();
};

// Question Papers API
export const fetchQuestionPapers = async (): Promise<QuestionPaper[]> => {
  const response = await fetch(`${API_URL}/question-papers`);
  if (!response.ok) {
    throw new Error('Failed to fetch question papers');
  }
  return response.json();
};

export const fetchQuestionPaperById = async (id: string): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch question paper');
  }
  return response.json();
};

export const fetchQuestionPaperByCode = async (code: string): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/code/${code}`);
  if (!response.ok) {
    throw new Error('Failed to fetch question paper by code');
  }
  return response.json();
};

export const fetchQuestionPapersByTopic = async (topicId: string): Promise<QuestionPaper[]> => {
  const response = await fetch(`${API_URL}/topics/${topicId}/question-papers`);
  if (!response.ok) {
    throw new Error('Failed to fetch question papers for topic');
  }
  return response.json();
};

export const createQuestionPaper = async (
  topicId: string, 
  questionPaper: Omit<QuestionPaper, '_id' | 'topic' | 'subject' | 'paperCode'>
): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/topics/${topicId}/question-papers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionPaper),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create question paper');
  }
  return response.json();
};

export const updateQuestionPaper = async (id: string, questionPaper: Partial<QuestionPaper>): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionPaper),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update question paper');
  }
  return response.json();
};

export const deleteQuestionPaper = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/question-papers/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete question paper');
  }
};

export const addQuestionToPaper = async (paperId: string, question: Question): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/${paperId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(question),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add question to paper');
  }
  return response.json();
};

export const updateQuestionUserNote = async (
  paperId: string, 
  questionIndex: number, 
  userNote: string
): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/${paperId}/questions/${questionIndex}/note`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userNote }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update question note');
  }
  return response.json();
};

export const recordAttempt = async (paperId: string, attempt: Attempt): Promise<QuestionPaper> => {
  const response = await fetch(`${API_URL}/question-papers/${paperId}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attempt),
  });
  
  if (!response.ok) {
    throw new Error('Failed to record attempt');
  }
  return response.json();
};
