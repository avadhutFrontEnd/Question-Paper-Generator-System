
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SubjectForm from '../components/SubjectForm';
import TopicForm from '../components/TopicForm';
import { Subject } from '../types';

const Dashboard: React.FC = () => {
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { subjectId, topicId } = useParams();
  
  const handleAddSubject = () => {
    setShowSubjectForm(true);
    setSelectedSubject(null);
  };
  
  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowSubjectForm(true);
  };
  
  const handleAddTopic = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setShowTopicForm(true);
  };
  
  const handleCloseSubjectForm = () => {
    setShowSubjectForm(false);
    setSelectedSubject(null);
  };
  
  const handleCloseTopicForm = () => {
    setShowTopicForm(false);
    setActiveSubjectId(null);
  };
  
  const renderMainContent = () => {
    if (showSubjectForm) {
      return <SubjectForm subject={selectedSubject || undefined} onClose={handleCloseSubjectForm} />;
    }
    
    if (showTopicForm && activeSubjectId) {
      return <TopicForm subjectId={activeSubjectId} onClose={handleCloseTopicForm} />;
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Question Craft</h1>
        <p className="text-xl mb-8 max-w-lg">
          Create and manage subjects, topics, and question papers to master your learning journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-3">Subjects</h2>
            <p className="mb-4">Create subjects to organize your study materials.</p>
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Subject
            </button>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-3">Topics</h2>
            <p className="mb-4">Add topics within subjects to break down content.</p>
            <p className="text-sm text-gray-500">
              Use the sidebar to add topics to a subject.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-3">Question Papers</h2>
            <p className="mb-4">Create question papers with JSON to test your knowledge.</p>
            <p className="text-sm text-gray-500">
              Navigate to a topic in the sidebar to add a question paper.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar 
        onAddSubject={handleAddSubject} 
        onAddTopic={handleAddTopic}
        onEditSubject={handleEditSubject}
      />
      <div className="flex-1 overflow-auto">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Dashboard;
