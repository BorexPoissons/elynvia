-- Append a user reply and refresh the latest structured intent atomically.

create or replace function public.reply_and_refresh_intent(
  p_conversation_id uuid,
  p_intent_id uuid,
  p_reply text,
  p_type text,
  p_status text,
  p_summary text,
  p_constraints jsonb default '{}'::jsonb,
  p_missing_information jsonb default '[]'::jsonb,
  p_confidence numeric default null,
  p_source_text text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  if char_length(trim(coalesce(p_reply, ''))) < 1 then
    raise exception 'reply is empty' using errcode = '22023';
  end if;

  if char_length(p_reply) > 10000 then
    raise exception 'reply is too long' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.conversations
    where id = p_conversation_id and user_id = v_user_id
  ) then
    raise exception 'conversation not found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.intents
    where id = p_intent_id
      and conversation_id = p_conversation_id
      and user_id = v_user_id
  ) then
    raise exception 'intent not found' using errcode = 'P0002';
  end if;

  insert into public.messages (user_id, conversation_id, role, content)
  values (v_user_id, p_conversation_id, 'user', p_reply)
  returning id into v_message_id;

  update public.intents
  set type = p_type,
      status = p_status,
      summary = p_summary,
      constraints = coalesce(p_constraints, '{}'::jsonb),
      missing_information = coalesce(p_missing_information, '[]'::jsonb),
      confidence = p_confidence,
      source_text = p_source_text
  where id = p_intent_id
    and conversation_id = p_conversation_id
    and user_id = v_user_id;

  update public.conversations
  set title = left(coalesce(nullif(trim(p_summary), ''), title), 80)
  where id = p_conversation_id
    and user_id = v_user_id;

  return v_message_id;
end;
$$;

revoke all on function public.reply_and_refresh_intent(uuid, uuid, text, text, text, text, jsonb, jsonb, numeric, text) from public;
grant execute on function public.reply_and_refresh_intent(uuid, uuid, text, text, text, text, jsonb, jsonb, numeric, text) to authenticated;
