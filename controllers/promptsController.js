// controllers/promptsController.js
// ─────────────────────────────────────────────
// CRUD for the /api/prompts routes (Prompt Library)
// Also includes a route to increment `uses` count
// ─────────────────────────────────────────────
import { supabase } from '../config/supabase.js';

// GET /api/prompts
export const getPrompts = async (req, res) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/prompts
export const createPrompt = async (req, res) => {
  const { title, text, category } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Prompt title is required' });
  }
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Prompt text is required' });
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      user_id: req.user.id,
      title: title.trim(),
      text: text.trim(),
      category: category || 'General',
      uses: 0,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/prompts/:id
export const updatePrompt = async (req, res) => {
  const { id } = req.params;
  const { title, text, category, uses } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Prompt title is required' });
  }

  const { data, error } = await supabase
    .from('prompts')
    .update({ title: title.trim(), text, category, uses })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Prompt not found' });
  res.json(data);
};

// PATCH /api/prompts/:id/use — increment uses count
export const incrementPromptUses = async (req, res) => {
  const { id } = req.params;

  const { data: current, error: fetchError } = await supabase
    .from('prompts')
    .select('uses')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (fetchError || !current) {
    return res.status(404).json({ error: 'Prompt not found' });
  }

  const { data, error } = await supabase
    .from('prompts')
    .update({ uses: current.uses + 1 })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// DELETE /api/prompts/:id
export const deletePrompt = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Prompt deleted successfully' });
};
