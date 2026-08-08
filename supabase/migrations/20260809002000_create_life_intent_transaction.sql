-- Atomically create a Life conversation, first user message and structured intent.
-- SECURITY INVOKER keeps normal RLS/authorization behavior.

create or replace function public.create_life_intent(
  p_title text,
  p_source_text text,
  p_type text,
  p_status text,
  p_summary text,
  p_constraints jsonb default '{}'::jsonb,
  p_missing_information jsonb default '[]'::jsonb,
  p_confidence numeric default null
)
returns table (conversation_id uuid, intent_id uuid)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_conversation_id uuid;
  v_intent_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  if char_length(trim(coalesce(p_source_text, ''))) < 3 then
    raise exception 'source text is too short' using errcode = '22023';
  end if;

  if char_length(p_source_text) > 20000 then
    raise exception 'source text is too long' using errcode = '22023';
  end if;

  insert into public.conversations (user_id, title)
  values (v_user_id, nullif(left(trim(coalesce(p_title, '')), 80), ''))
  returning id into v_conversation_id;

  insert into public.messages (user_id, conversation_id, role, content)
  values (v_user_id, v_conversation_id, 'user', p_source_text);

  insert into public.intents (
    user_id,
    conversation_id,
    type,
    status,
    summary,
    constraints,
    missing_information,
    confidence,
    source_text
  )
  values (
    v_user_id,
    v_conversation_id,
    p_type,
    p_status,
    p_summary,
    coalesce(p_constraints, '{}'::jsonb),
    coalesce(p_missing_information, '[]'::jsonb),
    p_confidence,
    p_source_text
  )
  returning id into v_intent_id;

  return query select v_conversation_id, v_intent_id;
end;
$$;

revoke all on function public.create_life_intent(text, text, text, text, text, jsonb, jsonb, numeric) from public;
grant execute on function public.create_life_intent(text, text, text, text, text, jsonb, jsonb, numeric) to authenticated;
