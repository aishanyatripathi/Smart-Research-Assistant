import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple TF-IDF / N-gram cosine similarity vectorizer as offline / instant fallback
class LocalVectorSearch {
  static tokenize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  }

  static getTermFreqs(tokens) {
    const freqs = {};
    for (const token of tokens) {
      freqs[token] = (freqs[token] || 0) + 1;
    }
    return freqs;
  }

  static computeSimilarity(query, text) {
    const qTokens = this.tokenize(query);
    const tTokens = this.tokenize(text);
    if (qTokens.length === 0 || tTokens.length === 0) return 0;

    const qFreqs = this.getTermFreqs(qTokens);
    const tFreqs = this.getTermFreqs(tTokens);

    let dotProduct = 0;
    let qMagnitude = 0;
    let tMagnitude = 0;

    for (const token in qFreqs) {
      qMagnitude += qFreqs[token] * qFreqs[token];
    }
    for (const token in tFreqs) {
      tMagnitude += tFreqs[token] * tFreqs[token];
      if (qFreqs[token]) {
        dotProduct += qFreqs[token] * tFreqs[token];
      }
    }

    qMagnitude = Math.sqrt(qMagnitude);
    tMagnitude = Math.sqrt(tMagnitude);

    if (qMagnitude === 0 || tMagnitude === 0) return 0;
    
    // Bonus matching for consecutive exact keyword phrases
    let phraseBonus = 0;
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 3);
    for (const word of queryWords) {
      if (lowerText.includes(word)) {
        phraseBonus += 0.05;
      }
    }

    return (dotProduct / (qMagnitude * tMagnitude)) + phraseBonus;
  }
}

