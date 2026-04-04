// controllers/snippetsController.js
// ─────────────────────────────────────────────
// CRUD for the /api/snippets routes (Code Vault)
// ─────────────────────────────────────────────
import { supabase } from '../config/supabase.js';

// GET /api/snippets
export const getSnippets = async (req, res) => {
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/snippets
export const createSnippet = async (req, res) => {
  const { title, lang, code, tags } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Snippet title is required' });
  }
  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Snippet code is required' });
  }

  const { data, error } = await supabase
    .from('snippets')
    .insert({
      user_id: req.user.id,
      title: title.trim(),
      lang: lang || 'javascript',
      code: code.trim(),
      tags: tags || [],
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/snippets/:id
export const updateSnippet = async (req, res) => {
  const { id } = req.params;
  const { title, lang, code, tags } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Snippet title is required' });
  }

  const { data, error } = await supabase
    .from('snippets')
    .update({ title: title.trim(), lang, code, tags })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Snippet not found' });
  res.json(data);
};

// DELETE /api/snippets/:id
export const deleteSnippet = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Snippet deleted successfully' });
};
