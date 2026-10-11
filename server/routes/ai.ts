import express, { type Response } from 'express';
import { db } from '../storage/db.ts';
import { generateAIChatResponse, streamAIChatResponse } from '../services/gemini.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Conversation, ChatMessage } from '../models/types.ts';

const router = express.Router();

// Chat with Gemini AI (Standard JSON response)
router.post('/chat', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      prompt,
      conversationId,
      crewMember = 'Luffy',
      controls = {},
      attachments = [],
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Retrieve previous conversation messages for multi-turn history
    let existingConv: Conversation | undefined;
    if (conversationId) {
      existingConv = db.conversations.findById(conversationId);
    }

    const history = (existingConv && existingConv.userId === userId)
      ? existingConv.messages.map(m => ({ role: m.role, content: m.content }))
      : [];

    // Call Gemini Service with history
    const aiResult = await generateAIChatResponse({
      prompt: prompt.trim(),
      conversationId,
      userId,
      crewMember,
      controls,
      attachments,
      history,
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toISOString(),
      attachments: attachments.map((a: any) => a.name),
    };

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: aiResult.text,
      timestamp: new Date().toISOString(),
      crewMember,
      sources: aiResult.sources,
    };

    let conv = existingConv;
    if (conv && conv.userId === userId) {
      conv.messages.push(userMsg, assistantMsg);
      conv.updatedAt = new Date().toISOString();
      conv.crewMember = crewMember;
      db.conversations.update(conv.id, { messages: conv.messages, updatedAt: conv.updatedAt });
    } else {
      conv = db.conversations.create({
        id: conversationId || `conv-${Date.now()}`,
        userId,
        title: prompt.trim().substring(0, 36) + (prompt.length > 36 ? '...' : ''),
        messages: [userMsg, assistantMsg],
        crewMember,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Log Activity
    db.activities.create({
      id: `act-${Date.now()}`,
      userId,
      action: `${crewMember} answered: "${prompt.slice(0, 28)}..."`,
      description: controls.deepResearch ? 'Deep Research completed' : 'Chat response generated',
      relatedEntityType: 'ai',
      relatedEntityId: conv.id,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      conversationId: conv.id,
      reply: assistantMsg,
      conversation: conv,
    });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI chat request',
    });
  }
});

// Stream with Server-Sent Events (SSE) for ChatGPT-style live streaming
router.post('/chat/stream', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      prompt,
      conversationId,
      crewMember = 'Luffy',
      controls = {},
      attachments = [],
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // SSE Setup
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let existingConv: Conversation | undefined;
    if (conversationId) {
      existingConv = db.conversations.findById(conversationId);
    }

    const history = (existingConv && existingConv.userId === userId)
      ? existingConv.messages.map(m => ({ role: m.role, content: m.content }))
      : [];

    let fullText = '';

    const stream = streamAIChatResponse({
      prompt: prompt.trim(),
      conversationId,
      userId,
      crewMember,
      controls,
      attachments,
      history,
    });

    for await (const chunk of stream) {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
    }

    // Save final message and conversation in DB
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toISOString(),
      attachments: attachments.map((a: any) => a.name),
    };

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: fullText,
      timestamp: new Date().toISOString(),
      crewMember,
    };

    let conv = existingConv;
    if (conv && conv.userId === userId) {
      conv.messages.push(userMsg, assistantMsg);
      conv.updatedAt = new Date().toISOString();
      conv.crewMember = crewMember;
      db.conversations.update(conv.id, { messages: conv.messages, updatedAt: conv.updatedAt });
    } else {
      conv = db.conversations.create({
        id: conversationId || `conv-${Date.now()}`,
        userId,
        title: prompt.trim().substring(0, 36) + (prompt.length > 36 ? '...' : ''),
        messages: [userMsg, assistantMsg],
        crewMember,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Final Done Event
    res.write(`data: ${JSON.stringify({ done: true, conversationId: conv.id, fullText, conversation: conv })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('SSE Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming failed', done: true })}\n\n`);
    res.end();
  }
});

// GET conversations
router.get('/conversations', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const conversations = db.conversations.findByUserId(userId);
  return res.json({ conversations });
});

// GET conversation by ID
router.get('/conversations/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const conv = db.conversations.findById(req.params.id);
  if (!conv || conv.userId !== userId) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  return res.json({ conversation: conv });
});

// PATCH update conversation (e.g. title)
router.patch('/conversations/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const conv = db.conversations.findById(req.params.id);
  if (!conv || conv.userId !== userId) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  const { title } = req.body;
  if (title) {
    const updated = db.conversations.update(req.params.id, { title: title.trim() });
    return res.json({ conversation: updated });
  }
  return res.json({ conversation: conv });
});

// DELETE conversation
router.delete('/conversations/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const conv = db.conversations.findById(req.params.id);
  if (!conv || conv.userId !== userId) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  db.conversations.delete(req.params.id);
  return res.json({ message: 'Conversation deleted' });
});

export default router;
