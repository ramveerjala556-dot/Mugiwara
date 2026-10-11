import express, { type Response } from 'express';
import { db } from '../storage/db.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Task } from '../models/types.ts';

const router = express.Router();

// GET all tasks for user
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { status, projectId, priority } = req.query;
  let tasks = db.tasks.findByUserId(userId);

  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }
  if (projectId) {
    tasks = tasks.filter(t => t.projectId === projectId);
  }
  if (priority) {
    tasks = tasks.filter(t => t.priority === priority);
  }

  return res.json({ tasks });
});

// GET single task
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const task = db.tasks.findById(req.params.id);
  if (!task || task.userId !== userId) {
    return res.status(404).json({ error: 'Task not found' });
  }
  return res.json({ task });
});

// POST create task
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { title, description = '', projectId, status = 'pending', priority = 'medium', assignedCrew = 'Zoro', dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  let projectName = '';
  if (projectId) {
    const proj = db.projects.findById(projectId);
    if (proj && proj.userId === userId) {
      projectName = proj.name;
    }
  }

  const newTask: Task = {
    id: `task-${Date.now()}`,
    userId,
    projectId,
    projectName,
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    assignedCrew,
    dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.create(newTask);

  // Log activity
  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Created task "${newTask.title}"`,
    description: `Assigned to ${assignedCrew} [${priority.toUpperCase()}]`,
    relatedEntityType: 'task',
    relatedEntityId: newTask.id,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ task: newTask });
});

// PATCH update task
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const task = db.tasks.findById(req.params.id);
  if (!task || task.userId !== userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, status, priority, assignedCrew, dueDate, projectId } = req.body;
  const updates: Partial<Task> = {};

  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (assignedCrew !== undefined) updates.assignedCrew = assignedCrew;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (projectId !== undefined) {
    updates.projectId = projectId;
    const p = db.projects.findById(projectId);
    if (p) updates.projectName = p.name;
  }

  const updated = db.tasks.update(req.params.id, updates);

  // Log activity
  if (status === 'completed' && task.status !== 'completed') {
    db.activities.create({
      id: `act-${Date.now()}`,
      userId,
      action: `Completed task "${task.title}"`,
      description: `Task finished by ${task.assignedCrew || 'crew'}!`,
      relatedEntityType: 'task',
      relatedEntityId: task.id,
      createdAt: new Date().toISOString(),
    });
  } else {
    db.activities.create({
      id: `act-${Date.now()}`,
      userId,
      action: `Updated task "${task.title}"`,
      description: `Status: ${updates.status || task.status}`,
      relatedEntityType: 'task',
      relatedEntityId: task.id,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ task: updated });
});

// DELETE task
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const task = db.tasks.findById(req.params.id);
  if (!task || task.userId !== userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.tasks.delete(req.params.id);

  db.activities.create({
    id: `act-${Date.now()}`,
    userId,
    action: `Deleted task "${task.title}"`,
    description: `Removed from board`,
    relatedEntityType: 'task',
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: 'Task deleted successfully' });
});

export default router;
