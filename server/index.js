import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import path from 'path';
import { fileURLToPath } from 'url';
import { RAGEngine } from './services/ragEngine.js';
import { db } from './services/dbStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Multer memory storage for PDF & file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

const ragEngine = new RAGEngine(process.env.GEMINI_API_KEY);

// API Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Smart Research & Study Assistant API',
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

// --- NOTEBOOKS API ---
app.get('/api/notebooks', (req, res) => {
  res.json(db.getNotebooks());
});

app.post('/api/notebooks', (req, res) => {
  const { title, description, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const newNb = db.createNotebook({ title, description, category });
  res.status(201).json(newNb);
});

// --- SOURCES API (Document Ingestion & Chunking) ---
app.get('/api/notebooks/:notebookId/sources', (req, res) => {
  const sources = db.getSources(req.params.notebookId);
  res.json(sources);
});

app.post('/api/notebooks/:notebookId/sources/upload', upload.single('file'), async (req, res) => {
  try {
    const { notebookId } = req.params;
    let textContent = '';
    let title = req.body.title || 'Untitled Document';
    let type = 'text';

    if (req.file) {
      title = req.file.originalname;
      if (req.file.mimetype === 'application/pdf' || title.endsWith('.pdf')) {
        type = 'pdf';
        try {
          const parsed = await pdfParse(req.file.buffer);
          textContent = parsed.text;
        } catch (pdfErr) {
          console.warn('PDF parsing warning:', pdfErr.message);
          textContent = req.file.buffer.toString('utf-8');
        }
      } else {
        textContent = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.content) {
      textContent = req.body.content;
      type = 'text';
    } else {
      return res.status(400).json({ error: 'No file or content uploaded' });
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ error: 'Document text content is empty' });
    }

    // Process RAG chunking
    const chunks = ragEngine.chunkText(textContent, 500, 100);

    const newSource = db.addSource({
      notebookId,
      title,
      type,
      content: textContent,
      chunkCount: chunks.length
    });

    res.status(201).json(newSource);
  } catch (err) {
    console.error('Error uploading source:', err);
    res.status(500).json({ error: 'Failed to process document upload' });
  }
});

app.patch('/api/sources/:sourceId/toggle', (req, res) => {
  const updated = db.toggleSource(req.params.sourceId);
  if (!updated) return res.status(404).json({ error: 'Source not found' });
  res.json(updated);
});

app.delete('/api/sources/:sourceId', (req, res) => {
  const success = db.deleteSource(req.params.sourceId);
  if (!success) return res.status(404).json({ error: 'Source not found' });
  res.json({ message: 'Source deleted successfully' });
});

// --- RAG CONVERSATIONAL CHAT ENGINE ---
app.get('/api/notebooks/:notebookId/chats', (req, res) => {
  res.json(db.getChats(req.params.notebookId));
});

app.post('/api/notebooks/:notebookId/chat', async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { question, socraticMode = false } = req.body;

    if (!question) return res.status(400).json({ error: 'Question parameter is required' });

    // Save user message
    db.addChat({ notebookId, sender: 'user', text: question });

    // Get active sources for this notebook
    const sources = db.getSources(notebookId).filter(s => s.active);

    if (sources.length === 0) {
      const responseMsg = {
        notebookId,
        sender: 'ai',
        text: '⚠️ No active sources found in this notebook. Please upload or enable at least one document source to get grounded responses.',
        citations: []
      };
      db.addChat(responseMsg);
      return res.json(responseMsg);
    }

    // Flatten all chunks from active sources
    const allChunks = [];
    sources.forEach(src => {
      const chunks = ragEngine.chunkText(src.content, 500, 100);
      chunks.forEach((chunkContent, idx) => {
        allChunks.push({
          docTitle: src.title,
          pageNumber: Math.floor(idx / 3) + 1,
          content: chunkContent
        });
      });
    });

    // RAG Semantic Vector Search
    const topChunks = ragEngine.retrieveContext(question, allChunks, 4);

    // RAG Answer Generation with Citations
    const ragResult = await ragEngine.generateAnswer({
      query: question,
      contextChunks: topChunks,
      socraticMode
    });

    const aiMessage = db.addChat({
      notebookId,
      sender: 'ai',
      text: ragResult.answer,
      citations: ragResult.citations,
      socraticMode
    });

    res.json(aiMessage);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
});

