
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSubjects, fetchTopicsBySubject, fetchQuestionPapersByTopic } from '../services/api';
import { Subject, Topic, QuestionPaper } from '../types';
import { Plus, Edit, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const SubjectItem: React.FC<{
  subject: Subject;
  onAddTopic: (subjectId: string) => void;
  onEditSubject: (subject: Subject) => void;
}> = ({ subject, onAddTopic, onEditSubject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['topics', subject._id],
    queryFn: () => fetchTopicsBySubject(subject._id),
    enabled: isExpanded,
  });

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const subjectColor = subject.colorCode || 'bg-blue-500';

  return (
    <div className="mb-1">
      <div className="flex items-center p-2 hover:bg-sidebar-accent rounded-md group transition-colors">
        <span 
          className={`h-3 w-3 rounded-full mr-2 ${subjectColor}`}
          aria-hidden="true"
        />
        
        <button 
          onClick={toggleExpand}
          className="flex items-center flex-grow text-left"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 
            <ChevronDown className="h-4 w-4 mr-1" /> : 
            <ChevronRight className="h-4 w-4 mr-1" />
          }
          <span className="font-medium truncate">{subject.title}</span>
        </button>
        
        <div className="hidden group-hover:flex items-center space-x-1">
          <button 
            onClick={() => onEditSubject(subject)}
            className="p-1 rounded-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            aria-label={`Edit ${subject.title}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => onAddTopic(subject._id)}
            className="p-1 rounded-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            aria-label={`Add topic to ${subject.title}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="ml-7 mt-1 space-y-1">
          {isLoading ? (
            <div className="text-sm text-muted-foreground p-2">Loading...</div>
          ) : error ? (
            <div className="text-sm text-destructive p-2">Failed to load topics</div>
          ) : topics.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2">No topics yet</div>
          ) : (
            topics.map((topic) => (
              <TopicItem 
                key={topic._id} 
                topic={topic} 
                subjectId={subject._id} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const TopicItem: React.FC<{
  topic: Topic;
  subjectId: string;
}> = ({ topic, subjectId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: questionPapers = [], isLoading, error } = useQuery({
    queryKey: ['questionPapers', topic._id],
    queryFn: () => fetchQuestionPapersByTopic(topic._id),
    enabled: isExpanded,
  });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="text-yellow-500">★</span>);
    }
    return <span className="ml-1 text-xs">{stars}</span>;
  };

  return (
    <div className="mb-1">
      <div className="flex items-center p-1 pl-0 hover:bg-sidebar-accent rounded-md group transition-colors">
        <button 
          onClick={toggleExpand}
          className="flex items-center flex-grow text-left"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 
            <ChevronDown className="h-3 w-3 mr-1" /> : 
            <ChevronRight className="h-3 w-3 mr-1" />
          }
          <span className="font-medium truncate text-sm">{topic.title}</span>
          {renderRatingStars(topic.rating)}
        </button>
        
        <div className="hidden group-hover:flex items-center">
          <Link 
            to={`/subjects/${subjectId}/topics/${topic._id}/add-paper`}
            className="p-1 rounded-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            aria-label={`Add question paper to ${topic.title}`}
          >
            <Plus className="h-3 w-3" />
          </Link>
        </div>
      </div>
      
      {isExpanded && (
        <div className="ml-5 mt-1 space-y-1">
          {isLoading ? (
            <div className="text-xs text-muted-foreground p-1">Loading...</div>
          ) : error ? (
            <div className="text-xs text-destructive p-1">Failed to load papers</div>
          ) : questionPapers.length === 0 ? (
            <div className="text-xs text-muted-foreground p-1">No papers yet</div>
          ) : (
            questionPapers.map((paper) => (
              <QuestionPaperItem 
                key={paper._id} 
                paper={paper}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const QuestionPaperItem: React.FC<{
  paper: QuestionPaper;
}> = ({ paper }) => {
  return (
    <Link 
      to={`/question-papers/${paper._id}`}
      className="flex items-center p-1 rounded-md hover:bg-sidebar-accent text-xs"
    >
      <FileText className="h-3 w-3 mr-1" />
      <span className="truncate">{paper.title}</span>
    </Link>
  );
};

const Sidebar: React.FC<{
  onAddSubject: () => void;
  onAddTopic: (subjectId: string) => void;
  onEditSubject: (subject: Subject) => void;
}> = ({ onAddSubject, onAddTopic, onEditSubject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: subjects = [], isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  });

  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const paperCode = searchQuery.trim();
        // Redirect to the search results page
        window.location.href = `/search?code=${encodeURIComponent(paperCode)}`;
      } catch (error) {
        toast('No question paper found with that code', {
          description: 'Please check the code and try again',
        });
      }
    }
  };

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar h-screen flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Question Craft</h1>
          <button
            onClick={onAddSubject}
            className="p-1 rounded-md hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            aria-label="Add new subject"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search paper code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full py-1 px-3 rounded-md border border-sidebar-border bg-background focus:outline-none focus:ring-1 focus:ring-sidebar-ring text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow p-2">
        {isLoading ? (
          <div className="text-center p-4 text-muted-foreground">Loading subjects...</div>
        ) : error ? (
          <div className="text-center p-4 text-destructive">Failed to load subjects</div>
        ) : subjects.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No subjects yet. Click the + button to add one.
          </div>
        ) : (
          subjects.map((subject) => (
            <SubjectItem 
              key={subject._id} 
              subject={subject}
              onAddTopic={onAddTopic}
              onEditSubject={onEditSubject}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
