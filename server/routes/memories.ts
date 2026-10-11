import express, { type Response } from 'express';
import { db } from '../storage/db.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Memory } from '../models/types.ts';

const router = express.Router();

// GET all memories for user
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { category, search } = req.query;
  let memories = db.memories.findByUserId(userId);

  if (category && category !== 'All') {
    memories = memories.filter(m => m.category === category);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    memories = memories.filter(m => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q));
  }

  return res.json({ memories });
});

// POST create memory
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { title, content, category = 'General', icon = 'lightbulb' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Memory title is required' });
  }

  const newMemory: Memory = {
    id: `mem-${Date.now()}`,
    userId,
    title: title.trim(),
    content: (content || '').trim(),
    category,
    icon,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.memories.create(newMemory);

  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Saved memory "${newMemory.title}"`,
    description: `Category: ${category}`,
    relatedEntityType: 'memory',
    relatedEntityId: newMemory.id,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ memory: newMemory });
});

// PATCH update memory
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const mem = db.memories.findById(req.params.id);
  if (!mem || mem.userId !== userId) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  const { title, content, category, icon } = req.body;
  const updates: Partial<Memory> = {};
  if (title !== undefined) updates.title = title.trim();
  if (content !== undefined) updates.content = content.trim();
  if (category !== undefined) updates.category = category;
  if (icon !== undefined) updates.icon = icon;

  const updated = db.memories.update(req.params.id, updates);

  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Updated memory "${updated?.title}"`,
    description: `Refined memory details`,
    relatedEntityType: 'memory',
    relatedEntityId: updated?.id,
    createdAt: new Date().toISOString(),
  });

  return res.json({ memory: updated });
});

// DELETE memory
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const mem = db.memories.findById(req.params.id);
  if (!mem || mem.userId !== userId) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  db.memories.delete(req.params.id);

  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Deleted memory "${mem.title}"`,
    description: `Removed from crew archive`,
    relatedEntityType: 'memory',
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: 'Memory deleted successfully' });
});

export default router;
