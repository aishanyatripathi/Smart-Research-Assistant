export interface Notebook {
  id: string;
  title: string;
  description?: string;
  category?: string;
  updatedAt: string;
  sourcesCount: number;
}

export interface Source {
  id: string;
  notebookId: string;
  title: string;
  type: 'pdf' | 'text' | 'note';
  active: boolean;
  chunkCount: number;
  createdAt: string;
  content: string;
}

export interface Citation {
  docTitle: string;
  pageNumber: number;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  notebookId: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  socraticMode?: boolean;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Flashcard {
  id: string;
  notebookId: string;
  docTitle: string;
  front: string;
  back: string;
  category: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: string;
}

export interface AudioScriptTurn {
  speaker: string;
  avatar: string;
  text: string;
}

export interface AudioOverview {
  title: string;
  duration: string;
  hosts: string[];
  script: AudioScriptTurn[];
}

export interface StudyRoom {
  id: string;
  code: string;
  name: string;
  host: string;
  participants: string[];
  activeNotebookId: string;
}
