// controllers/chatController.js
// ─────────────────────────────────────────────
// Secure AI Chat endpoint using Anthropic API
// The API key never leaves the backend.
// ─────────────────────────────────────────────
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '../config/supabase.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/chat
export const sendChatMessage = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const isValid = messages.every(
    (m) =>
      m.role &&
      ['user', 'assistant'].includes(m.role) &&
      typeof m.content === 'string' &&
      m.content.trim() !== ''
  );

  if (!isValid) {
    return res.status(400).json({
      error: 'Each message must have role (user|assistant) and content (string)',
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:
        'You are EGO AI, a helpful assistant embedded in EGO Workspace — a personal dev workspace for developers and creators. Help with code, projects, planning, and ideas concisely and clearly.',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const assistantMessage = response.content[0]?.text || '';

    // Save the latest exchange to DB
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      await supabase.from('chat_messages').insert([
        { user_id: req.user.id, role: 'user', content: lastUserMessage.content },
        { user_id: req.user.id, role: 'assistant', content: assistantMessage },
      ]);
    }

    res.json({ reply: assistantMessage });
  } catch (err) {
    console.error('[Chat Controller Error]', err.message);
    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid Anthropic API key' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'AI rate limit reached. Try again shortly.' });
    }
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

// GET /api/chat/history
export const getChatHistory = async (req, res) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// DELETE /api/chat/history
export const clearChatHistory = async (req, res) => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Chat history cleared' });
};
