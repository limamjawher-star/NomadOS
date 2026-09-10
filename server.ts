import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { findCandidateDestinations } from './src/features/intelligence/engine/RouteEngine';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Set up Google Gen AI
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// API routes
app.post('/api/ai/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable. Missing API key.' });
    }
    
    // Minimal authentication check
    const { context, message, history } = req.body;
    
    const systemInstruction = `You are the NomadOS AI Concierge, a highly capable travel, tax, and visa assistant for digital nomads.
    You must abide by the following rules:
    1. NEVER make authoritative tax or immigration claims. Always add "This is informational and should be verified with the relevant authority/professional."
    2. Be concise, structured, and helpful.
    3. The user's current context is: ${JSON.stringify(context)}
    4. If no valid route is possible, state it clearly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...(history || []),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: 'The main conversational response to the user' },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Any bullet point recommendations'
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Any warnings about visas, budget, or taxes'
            },
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  actionId: { type: Type.STRING }
                }
              },
              description: 'Suggested UI actions to perform'
            }
          },
          required: ['answer', 'recommendations', 'warnings', 'actions']
        }
      }
    });

    if (response.text) {
      res.json(JSON.parse(response.text));
    } else {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/ai/optimize-route', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const { constraints, preferences, context } = req.body;

    // 1. DETERMINISTIC LAYER: Filter candidates based on hard constraints
    const candidates = findCandidateDestinations(constraints, preferences);
    
    if (candidates.length === 0) {
      return res.json({
        validRouteFound: false,
        explanation: "I could not find any destinations that match your strict budget and climate constraints.",
        score: { overall: 0, budgetFit: 0, workFit: 0, climate: 0 },
        destinations: []
      });
    }

    // 2. AI EXPLANATION & SELECTION LAYER: Tell Gemini to pick from the valid candidates and format the explanation
    const systemInstruction = `You are the NomadOS Smart Route Optimizer.
    The deterministic engine has filtered the valid candidate destinations for this user based on hard constraints (budget, climate, internet).
    Valid Candidates: ${JSON.stringify(candidates)}
    
    User Context: ${JSON.stringify(context)}
    Constraints: ${JSON.stringify(constraints)}
    
    Your job is to select 1 to 3 destinations from the valid candidates that form a logical sequence for a ${constraints.durationDays} day trip, and explain WHY this route is optimal. Provide a score out of 100.
    Do NOT suggest destinations that are not in the Valid Candidates list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate the optimal route from the valid candidates and explain the reasoning.",
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validRouteFound: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING },
            score: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.INTEGER },
                budgetFit: { type: Type.INTEGER },
                workFit: { type: Type.INTEGER },
                climate: { type: Type.INTEGER }
              }
            },
            destinations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  city: { type: Type.STRING },
                  country: { type: Type.STRING },
                  durationDays: { type: Type.INTEGER },
                  estimatedCostUSD: { type: Type.INTEGER },
                  reasoning: { type: Type.STRING }
                }
              }
            }
          },
          required: ['validRouteFound', 'explanation', 'score', 'destinations']
        }
      }
    });

    if (response.text) {
      res.json(JSON.parse(response.text));
    } else {
      res.status(500).json({ error: 'Failed to generate route' });
    }
  } catch (error: any) {
    console.error('Route Optimizer Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
