import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'db_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed demo data
const initialData = {
  users: [
    {
      id: 'usr-1',
      name: 'Aishanya Tripathi',
      email: 'aishanya@rgit.edu',
      role: 'Lead Researcher & AI Engineer'
    }
  ],
  notebooks: [
    {
      id: 'nb-1',
      title: 'Smart Research & Study Assistant',
      description: 'NotebookLM-inspired RAG companion with active recall, flashcards, quizzes & Socratic tutor.',
      category: 'Computer Science & AI',
      updatedAt: new Date().toISOString(),
      sourcesCount: 2
    },
    {
      id: 'nb-2',
      title: 'Deep Learning & Neural Networks',
      description: 'Convolutional neural networks, U-Net architecture, image segmentation & loss functions.',
      category: 'Machine Learning',
      updatedAt: new Date().toISOString(),
      sourcesCount: 1
    }
  ],
  sources: [
    {
      id: 'src-1',
      notebookId: 'nb-1',
      title: 'Smart_Research_Assistant_Project_Overview.pdf',
      type: 'pdf',
      active: true,
      chunkCount: 6,
      createdAt: new Date().toISOString(),
      content: `Smart Research & Study Assistant is an AI-powered study companion inspired by Google's NotebookLM. Learners upload their own material — textbooks, lecture notes, research papers — and interact with it conversationally instead of searching through pages manually. At its core is a Retrieval-Augmented Generation (RAG) pipeline: every answer is grounded in the uploaded content and returned with citations, so learners get source-backed answers instead of generic ones — turning static documents into an interactive, personal knowledge base.

Objectives and Key Features:
1. Multi-format ingestion: Let users upload and organize study material (PDFs, notes, documents) into notebooks.
2. Grounded, cited answers: Use a RAG pipeline so every response is backed by the source material, not guesswork.
3. Active-recall learning tools: Turn content into AI chat, auto-generated quizzes, and spaced-repetition flashcards.
4. Secure, scalable access: Protect notebooks with JWT and OAuth, backed by a production-ready stack.
5. Collaborative study rooms: Multiple students share a notebook, chat threads, and flashcard decks in real time.
6. Socratic / debate tutor mode: Instead of just answering questions, the AI asks probing follow-up questions to test understanding.`
    },
    {
      id: 'src-2',
      notebookId: 'nb-1',
      title: 'RAG_Pipeline_Technical_Architecture.txt',
      type: 'text',
      active: true,
      chunkCount: 4,
      createdAt: new Date().toISOString(),
      content: `Retrieval-Augmented Generation (RAG) Pipeline Architecture:
1. Ingestion Phase: Documents are ingested, text is extracted and divided into overlapping chunks of 500 characters with 100 character overlap.
2. Vector Indexing: Embeddings are calculated for each chunk and indexed into a vector store.
3. Query Processing & Semantic Retrieval: User questions are tokenized and scored against stored chunk vectors using cosine similarity search. Top-K relevant contexts are fetched.
4. Prompt Augmentation & Citation Indexing: The LLM system prompt is injected with retrieved chunk contexts. Answers are formatted with explicit bracketed citations [Source Name, Chunk ID].
5. Active Recall Generation: The indexed contexts are also supplied to specialized prompt generators for interactive MCQs, spaced repetition flashcards (SM-2 algorithm), and podcast script audio overviews.`
    }
  ],
  chats: [
    {
      id: 'chat-1',
      notebookId: 'nb-1',
      sender: 'ai',
      text: 'Hello! I am your **Smart Research & Study Assistant**. I have processed your uploaded materials. You can ask me questions, toggle Socratic Tutor mode, generate quizzes, or review flashcards!',
      citations: [],
      timestamp: new Date().toISOString()
    }
  ],
  quizzes: [],
  flashcards: [],
  studyRooms: [
    {
      id: 'room-101',
      code: 'STUDY-7892',
      name: 'AI & RAG Exam Prep Room',
      host: 'Aishanya Tripathi',
      participants: ['Aishanya Tripathi', 'Himanshu Gupta', 'Krishna Murari Mishra', 'Abhishek Kumar'],
      activeNotebookId: 'nb-1'
    }
  ]
};

class DBStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileData);
      }
    } catch (e) {
      console.warn('Error reading db_store.json, using initial seed:', e.message);
    }
    this.saveData(initialData);
    return initialData;
  }

  saveData(data = this.data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db_store.json:', e.message);
    }
  }

  getNotebooks() {
    return this.data.notebooks;
  }

  getNotebookById(id) {
    return this.data.notebooks.find(n => n.id === id);
  }

  createNotebook(notebook) {
    const newNb = {
      id: `nb-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      sourcesCount: 0,
      ...notebook
    };
    this.data.notebooks.unshift(newNb);
    this.saveData();
    return newNb;
  }

  getSources(notebookId) {
    return this.data.sources.filter(s => s.notebookId === notebookId);
  }

  addSource(source) {
    const newSrc = {
      id: `src-${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true,
      ...source
    };
    this.data.sources.push(newSrc);
    
    // Update notebook source count
    const nb = this.getNotebookById(source.notebookId);
    if (nb) {
      nb.sourcesCount = (nb.sourcesCount || 0) + 1;
      nb.updatedAt = new Date().toISOString();
    }
    this.saveData();
    return newSrc;
  }

  toggleSource(sourceId) {
    const src = this.data.sources.find(s => s.id === sourceId);
    if (src) {
      src.active = !src.active;
      this.saveData();
    }
    return src;
  }

  deleteSource(sourceId) {
    const idx = this.data.sources.findIndex(s => s.id === sourceId);
    if (idx !== -1) {
      const deleted = this.data.sources.splice(idx, 1)[0];
      const nb = this.getNotebookById(deleted.notebookId);
      if (nb && nb.sourcesCount > 0) {
        nb.sourcesCount -= 1;
      }
      this.saveData();
      return true;
    }
    return false;
  }

  getChats(notebookId) {
    return this.data.chats.filter(c => c.notebookId === notebookId);
  }

  addChat(chat) {
    const newChat = {
      id: `chat-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...chat
    };
    this.data.chats.push(newChat);
    this.saveData();
    return newChat;
  }

  getQuizzes(notebookId) {
    return this.data.quizzes.filter(q => q.notebookId === notebookId);
  }

  saveQuiz(notebookId, quizData) {
    const entry = {
      id: `qz-${Date.now()}`,
      notebookId,
      createdAt: new Date().toISOString(),
      questions: quizData
    };
    this.data.quizzes.unshift(entry);
    this.saveData();
    return entry;
  }

  getFlashcards(notebookId) {
    return this.data.flashcards.filter(f => f.notebookId === notebookId);
  }

  saveFlashcards(notebookId, cards) {
    cards.forEach(card => {
      card.notebookId = notebookId;
      this.data.flashcards.push(card);
    });
    this.saveData();
    return this.getFlashcards(notebookId);
  }

  updateFlashcardSM2(cardId, rating) {
    const card = this.data.flashcards.find(f => f.id === cardId);
    if (!card) return null;

    // SuperMemo SM-2 Spaced Repetition Algorithm
    // rating: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
    let q = rating + 2; // Map 0-3 to 2-5 quality scale
    let { interval, repetition, easeFactor } = card;

    if (q >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    } else {
      repetition = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    card.interval = interval;
    card.repetition = repetition;
    card.easeFactor = easeFactor;
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    card.dueDate = nextDate.toISOString();

    this.saveData();
    return card;
  }

  getStudyRooms() {
    return this.data.studyRooms;
  }

  joinStudyRoom(code, userName) {
    const room = this.data.studyRooms.find(r => r.code === code || r.id === code);
    if (room && userName && !room.participants.includes(userName)) {
      room.participants.push(userName);
      this.saveData();
    }
    return room;
  }
}

export const db = new DBStore();
