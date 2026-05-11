CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (user_id) DO NOTHING;

  IF lower(NEW.email) = 'realmikenya@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- Also ensure the existing user has admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('62e9763e-ee5a-4b93-a122-4094f33b7159', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update existing role if it was set to something else
UPDATE public.user_roles SET role = 'admin'
WHERE user_id = '62e9763e-ee5a-4b93-a122-4094f33b7159' AND role != 'admin';