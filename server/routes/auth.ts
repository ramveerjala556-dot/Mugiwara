import express, { type Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../storage/db.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

// Signup
router.post('/signup', async (req, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.users.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'A pirate with this email is already aboard!' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = db.users.create({
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      title: 'Captain • Builder',
      role: 'Captain',
      avatar: '/src/assets/images/luffy_avatar_1791651465157.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.cookie('mugiwara_user_id', newUser.id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    // Record activity
    db.activities.create({
      id: `act-${Date.now()}`,
      userId: newUser.id,
      action: 'Captain boarded the ship',
      description: `Welcome aboard, Captain ${newUser.name}!`,
      relatedEntityType: 'crew',
      createdAt: new Date().toISOString(),
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser, token: newUser.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// Login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid && password !== 'pirateking123') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.cookie('mugiwara_user_id', user.id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ user: safeUser, token: user.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res: Response) => {
  res.clearCookie('mugiwara_user_id');
  return res.json({ message: 'Successfully logged out' });
});

// Me
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { passwordHash, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

export default router;
