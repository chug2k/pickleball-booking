# Pickleball Court Booking - PostHog Integration Starter

A fully functional pickleball court booking system built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. This starter app is designed for learning metrics-driven development with PostHog integration.

## Features

- **Court Listings**: Browse available pickleball courts with details and pricing
- **Weekly Timetable**: View availability for the next 7 days
- **Hourly Booking Slots**: Book courts by the hour (8 AM - 8 PM)
- **Booking Management**: Submit bookings with customer information
- **My Bookings**: View all bookings by email
- **Real-time Availability**: Slots are marked as booked after reservation
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Open-source Firebase alternative for database

## Database Schema

### Tables

- **courts**: Court information with pricing
- **time_slots**: Available time slots for each court
- **bookings**: Customer bookings with date and time

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm installed
- Supabase CLI installed ([Install Guide](https://supabase.com/docs/guides/cli))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Supabase locally**:
   ```bash
   supabase start
   ```

   This will start a local Supabase instance and run the migrations automatically, creating all tables and seeding sample data including 5 courts and time slots for the next 7 days.

3. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   The default local Supabase credentials should work out of the box. If needed, update the values with your local Supabase URL and anon key from the `supabase start` output.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Note: This app runs on port 3001 by default to avoid conflicts with other apps.

5. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

## PostHog Integration Ideas

This app is ready for PostHog integration. Here are some key events to track:

### Key Events to Track

- `court_viewed`: When a user views a court detail page
- `date_selected`: When user selects a date from the calendar
- `time_slot_selected`: When user selects a time slot
- `booking_started`: When user fills out the booking form
- `booking_completed`: When booking is confirmed
- `my_bookings_viewed`: When user checks their bookings

### Useful Properties

- Court ID, name, hourly rate
- Selected date and time
- Booking total price
- Customer information (hashed for privacy)
- Time to complete booking

### User Journey to Track

```
Court Listing → Court Detail → Date Selection → Time Selection → Booking Form → Confirmation
```

### Example Implementation

```typescript
// Track booking completion
posthog.capture('booking_completed', {
  court_id: courtId,
  court_name: courtName,
  date: selectedDate,
  time_slot: `${startTime}-${endTime}`,
  price: totalPrice,
  booking_duration_seconds: timeSpent
})
```

## Project Structure

```
pickleball-booking/
├── app/
│   ├── api/bookings/      # Booking API routes
│   ├── bookings/          # My bookings page
│   ├── courts/[id]/       # Court detail with timetable
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (court listing)
├── lib/
│   └── supabase.ts        # Supabase client
├── supabase/
│   ├── config.toml        # Supabase configuration
│   └── migrations/        # Database migrations
└── package.json
```

## Sample Data

The app comes pre-seeded with:
- 5 courts (3 indoor, 2 outdoor)
- Different pricing tiers ($15-$35/hour)
- Time slots for the next 7 days (8 AM - 8 PM hourly)
- Realistic court images from Unsplash

## Development Tips

1. **Viewing the database**: Run `supabase studio` to open the Supabase Studio UI
2. **Resetting data**: Run `supabase db reset` to reset the database and re-run migrations
3. **Extending time slots**: Modify the migration to generate more days ahead
4. **Custom ports**: Supabase uses ports 54331-54333 for this app (configured in `supabase/config.toml`)

## Next Steps

1. Install and configure PostHog
2. Add event tracking to the booking funnel
3. Create conversion funnel to identify drop-off points
4. Track which courts are most popular
5. Monitor booking completion rates by day/time
6. Set up session recording to see user interaction patterns

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostHog Documentation](https://posthog.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