export class RAGEngine {
  constructor(apiKey = process.env.GEMINI_API_KEY) {
    this.apiKey = apiKey;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  // Recursive character text chunker with overlap
  chunkText(text, chunkSize = 500, chunkOverlap = 100) {
    const chunks = [];
    if (!text || typeof text !== 'string') return chunks;

    const cleanText = text.replace(/\r\n/g, '\n');
    let start = 0;

    while (start < cleanText.length) {
      let end = start + chunkSize;
      if (end >= cleanText.length) {
        end = cleanText.length;
      } else {
        // Try to break at paragraph or sentence boundary
        const nextBreak = cleanText.indexOf('\n\n', start + chunkSize - 50);
        const nextSentence = cleanText.indexOf('. ', start + chunkSize - 50);
        if (nextBreak !== -1 && nextBreak < end + 50) {
          end = nextBreak + 2;
        } else if (nextSentence !== -1 && nextSentence < end + 50) {
          end = nextSentence + 2;
        }
      }

      const chunkContent = cleanText.substring(start, end).trim();
      if (chunkContent.length > 20) {
        chunks.push(chunkContent);
      }

      if (end >= cleanText.length) break;
      start = Math.max(start + 1, end - chunkOverlap);
    }

    return chunks;
  }

  // Retrieve top k relevant context chunks across selected notebook sources
  retrieveContext(query, allChunks, topK = 4) {
    if (!allChunks || allChunks.length === 0) return [];

    const scored = allChunks.map((chunk, index) => {
      const score = LocalVectorSearch.computeSimilarity(query, chunk.content);
      return { ...chunk, score, index };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  // Generate grounded answer using Gemini or robust built-in smart RAG model
  async generateAnswer({ query, contextChunks, socraticMode = false, conversationHistory = [] }) {
    const formattedContext = contextChunks.map((c, i) => 
      `[Source: ${c.docTitle} (Page ${c.pageNumber || 1}, Chunk ${i + 1})]\n${c.content}`
    ).join('\n\n');

    const systemPrompt = socraticMode 
      ? `You are an expert Socratic Study Tutor inspired by NotebookLM. 
Your goal is to guide the student to discover answers themselves by asking probing follow-up questions, offering hints based strictly on their study materials, and testing active recall.
Do NOT just give direct final answers right away. Use the context provided to point out key concepts, ask 'Why' or 'How' questions, and help them reflect.
Always cite source documents using format [DocName, p. X].

Study Materials Context:
${formattedContext}`
      : `You are Smart Research & Study Assistant, an AI study companion inspired by Google's NotebookLM.
Answer the user's question accurately based STRICTLY on the uploaded source materials provided below.
Rules:
1. Ground every statement in the context provided.
2. Include exact inline citations using format [DocTitle, Chunk ID] or [DocTitle, p. X] whenever citing facts.
3. Use markdown formatting with bolding, bullet points, and clear sections.
4. If the information is not present in the sources, state clearly that it is not covered in the active notebook.

Study Materials Context:
${formattedContext}`;

    // Try Gemini API with multiple model fallbacks if key is configured
    if (this.genAI && this.apiKey) {
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
      for (const modelName of modelsToTry) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const prompt = `${systemPrompt}\n\nUser Question: ${query}`;
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text && text.trim().length > 0) {
            return {
              answer: text,
              citations: contextChunks.map(c => ({
                docTitle: c.docTitle,
                pageNumber: c.pageNumber || 1,
                excerpt: c.content.substring(0, 150) + '...'
              }))
            };
          }
        } catch (err) {
          console.warn(`Gemini model ${modelName} call failed, trying next:`, err.message);
        }
      }
    }

    // Built-in dynamic & interactive query-aware synthesis fallback
    let synthesis = '';
    const queryLower = query.toLowerCase();
    const primaryChunk = contextChunks[0] || { docTitle: 'Source Notes', pageNumber: 1, content: 'No active context available.' };

    // Extract sentences matching query terms for high precision
    const allSentences = contextChunks.flatMap(c => 
      c.content.split(/(?<=[.?!])\s+/).map(s => ({ sentence: s.trim(), docTitle: c.docTitle, pageNumber: c.pageNumber || 1 }))
    ).filter(item => item.sentence.length > 15);

    const relevantSentences = allSentences.filter(item => {
      const sLower = item.sentence.toLowerCase();
      const words = queryLower.split(/\s+/).filter(w => w.length > 3);
      return words.some(w => sLower.includes(w));
    });

    const selectedSentences = relevantSentences.length > 0 
      ? relevantSentences.slice(0, 3) 
      : allSentences.slice(0, 3);

    if (socraticMode) {
      synthesis = `### 💡 Socratic Tutor Reflection\n\n` +
        `Regarding your question **"${query}"**, let me point you to a key observation in **${primaryChunk.docTitle}**:\n\n` +
        `> "${selectedSentences[0]?.sentence || primaryChunk.content.substring(0, 180)}..." [${primaryChunk.docTitle}, p. ${primaryChunk.pageNumber}]\n\n` +
        `**Probing Questions to deepen your understanding:**\n` +
        `1. What fundamental principle connects this section to your broader study goal?\n` +
        `2. How would you explain the significance of this concept in your own words?\n\n` +
        `*💬 Type your thoughts below to continue our Socratic discussion!*`;
    } else if (queryLower.includes('summarize') || queryLower.includes('summary') || queryLower.includes('overview')) {
      synthesis = `### 📖 Executive Summary of Active Materials\n\n` +
        `Here are the core grounded insights addressing your query:\n\n` +
        selectedSentences.map((item, idx) => 
          `• **Key Point ${idx + 1}**: ${item.sentence} [${item.docTitle}, p. ${item.pageNumber}]`
        ).join('\n\n') +
        `\n\n---\n**Active Recall Tip**: You can generate flashcards or a quiz from the right sidebar to test your retention on these summary points!`;
    } else {
      synthesis = `### 🎯 Grounded Answer\n\n` +
        `In response to **"${query}"**, the source materials highlight the following key findings:\n\n` +
        selectedSentences.map((item, idx) => 
          `**${idx + 1}. ${item.docTitle} (Page ${item.pageNumber}):**\n` +
          `${item.sentence} [${item.docTitle}, p. ${item.pageNumber}]`
        ).join('\n\n') +
        `\n\n---\n*Source Backed*: All facts above are extracted directly from your active notebook documents.`;
    }

    return {
      answer: synthesis,
      citations: contextChunks.map(c => ({
        docTitle: c.docTitle,
        pageNumber: c.pageNumber || 1,
        excerpt: c.content.substring(0, 150) + '...'
      }))
    };
  }

  // Active Recall Tool: Auto-generate Quizzes (MCQs)
  async generateQuiz(allChunks, numQuestions = 4) {
    const selectedChunks = allChunks.slice(0, Math.min(allChunks.length, 6));
    const combinedText = selectedChunks.map(c => c.content).join('\n');

    if (this.genAI && this.apiKey) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Generate a ${numQuestions}-question multiple choice quiz in JSON format based on the following study notes.
Return ONLY valid JSON array with objects containing: 
"id" (string), "question" (string), "options" (array of 4 strings), "correctAnswer" (number index 0-3), "explanation" (string), "difficulty" ("Easy"|"Medium"|"Hard").

Content:
${combinedText.substring(0, 3000)}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
      } catch (err) {
        console.warn('Gemini Quiz generation fallback:', err.message);
      }
    }

