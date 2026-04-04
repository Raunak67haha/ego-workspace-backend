// controllers/weekPlanController.js
// ─────────────────────────────────────────────
// CRUD for /api/weekplan routes (Week Planner)
// GET returns entries grouped by day
// ─────────────────────────────────────────────
import { supabase } from '../config/supabase.js';

const VALID_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// GET /api/weekplan — returns entries grouped by day
export const getWeekPlan = async (req, res) => {
  const { data, error } = await supabase
    .from('week_plan')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  // Group entries by day so frontend gets { Mon: [], Tue: [], ... }
  const grouped = {};
  for (const day of VALID_DAYS) grouped[day] = [];
  for (const entry of data) {
    if (grouped[entry.day]) grouped[entry.day].push(entry);
  }

  res.json(grouped);
};

// POST /api/weekplan — add an entry to a specific day
export const createWeekEntry = async (req, res) => {
  const { day, text } = req.body;

  if (!day || !VALID_DAYS.includes(day)) {
    return res.status(400).json({
      error: `day must be one of: ${VALID_DAYS.join(', ')}`,
    });
  }
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Entry text is required' });
  }

  const { data, error } = await supabase
    .from('week_plan')
    .insert({
      user_id: req.user.id,
      day,
      text: text.trim(),
      done: false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/weekplan/:id — update entry (text, day, done)
export const updateWeekEntry = async (req, res) => {
  const { id } = req.params;
  const { day, text, done } = req.body;

  if (day && !VALID_DAYS.includes(day)) {
    return res.status(400).json({
      error: `day must be one of: ${VALID_DAYS.join(', ')}`,
    });
  }

  const updates = {};
  if (text !== undefined) updates.text = text.trim();
  if (day !== undefined) updates.day = day;
  if (done !== undefined) updates.done = done;

  const { data, error } = await supabase
    .from('week_plan')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Week plan entry not found' });
  res.json(data);
};

// DELETE /api/weekplan/:id
export const deleteWeekEntry = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('week_plan')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Week plan entry deleted successfully' });
};
