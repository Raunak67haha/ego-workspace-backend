// controllers/projectsController.js
// ─────────────────────────────────────────────
// CRUD for the /api/projects routes
// All queries are scoped to req.user.id
// ─────────────────────────────────────────────
import { supabase } from '../config/supabase.js';

// GET /api/projects — fetch all projects for the current user
export const getProjects = async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/projects — create a new project
export const createProject = async (req, res) => {
  const { name, description, color, tags } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: req.user.id,
      name: name.trim(),
      description: description || '',
      color: color || '#6366f1',
      tags: tags || [],
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/projects/:id — update a project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, color, tags } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const { data, error } = await supabase
    .from('projects')
    .update({ name: name.trim(), description, color, tags })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Project not found' });
  res.json(data);
};

// DELETE /api/projects/:id — delete a project
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Project deleted successfully' });
};
