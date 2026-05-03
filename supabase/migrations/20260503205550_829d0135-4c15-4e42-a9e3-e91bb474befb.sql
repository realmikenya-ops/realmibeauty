
CREATE OR REPLACE FUNCTION public.enforce_booking_within_hours()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_weekday smallint;
  v_row public.vendor_availability%ROWTYPE;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status NOT IN ('pending', 'accepted') THEN RETURN NEW; END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status <> 'accepted' OR OLD.status = 'accepted' THEN RETURN NEW; END IF;
  END IF;

  v_weekday := EXTRACT(DOW FROM NEW.booking_date)::smallint;
  SELECT * INTO v_row FROM public.vendor_availability
  WHERE vendor_id = NEW.vendor_id AND weekday = v_weekday;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No availability configured for vendor % on this weekday', NEW.vendor_id USING ERRCODE = 'check_violation';
  END IF;
  IF NOT v_row.is_open THEN
    RAISE EXCEPTION 'Vendor is closed on this day' USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.booking_time < v_row.open_from OR NEW.booking_time >= v_row.open_to THEN
    RAISE EXCEPTION 'Booking time % is outside working hours (% - %)',
      to_char(NEW.booking_time, 'HH24:MI'),
      to_char(v_row.open_from, 'HH24:MI'),
      to_char(v_row.open_to, 'HH24:MI')
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

REVOKE EXECUTE ON FUNCTION public.enforce_booking_within_hours() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
