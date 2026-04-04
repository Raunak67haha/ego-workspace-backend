// controllers/tasksController.js
// ─────────────────────────────────────────────
// CRUD for the /api/tasks routes (Kanban board)
// column_name: 'todo' | 'inprogress' | 'done'
// ─────────────────────────────────────────────
import { supabase } from '../config/supabase.js';

const VALID_COLUMNS = ['todo', 'inprogress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /api/tasks
export const getTasks = async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/tasks
export const createTask = async (req, res) => {
  const { column_name, text, priority } = req.body;

  if (!column_name || !VALID_COLUMNS.includes(column_name)) {
    return res.status(400).json({
      error: `column_name must be one of: ${VALID_COLUMNS.join(', ')}`,
    });
  }
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: req.user.id,
      column_name,
      text: text.trim(),
      priority: priority || 'medium',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { column_name, text, priority } = req.body;

  if (column_name && !VALID_COLUMNS.includes(column_name)) {
    return res.status(400).json({
      error: `column_name must be one of: ${VALID_COLUMNS.join(', ')}`,
    });
  }

  const updates = {};
  if (text !== undefined) updates.text = text.trim();
  if (column_name !== undefined) updates.column_name = column_name;
  if (priority !== undefined) updates.priority = priority;

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Task not found' });
  res.json(data);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted successfully' });
};
