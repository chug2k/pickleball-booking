'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  courts: {
    name: string;
  };
};

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const showSuccess = searchParams.get('success') === 'true';

  const fetchBookings = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        window.history.replaceState({}, '', '/bookings');
      }, 5000);
    }
  }, [showSuccess]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">
              Booking confirmed successfully!
            </p>
          </div>
        </div>
      )}

      {/* Email Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your email to view your bookings
        </label>
        <div className="flex gap-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
          />
          <button
            onClick={fetchBookings}
            disabled={!email || isLoading}
            className="bg-green-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {booking.courts.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span>{' '}
                    {booking.start_time} - {booking.end_time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{' '}
                    {booking.customer_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${booking.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookings.length === 0 && email && !isLoading && (
        <p className="text-gray-500 text-center py-12">
          No bookings found for this email address.
        </p>
      )}
    </div>
  );
}
