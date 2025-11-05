import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const bookingData = await request.json();

  // Create the booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 });
  }

  // Mark the time slot as booked
  const { error: slotError } = await supabase
    .from('time_slots')
    .update({ is_booked: true })
    .eq('id', bookingData.time_slot_id);

  if (slotError) {
    // Rollback booking if slot update fails
    await supabase.from('bookings').delete().eq('id', booking.id);
    return NextResponse.json({ error: slotError.message }, { status: 500 });
  }

  return NextResponse.json({ booking });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  let query = supabase
    .from('bookings')
    .select('*, courts(name, hourly_rate)')
    .order('date', { ascending: false })
    .order('start_time', { ascending: false });

  if (email) {
    query = query.eq('customer_email', email);
  }

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}
