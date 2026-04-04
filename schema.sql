-- ══════════════════════════════════════════════
-- EGO Workspace — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ══════════════════════════════════════════════

create extension if not exists "uuid-ossp";


-- ─────────────────────────────────────────────
-- TABLE: projects
-- ─────────────────────────────────────────────
create table if not exists projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  color       text default '#6366f1',
  tags        text[] default '{}',
  created_at  timestamptz default now()
);


-- ─────────────────────────────────────────────
-- TABLE: snippets (Code Vault)
-- ─────────────────────────────────────────────
create table if not exists snippets (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  lang       text not null default 'javascript',
  code       text not null,
  tags       text[] default '{}',
  created_at timestamptz default now()
);


-- ─────────────────────────────────────────────
-- TABLE: tasks (Kanban board)
-- column_name values: 'todo' | 'inprogress' | 'done'
-- ─────────────────────────────────────────────
create table if not exists tasks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  column_name text not null check (column_name in ('todo', 'inprogress', 'done')),
  text        text not null,
  priority    text default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at  timestamptz default now()
);


-- ─────────────────────────────────────────────
-- TABLE: prompts (Prompt Library)
-- ─────────────────────────────────────────────
create table if not exists prompts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  text       text not null,
  category   text default 'General',
  uses       integer default 0,
  created_at timestamptz default now()
);


-- ─────────────────────────────────────────────
-- TABLE: week_plan (Week Planner)
-- day values: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
-- ─────────────────────────────────────────────
create table if not exists week_plan (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  day        text not null check (day in ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
  text       text not null,
  done       boolean default false,
  created_at timestamptz default now()
);


-- ─────────────────────────────────────────────
-- TABLE: chat_messages (AI Chat history)
-- role values: 'user' | 'assistant'
-- ─────────────────────────────────────────────
create table if not exists chat_messages (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);


-- ══════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ══════════════════════════════════════════════

-- ─── PROJECTS ───
alter table projects enable row level security;
create policy "Users can view own projects"   on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- ─── SNIPPETS ───
alter table snippets enable row level security;
create policy "Users can view own snippets"   on snippets for select using (auth.uid() = user_id);
create policy "Users can insert own snippets" on snippets for insert with check (auth.uid() = user_id);
create policy "Users can update own snippets" on snippets for update using (auth.uid() = user_id);
create policy "Users can delete own snippets" on snippets for delete using (auth.uid() = user_id);

-- ─── TASKS ───
alter table tasks enable row level security;
create policy "Users can view own tasks"   on tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- ─── PROMPTS ───
alter table prompts enable row level security;
create policy "Users can view own prompts"   on prompts for select using (auth.uid() = user_id);
create policy "Users can insert own prompts" on prompts for insert with check (auth.uid() = user_id);
create policy "Users can update own prompts" on prompts for update using (auth.uid() = user_id);
create policy "Users can delete own prompts" on prompts for delete using (auth.uid() = user_id);

-- ─── WEEK PLAN ───
alter table week_plan enable row level security;
create policy "Users can view own week_plan"   on week_plan for select using (auth.uid() = user_id);
create policy "Users can insert own week_plan" on week_plan for insert with check (auth.uid() = user_id);
create policy "Users can update own week_plan" on week_plan for update using (auth.uid() = user_id);
create policy "Users can delete own week_plan" on week_plan for delete using (auth.uid() = user_id);

-- ─── CHAT MESSAGES ───
alter table chat_messages enable row level security;
create policy "Users can view own chat_messages"   on chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own chat_messages" on chat_messages for insert with check (auth.uid() = user_id);
create policy "Users can delete own chat_messages" on chat_messages for delete using (auth.uid() = user_id);
