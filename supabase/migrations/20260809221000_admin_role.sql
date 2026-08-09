-- ELYNVIA — secure administrator role
-- Admin users can inspect and operate all application data through normal authenticated clients.
-- IMPORTANT: never store an admin password or service-role key in the repository.

alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Prevent users from granting themselves admin through the profile UI/client.
create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator can change profile roles';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

-- Replace own-only policies with own-or-admin access.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_own_or_admin" on public.profiles for insert to authenticated with check (id = auth.uid() or public.is_admin());
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
create policy "profiles_delete_own_or_admin" on public.profiles for delete to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_select_own_or_admin" on public.projects for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "projects_insert_own_or_admin" on public.projects for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "projects_update_own_or_admin" on public.projects for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "projects_delete_own_or_admin" on public.projects for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "conversations_select_own" on public.conversations;
drop policy if exists "conversations_insert_own" on public.conversations;
drop policy if exists "conversations_update_own" on public.conversations;
drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_select_own_or_admin" on public.conversations for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "conversations_insert_own_or_admin" on public.conversations for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "conversations_update_own_or_admin" on public.conversations for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "conversations_delete_own_or_admin" on public.conversations for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages_select_own" on public.messages;
drop policy if exists "messages_insert_own" on public.messages;
drop policy if exists "messages_update_own" on public.messages;
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_select_own_or_admin" on public.messages for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "messages_insert_own_or_admin" on public.messages for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "messages_update_own_or_admin" on public.messages for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "messages_delete_own_or_admin" on public.messages for delete to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "intents_select_own" on public.intents;
drop policy if exists "intents_insert_own" on public.intents;
drop policy if exists "intents_update_own" on public.intents;
drop policy if exists "intents_delete_own" on public.intents;
create policy "intents_select_own_or_admin" on public.intents for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "intents_insert_own_or_admin" on public.intents for insert to authenticated with check (user_id = auth.uid() or public.is_admin());
create policy "intents_update_own_or_admin" on public.intents for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "intents_delete_own_or_admin" on public.intents for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- Bootstrap an administrator AFTER creating the Auth user (Dashboard > Authentication > Users):
-- insert into public.profiles (id, display_name, role)
-- values ('AUTH_USER_UUID', 'Administrator', 'admin')
-- on conflict (id) do update set role = 'admin';
