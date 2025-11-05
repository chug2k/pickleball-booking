import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      courts: {
        Row: {
          id: number;
          name: string;
          description: string;
          image_url: string;
          hourly_rate: number;
          created_at: string;
        };
      };
      time_slots: {
        Row: {
          id: number;
          court_id: number;
          date: string;
          start_time: string;
          end_time: string;
          is_booked: boolean;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: number;
          court_id: number;
          time_slot_id: number;
          customer_name: string;
          customer_email: string;
          date: string;
          start_time: string;
          end_time: string;
          total_price: number;
          created_at: string;
        };
      };
    };
  };
};
