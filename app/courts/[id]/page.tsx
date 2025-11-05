import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import BookingForm from './BookingForm';

// Disable caching so bookings update in real-time
export const revalidate = 0;

async function getCourt(id: string) {
  const { data: court, error } = await supabase
    .from('courts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !court) {
    return null;
  }

  return court;
}

async function getAvailableSlots(courtId: string, date: string) {
  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('court_id', courtId)
    .eq('date', date)
    .order('start_time');

  if (error) {
    console.error('Error fetching slots:', error);
    return [];
  }

  return slots || [];
}

export default async function CourtPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date?: string };
}) {
  const court = await getCourt(params.id);

  if (!court) {
    notFound();
  }

  // Default to today
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = searchParams.date || today;
  const slots = await getAvailableSlots(params.id, selectedDate);

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a
        href="/"
        className="text-green-700 hover:text-green-900 mb-4 inline-block"
      >
        ← Back to Courts
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Court Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <img
              src={court.image_url}
              alt={court.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {court.name}
              </h1>
              <p className="text-gray-600 mb-4">{court.description}</p>
              <p className="text-3xl font-bold text-green-700">
                ${court.hourly_rate}/hour
              </p>
            </div>
          </div>
        </div>

        {/* Booking Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select Date & Time
            </h2>

            {/* Date Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Date
              </label>
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = date === selectedDate;
                  return (
                    <a
                      key={date}
                      href={`/courts/${params.id}?date=${date}`}
                      className={`text-center p-3 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-green-700 bg-green-50 text-green-700 font-semibold'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {dateObj.toLocaleDateString('en-US', {
                          weekday: 'short',
                        })}
                      </div>
                      <div className="text-lg font-semibold">
                        {dateObj.getDate()}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Time Slots
              </label>
              <BookingForm
                courtId={court.id}
                courtName={court.name}
                hourlyRate={court.hourly_rate}
                selectedDate={selectedDate}
                slots={slots}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
