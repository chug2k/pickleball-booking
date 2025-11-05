'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function BookingForm({
  courtId,
  courtName,
  hourlyRate,
  selectedDate,
  slots,
}: {
  courtId: number;
  courtName: string;
  hourlyRate: number;
  selectedDate: string;
  slots: TimeSlot[];
}) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);

    try {
      const slot = slots.find((s) => s.id === selectedSlot);
      if (!slot) return;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          court_id: courtId,
          time_slot_id: selectedSlot,
          customer_name: formData.name,
          customer_email: formData.email,
          date: selectedDate,
          start_time: slot.start_time,
          end_time: slot.end_time,
          total_price: hourlyRate,
        }),
      });

      if (response.ok) {
        router.push('/bookings?success=true');
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSlotData = slots.find((s) => s.id === selectedSlot);

  return (
    <div>
      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {slots.length === 0 && (
          <p className="col-span-full text-gray-500 text-center py-8">
            No time slots available for this date.
          </p>
        )}
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => !slot.is_booked && handleSlotSelect(slot.id)}
            disabled={slot.is_booked}
            className={`p-4 rounded-lg border-2 text-center transition-colors ${
              slot.is_booked
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectedSlot === slot.id
                ? 'border-green-700 bg-green-50 text-green-700 font-semibold'
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="text-sm font-medium">
              {slot.start_time} - {slot.end_time}
            </div>
            {slot.is_booked && (
              <div className="text-xs mt-1">Booked</div>
            )}
          </button>
        ))}
      </div>

      {/* Booking Form */}
      {showForm && selectedSlotData && (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Complete Your Booking
          </h3>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Court:</span> {courtName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Date:</span>{' '}
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Time:</span>{' '}
              {selectedSlotData.start_time} - {selectedSlotData.end_time}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              Total: ${hourlyRate.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedSlot(null);
              }}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
