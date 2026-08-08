-- ELYNVIA Life — initial schema v0.1
-- Minimal foundation for profiles, conversations, messages, intents and projects.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'fr-CH',
  timezone text not null default 'Europe/Zurich',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'active' check (status in ('active','paused','completed','cancelled')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  type text not null,
  status text not null default 'draft' check (status in ('draft','planning','active','completed','cancelled')),
  summary text not null,
  constraints jsonb not null default '{}'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects(user_id);
create index conversations_user_id_idx on public.conversations(user_id);
create index conversations_project_id_idx on public.conversations(project_id);
create index messages_user_id_idx on public.messages(user_id);
create index messages_conversation_id_created_at_idx on public.messages(conversation_id, created_at);
create index intents_user_id_idx on public.intents(user_id);
create index intents_conversation_id_idx on public.intents(conversation_id);
create index intents_project_id_idx on public.intents(project_id);
create index intents_type_idx on public.intents(type);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create trigger intents_set_updated_at
before update on public.intents
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.intents enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using (id = auth.uid());

create policy "projects_select_own"
on public.projects for select
to authenticated
using (user_id = auth.uid());

create policy "projects_insert_own"
on public.projects for insert
to authenticated
with check (user_id = auth.uid());

create policy "projects_update_own"
on public.projects for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "projects_delete_own"
on public.projects for delete
to authenticated
using (user_id = auth.uid());

create policy "conversations_select_own"
on public.conversations for select
to authenticated
using (user_id = auth.uid());

create policy "conversations_insert_own"
on public.conversations for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
);

create policy "conversations_update_own"
on public.conversations for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
);

create policy "conversations_delete_own"
on public.conversations for delete
to authenticated
using (user_id = auth.uid());

create policy "messages_select_own"
on public.messages for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

create policy "messages_insert_own"
on public.messages for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

create policy "messages_update_own"
on public.messages for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

create policy "messages_delete_own"
on public.messages for delete
to authenticated
using (user_id = auth.uid());

create policy "intents_select_own"
on public.intents for select
to authenticated
using (user_id = auth.uid());

create policy "intents_insert_own"
on public.intents for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    conversation_id is null
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
);

create policy "intents_update_own"
on public.intents for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    conversation_id is null
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  and (
    project_id is null
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
);

create policy "intents_delete_own"
on public.intents for delete
to authenticated
using (user_id = auth.uid());
