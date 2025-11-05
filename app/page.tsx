import { supabase } from '@/lib/supabase';
import Link from 'next/link';

async function getCourts() {
  const { data: courts, error } = await supabase
    .from('courts')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching courts:', error);
    return [];
  }

  return courts;
}

export default async function Home() {
  const courts = await getCourts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Available Pickleball Courts
      </h1>
      <p className="text-gray-600 mb-8">
        Choose a court and book your time slot
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court: any) => (
          <Link
            key={court.id}
            href={`/courts/${court.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={court.image_url}
                alt={court.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {court.name}
              </h3>
              <p className="text-gray-600 mb-4">{court.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-700">
                  ${court.hourly_rate}/hour
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Book Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courts.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No courts available at the moment.
        </p>
      )}
    </div>
  );
}
