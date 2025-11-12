
export interface Subject {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  colorCode?: string;
  icon?: string;
  shortCode: string;
  createdAt?: string;
}

export interface Topic {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  rating: number;
  subject: string;
  shortCode: string;
  lastPaperId: number;
  createdAt?: string;
}

export interface Question {
  title: string;
  difficulty: string;
  category: string;
  time_to_solve: string;
  options?: string[];
  answer?: string;
  instructions?: string;
  note?: string;
  userNote?: string;
  explanation?: string;
}

export interface QuestionPaper {
  _id: string;
  title: string;
  difficulty: string;
  time_to_solve: string;
  subject: string;
  topic: string;
  paperCode: string;
  link?: string;
  questions: Question[];
  attempts?: Attempt[];
}

export interface QuestionAttempt {
  questionIndex: number;
  selectedOption: string;
  isCorrect: boolean;
}

export interface Attempt {
  startTime: string;
  endTime: string;
  questionsAttempted?: number;
  questionsCorrect?: number;
  duration?: number;
  score: number;
  answers?: QuestionAttempt[];
}
