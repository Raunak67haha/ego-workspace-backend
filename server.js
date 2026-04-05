// server.js
// ─────────────────────────────────────────────
// EGO Workspace — Express Backend Entry Point
// ─────────────────────────────────────────────
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import projectsRouter from './routes/projects.js';
import snippetsRouter from './routes/snippets.js';
import tasksRouter from './routes/tasks.js';
import promptsRouter from './routes/prompts.js';
import weekplanRouter from './routes/weekplan.js';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean);
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'EGO Workspace API is running 🚀' });
});

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/projects', projectsRouter);
app.use('/api/snippets', snippetsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/weekplan', weekplanRouter);
app.use('/api/chat', chatRouter);

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ EGO Workspace API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
