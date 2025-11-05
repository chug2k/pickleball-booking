import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pickleball Court Booking",
  description: "Book your pickleball court for learning PostHog integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <nav className="bg-green-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-2xl font-bold text-white">
                  🏓 Pickleball Courts
                </a>
              </div>
              <div className="flex space-x-8">
                <a href="/" className="text-white hover:text-green-200">
                  Courts
                </a>
                <a href="/bookings" className="text-white hover:text-green-200">
                  My Bookings
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