    // Built-in smart Quiz generator fallback
    const quizzes = selectedChunks.slice(0, numQuestions).map((chunk, idx) => {
      const sentences = chunk.content.split('. ').filter(s => s.length > 20);
      const mainSentence = sentences[0] || chunk.content.substring(0, 100);
      
      return {
        id: `q-${idx + 1}`,
        question: `Based on ${chunk.docTitle}: Which of the following best describes "${mainSentence.substring(0, 40)}..."?`,
        options: [
          mainSentence,
          `An alternative theory proposed in earlier research literature`,
          `A peripheral concept not directly related to the core topic`,
          `A contradictory finding disproved in recent experiments`
        ],
        correctAnswer: 0,
        explanation: `As stated in ${chunk.docTitle}: "${mainSentence}."`,
        difficulty: idx % 2 === 0 ? 'Medium' : 'Hard'
      };
    });

    return quizzes.length > 0 ? quizzes : [
      {
        id: 'q-default',
        question: 'What is the primary function of Retrieval-Augmented Generation (RAG)?',
        options: [
          'Grounded AI answers backed by cited source documents',
          'Generating completely unverified random responses',
          'Replacing database storage with static images',
          'Executing server side operating system commands'
        ],
        correctAnswer: 0,
        explanation: 'RAG grounds AI responses in user-uploaded documents with verifiable citations.',
        difficulty: 'Easy'
      }
    ];
  }

  // Active Recall Tool: Auto-generate Spaced-Repetition Flashcards
  async generateFlashcards(allChunks, count = 5) {
    const selectedChunks = allChunks.slice(0, Math.min(allChunks.length, 8));
    
    return selectedChunks.slice(0, count).map((chunk, idx) => {
      const sentences = chunk.content.split('. ').filter(s => s.length > 15);
      const question = sentences[0] ? `What is the key takeaway regarding: ${sentences[0].substring(0, 50)}...?` : `Summary of ${chunk.docTitle} section ${idx + 1}`;
      const answer = sentences.slice(0, 2).join('. ') || chunk.content;

      return {
        id: `fc-${Date.now()}-${idx}`,
        docTitle: chunk.docTitle,
        front: question,
        back: answer,
        category: 'Core Concepts',
        interval: 1, // SM-2 algorithm starting state
        repetition: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString()
      };
    });
  }

  // Audio Overview / Podcast Script Generator
  async generateAudioOverview(allChunks) {
    const combinedText = allChunks.map(c => `${c.docTitle}: ${c.content}`).join('\n\n').substring(0, 4000);

    const script = [
      {
        speaker: 'Alex (Host)',
        avatar: '🎙️',
        text: `Welcome back to the Deep Dive Study Podcast! Today we are exploring key materials from your active notebook.`
      },
      {
        speaker: 'Maya (AI Researcher)',
        avatar: '💡',
        text: `That's right, Alex. Looking through the uploaded notes and papers, there are some remarkable insights worth breaking down.`
      },
      {
        speaker: 'Alex (Host)',
        avatar: '🎙️',
        text: `Let's talk about the primary theme. What stands out as the most critical concept in these documents?`
      },
      {
        speaker: 'Maya (AI Researcher)',
        avatar: '💡',
        text: `The material emphasizes grounded evidence and structured retrieval. As noted in the sources: "${allChunks[0]?.content.substring(0, 140) || 'The core principles are established clearly.'}..."`
      },
      {
        speaker: 'Alex (Host)',
        avatar: '🎙️',
        text: `Fascinating! So how can learners apply this when preparing for exams or research projects?`
      },
      {
        speaker: 'Maya (AI Researcher)',
        avatar: '💡',
        text: `By utilizing active recall, self-testing with quizzes, and reviewing flashcards daily using spaced repetition!`
      }
    ];

    return {
      title: 'Notebook Deep-Dive Audio Summary',
      duration: '2 min read & listen',
      hosts: ['Alex', 'Maya'],
      script
    };
  }
}
