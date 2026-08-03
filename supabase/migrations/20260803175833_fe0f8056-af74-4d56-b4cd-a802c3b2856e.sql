CREATE OR REPLACE FUNCTION public.notify_mn_expert_published()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_expert public.industry_experts%ROWTYPE;
  v_service_key text;
BEGIN
  IF NEW.city_slug <> 'minneapolis' THEN RETURN NEW; END IF;
  IF NEW.published IS NOT TRUE THEN RETURN NEW; END IF;
  IF COALESCE(NEW.share_reminder_sent, false) THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND COALESCE(OLD.published, false) = true
     AND COALESCE(OLD.share_reminder_sent, false) = COALESCE(NEW.share_reminder_sent, false) THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_expert FROM public.industry_experts WHERE id = NEW.expert_id;
  IF v_expert.email IS NULL OR v_expert.email = '' THEN RETURN NEW; END IF;

  SELECT decrypted_secret INTO v_service_key
    FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key';
  IF v_service_key IS NULL THEN
    RAISE WARNING 'notify_mn_expert_published: missing vault secret';
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := 'https://qpnzjcbdtybwazceggmv.supabase.co/functions/v1/send-transactional-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', v_service_key
      ),
      body := jsonb_build_object(
        'templateName', 'mn-expert-published',
        'recipientEmail', v_expert.email,
        'idempotencyKey', 'mn-expert-published-' || NEW.expert_id::text,
        'templateData', jsonb_build_object(
          'recipientName', v_expert.full_name,
          'expertSlug', v_expert.slug
        )
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_mn_expert_published http_post failed: %', SQLERRM;
    RETURN NEW;
  END;

  NEW.share_reminder_sent := true;
  RETURN NEW;
END;
$$;