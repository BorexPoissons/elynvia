-- Promote one owned intent into a project and attach the conversation atomically.

create or replace function public.promote_intent_to_project(p_intent_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_intent record;
  v_project_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  select id, conversation_id, project_id, summary
    into v_intent
  from public.intents
  where id = p_intent_id
    and user_id = v_user_id;

  if not found then
    raise exception 'intent not found' using errcode = 'P0002';
  end if;

  if v_intent.project_id is not null then
    return v_intent.project_id;
  end if;

  insert into public.projects (user_id, title, description, status)
  values (
    v_user_id,
    left(coalesce(nullif(trim(v_intent.summary), ''), 'Nouveau projet'), 120),
    'Projet créé depuis une intention ELYNVIA.',
    'active'
  )
  returning id into v_project_id;

  update public.intents
  set project_id = v_project_id,
      status = case when status = 'draft' then 'planning' else status end
  where id = p_intent_id
    and user_id = v_user_id;

  if v_intent.conversation_id is not null then
    update public.conversations
    set project_id = v_project_id
    where id = v_intent.conversation_id
      and user_id = v_user_id;
  end if;

  return v_project_id;
end;
$$;

revoke all on function public.promote_intent_to_project(uuid) from public;
grant execute on function public.promote_intent_to_project(uuid) to authenticated;
