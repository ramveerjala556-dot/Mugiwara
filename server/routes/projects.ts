import express, { type Response } from 'express';
import { db } from '../storage/db.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Project } from '../models/types.ts';

const router = express.Router();

// GET all projects for user
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const projects = db.projects.findByUserId(userId);
  return res.json({ projects });
});

// GET single project
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const project = db.projects.findById(req.params.id);
  if (!project || project.userId !== userId) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

// POST create project
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, description = '', status = 'In Progress', progress = 0, color = 'teal', tag = 'Web App' } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    userId,
    name: name.trim(),
    description: description.trim(),
    status,
    progress: Math.min(100, Math.max(0, Number(progress) || 0)),
    color,
    tag,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.create(newProject);

  // Record activity
  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Created project ${newProject.name}`,
    description: `Set sail on new initiative: ${newProject.name}`,
    relatedEntityType: 'project',
    relatedEntityId: newProject.id,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ project: newProject });
});

// PATCH update project
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const project = db.projects.findById(req.params.id);
  if (!project || project.userId !== userId) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, status, progress, color, tag } = req.body;
  const updates: Partial<Project> = {};

  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description.trim();
  if (status !== undefined) updates.status = status;
  if (progress !== undefined) updates.progress = Math.min(100, Math.max(0, Number(progress)));
  if (color !== undefined) updates.color = color;
  if (tag !== undefined) updates.tag = tag;

  const updated = db.projects.update(req.params.id, updates);

  // Log activity
  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Updated project ${updated?.name}`,
    description: `Progress now at ${updated?.progress}% (${updated?.status})`,
    relatedEntityType: 'project',
    relatedEntityId: updated?.id,
    createdAt: new Date().toISOString(),
  });

  return res.json({ project: updated });
});

// DELETE project
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const project = db.projects.findById(req.params.id);
  if (!project || project.userId !== userId) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.projects.delete(req.params.id);

  // Log activity
  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Deleted project ${project.name}`,
    description: `Removed project record`,
    relatedEntityType: 'project',
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: 'Project deleted successfully' });
});

export default router;
