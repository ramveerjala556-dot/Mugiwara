import express, { type Response } from 'express';
import { db } from '../storage/db.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

// GET all activities
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const activities = db.activities.findByUserId(userId);
  return res.json({ activities });
});

export default router;
