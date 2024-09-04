// app/(dashboard)/parent/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

export default function SchoolCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
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
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const selectedDateEvents = events.filter(
    (event) => event.date === format(date || new Date(), 'yyyy-MM-dd')
  );

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">School Calendar</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Events for {format(date || new Date(), 'MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p>No events scheduled for this date.</p>
            ) : (
              <ul className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <li key={event.id} className="border-b pb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">Time: {event.time}</p>
                    <p className="text-sm">{event.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}