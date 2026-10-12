# Smart Research & Study Assistant 🎓🤖
> An AI-powered study companion inspired by Google's **NotebookLM**, powered by a Retrieval-Augmented Generation (**RAG**) pipeline, active recall tools, and the **MERN** stack.

---

## 🌟 Overview

**Smart Research & Study Assistant** transforms static learning materials (PDFs, lecture notes, research papers, custom text) into an interactive, source-grounded personal knowledge base. Every answer is backed by verifiable inline citations linked directly to uploaded documents.

### Key Objectives & Features:
1. **Multi-Format Ingestion**: Upload PDFs, raw text, or lecture notes. Text is chunked with overlapping windows and indexed into a vector store.
2. **Grounded RAG Conversational Engine**: RAG pipeline performs top-$K$ cosine similarity semantic retrieval and generates answers backed by inline citations `[Doc Title, p. X]`.
3. **Socratic Tutor Mode**: Toggleable active recall mode where the AI acts as a Socratic mentor, asking probing follow-up questions instead of giving immediate direct answers.
4. **Active-Recall AI Quiz Generator**: Auto-generates multiple choice questions (MCQs) with difficulty ratings and instant explanations.
5. **Spaced-Repetition Flashcards (SuperMemo SM-2)**: Interactive 3D flip card viewer with SM-2 algorithm intervals (`Again`, `Hard`, `Good`, `Easy`) for optimal memory retention.
6. **Audio Podcast Overview Generator**: Generates a 2-host conversational dialogue script (Alex & Maya) with browser Web Speech Synthesis audio playback.
7. **Collaborative Study Rooms**: Real-time room codes, link sharing, and active student participant badges.

---

## 👥 Project Team & Roles

- **Aishanya Tripathi**: AI & RAG Pipeline Architecture
- **Himanshu Gupta**: Backend API Services & Integration
- **Krishna Murari Mishra**: Frontend Development & UI Design System
- **Abhishek Kumar**: Data Store, Vector Search & Deployment Setup

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Speech Synthesis
- **Backend**: Node.js, Express, Multer, PDF-Parse, Gemini API (`@google/generative-ai`)
- **Data & Vector Store**: Custom Cosine Vector Engine, Persistent JSON Store / MongoDB

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & NPM

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` inside `server/` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note: If no API key is provided, the application automatically uses the built-in intelligent hybrid vector RAG generator.*

### 3. Run Application
```bash
# Runs both Server (port 5000) and Frontend (port 3000) concurrently
npm run dev
```

Open `http://localhost:3000` in your browser!

---

## 📑 API Endpoints Summary

| Endpoint | Method | Description |
|---|---|---|
| `/api/notebooks` | GET, POST | List & create study notebooks |
| `/api/notebooks/:id/sources/upload` | POST | Upload PDF/text document and process RAG chunks |
| `/api/notebooks/:id/chat` | POST | RAG Grounded Q&A search with citations & Socratic mode |
| `/api/notebooks/:id/quizzes/generate` | POST | Auto-generate active-recall MCQs |
| `/api/notebooks/:id/flashcards/generate` | POST | Auto-generate SM-2 spaced repetition flashcards |
| `/api/flashcards/:id/review` | POST | Record SM-2 recall rating (Again, Hard, Good, Easy) |
| `/api/notebooks/:id/audio-overview` | GET | Generate 2-host podcast audio dialogue script |
| `/api/study-rooms/join` | POST | Join collaborative study room |