// --- ACTIVE RECALL: QUIZ GENERATOR API ---
app.get('/api/notebooks/:notebookId/quizzes', (req, res) => {
  res.json(db.getQuizzes(req.params.notebookId));
});

app.post('/api/notebooks/:notebookId/quizzes/generate', async (req, res) => {
  try {
    const { notebookId } = req.params;
    const sources = db.getSources(notebookId).filter(s => s.active);

    if (sources.length === 0) {
      return res.status(400).json({ error: 'Please enable at least one document source to generate a quiz.' });
    }

    const allChunks = [];
    sources.forEach(src => {
      const chunks = ragEngine.chunkText(src.content, 500, 100);
      chunks.forEach((c) => allChunks.push({ docTitle: src.title, content: c }));
    });

    const quizQuestions = await ragEngine.generateQuiz(allChunks, 4);
    const saved = db.saveQuiz(notebookId, quizQuestions);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Quiz error:', err);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// --- ACTIVE RECALL: FLASHCARDS (SM-2) API ---
app.get('/api/notebooks/:notebookId/flashcards', (req, res) => {
  let cards = db.getFlashcards(req.params.notebookId);
  res.json(cards);
});

app.post('/api/notebooks/:notebookId/flashcards/generate', async (req, res) => {
  try {
    const { notebookId } = req.params;
    const sources = db.getSources(notebookId).filter(s => s.active);

    if (sources.length === 0) {
      return res.status(400).json({ error: 'Please enable at least one document source to generate flashcards.' });
    }

    const allChunks = [];
    sources.forEach(src => {
      const chunks = ragEngine.chunkText(src.content, 500, 100);
      chunks.forEach((c) => allChunks.push({ docTitle: src.title, content: c }));
    });

    const generatedCards = await ragEngine.generateFlashcards(allChunks, 5);
    const saved = db.saveFlashcards(notebookId, generatedCards);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Flashcard error:', err);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

app.post('/api/flashcards/:cardId/review', (req, res) => {
  const { rating } = req.body; // 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
  if (rating === undefined) return res.status(400).json({ error: 'Rating is required' });

  const updated = db.updateFlashcardSM2(req.params.cardId, Number(rating));
  if (!updated) return res.status(404).json({ error: 'Flashcard not found' });
  res.json(updated);
});

// --- AUDIO OVERVIEW (PODCAST DEEP DIVE) API ---
app.get('/api/notebooks/:notebookId/audio-overview', async (req, res) => {
  try {
    const { notebookId } = req.params;
    const sources = db.getSources(notebookId).filter(s => s.active);

    if (sources.length === 0) {
      return res.status(400).json({ error: 'Please upload document sources to generate an audio overview.' });
    }

    const allChunks = [];
    sources.forEach(src => {
      const chunks = ragEngine.chunkText(src.content, 500, 100);
      chunks.forEach((c) => allChunks.push({ docTitle: src.title, content: c }));
    });

    const overview = await ragEngine.generateAudioOverview(allChunks);
    res.json(overview);
  } catch (err) {
    console.error('Audio overview error:', err);
    res.status(500).json({ error: 'Failed to generate audio overview' });
  }
});

// --- STUDY ROOMS COLLABORATION API ---
app.get('/api/study-rooms', (req, res) => {
  res.json(db.getStudyRooms());
});

app.post('/api/study-rooms/join', (req, res) => {
  const { code, userName } = req.body;
  if (!code || !userName) return res.status(400).json({ error: 'Room code and user name required' });
  const room = db.joinStudyRoom(code, userName);
  if (!room) return res.status(404).json({ error: 'Room code not found' });
  res.json(room);
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Research & Study Assistant Backend running on http://localhost:${PORT}`);
});
