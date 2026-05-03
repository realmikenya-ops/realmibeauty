
-- Booking status enum
DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Vendor availability: one row per (vendor_id, weekday)
CREATE TABLE IF NOT EXISTS public.vendor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sun..6=Sat
  is_open boolean NOT NULL DEFAULT true,
  open_from time NOT NULL DEFAULT '09:00',
  open_to time NOT NULL DEFAULT '18:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vendor_id, weekday),
  CHECK (open_to > open_from)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  service_name text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_vendor_idx ON public.bookings (vendor_id, booking_date);

-- Server-side validation function
CREATE OR REPLACE FUNCTION public.enforce_booking_within_hours()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weekday smallint;
  v_row public.vendor_availability%ROWTYPE;
BEGIN
  -- Only enforce on inserts of pending/accepted, and on transitions to accepted
  IF TG_OP = 'INSERT' THEN
    IF NEW.status NOT IN ('pending', 'accepted') THEN
      RETURN NEW;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status <> 'accepted' OR OLD.status = 'accepted' THEN
      RETURN NEW;
    END IF;
  END IF;

  v_weekday := EXTRACT(DOW FROM NEW.booking_date)::smallint;

  SELECT * INTO v_row
  FROM public.vendor_availability
  WHERE vendor_id = NEW.vendor_id AND weekday = v_weekday;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No availability configured for vendor % on this weekday', NEW.vendor_id
      USING ERRCODE = 'check_violation';
  END IF;

  IF NOT v_row.is_open THEN
    RAISE EXCEPTION 'Vendor is closed on this day'
      USING ERRCODE = 'check_violation';
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

DROP TRIGGER IF EXISTS bookings_enforce_hours_ins ON public.bookings;
CREATE TRIGGER bookings_enforce_hours_ins
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_within_hours();

DROP TRIGGER IF EXISTS bookings_enforce_hours_upd ON public.bookings;
CREATE TRIGGER bookings_enforce_hours_upd
BEFORE UPDATE OF status, booking_date, booking_time ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_within_hours();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS bookings_touch ON public.bookings;
CREATE TRIGGER bookings_touch BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS vendor_availability_touch ON public.vendor_availability;
CREATE TRIGGER vendor_availability_touch BEFORE UPDATE ON public.vendor_availability
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS (open for demo until auth is wired in)
ALTER TABLE public.vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo read availability" ON public.vendor_availability;
CREATE POLICY "demo read availability" ON public.vendor_availability FOR SELECT USING (true);
DROP POLICY IF EXISTS "demo write availability" ON public.vendor_availability;
CREATE POLICY "demo write availability" ON public.vendor_availability FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "demo read bookings" ON public.bookings;
CREATE POLICY "demo read bookings" ON public.bookings FOR SELECT USING (true);
DROP POLICY IF EXISTS "demo write bookings" ON public.bookings;
CREATE POLICY "demo write bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Seed default availability for demo vendor used in the app
INSERT INTO public.vendor_availability (vendor_id, weekday, is_open, open_from, open_to) VALUES
  ('luxe-crown-salon', 1, true,  '09:00', '19:00'),
  ('luxe-crown-salon', 2, true,  '09:00', '19:00'),
  ('luxe-crown-salon', 3, true,  '09:00', '19:00'),
  ('luxe-crown-salon', 4, true,  '09:00', '19:00'),
  ('luxe-crown-salon', 5, true,  '09:00', '20:00'),
  ('luxe-crown-salon', 6, true,  '08:00', '20:00'),
  ('luxe-crown-salon', 0, false, '10:00', '16:00')
ON CONFLICT (vendor_id, weekday) DO NOTHING;
