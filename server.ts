import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './server/routes/auth.ts';
import projectsRouter from './server/routes/projects.ts';
import tasksRouter from './server/routes/tasks.ts';
import memoriesRouter from './server/routes/memories.ts';
import activitiesRouter from './server/routes/activities.ts';
import dashboardRouter from './server/routes/dashboard.ts';
import aiRouter from './server/routes/ai.ts';
import { authMiddleware } from './server/middleware/auth.ts';
import { db } from './server/storage/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const stats = db.getStats();
  res.json({
    status: 'ok',
    system: 'Mugiwara AI Operational',
    database: {
      status: 'connected',
      storageEngine: stats.storageType,
      records: stats,
    },
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    },
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes with auth middleware
app.use('/api/auth', authRouter);
app.use('/api/projects', authMiddleware, projectsRouter);
app.use('/api/tasks', authMiddleware, tasksRouter);
app.use('/api/memories', authMiddleware, memoriesRouter);
app.use('/api/activities', authMiddleware, activitiesRouter);
app.use('/api/dashboard', authMiddleware, dashboardRouter);
app.use('/api/ai', authMiddleware, aiRouter);

// Setup frontend integration (Vite dev middleware vs production static files)
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏴‍☠️ Mugiwara AI Dashboard server sailing on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
