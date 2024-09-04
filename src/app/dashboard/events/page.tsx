// app/(dashboard)/parent/events/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        console.log('Fetched events:', data); // For debugging
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
      {events.length === 0 ? (
        <p>No upcoming events at this time.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{event.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <p className="text-sm text-gray-500">
                  {format(parseISO(event.date), 'MMM d, yyyy')}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}