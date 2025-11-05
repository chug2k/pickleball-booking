-- Create courts table
CREATE TABLE courts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE time_slots (
  id BIGSERIAL PRIMARY KEY,
  court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(court_id, date, start_time)
);

-- Create bookings table
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  time_slot_id BIGINT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_time_slots_court_date ON time_slots(court_id, date);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_date ON bookings(date);

-- Insert seed data for courts
INSERT INTO courts (name, description, image_url, hourly_rate) VALUES
  ('Court 1 - Indoor Pro', 'Professional indoor court with climate control and premium surface', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500', 35.00),
  ('Court 2 - Indoor Standard', 'Standard indoor court with good lighting and ventilation', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500', 30.00),
  ('Court 3 - Outdoor Premium', 'Premium outdoor court with shade covering and professional nets', 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500', 25.00),
  ('Court 4 - Outdoor Standard', 'Standard outdoor court with great visibility and open air', 'https://images.unsplash.com/photo-1599391836305-07dd35a9dc1e?w=500', 20.00),
  ('Court 5 - Practice Court', 'Perfect for beginners and practice sessions', 'https://images.unsplash.com/photo-1545328788-623693c6e5e9?w=500', 15.00);

-- Function to generate time slots for the next 7 days
DO $$
DECLARE
  court_record RECORD;
  target_date DATE;
  slot_time TIME;
  day_offset INT;
  hour INT;
BEGIN
  -- For each court
  FOR court_record IN SELECT id FROM courts LOOP
    -- For next 7 days
    FOR day_offset IN 0..6 LOOP
      target_date := CURRENT_DATE + day_offset;

      -- Create hourly slots from 8 AM to 8 PM
      FOR hour IN 8..19 LOOP
        slot_time := (hour || ':00:00')::TIME;

        INSERT INTO time_slots (court_id, date, start_time, end_time, is_booked)
        VALUES (
          court_record.id,
          target_date,
          slot_time,
          (slot_time + INTERVAL '1 hour')::TIME,
          FALSE
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
