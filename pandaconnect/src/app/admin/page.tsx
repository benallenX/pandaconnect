// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Image, Plus, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
}

interface Photo {
  id: string;
  name: string;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsResponse = await fetch('/api/events');
        const photosResponse = await fetch('/api/photos');
        
        if (eventsResponse.ok && photosResponse.ok) {
          const eventsData = await eventsResponse.json();
          const photosData = await photosResponse.json();
          setEvents(eventsData);
          setPhotos(photosData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/dashboard">
            <Users className="mr-2 h-4 w-4" />
            View Parent Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Calendar className="mr-2" />
              Events Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm sm:text-base">Total events: {events.length}</p>
            <ul className="mb-4 space-y-2">
              {events.slice(0, 3).map(event => (
                <li key={event.id} className="text-sm sm:text-base">{event.title} - {event.date}</li>
              ))}
            </ul>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/events">
                Manage Events
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Image className="mr-2" />
              Photos Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm sm:text-base">Total photos: {photos.length}</p>
            <ul className="mb-4 space-y-2">
              {photos.slice(0, 3).map(photo => (
                <li key={photo.id} className="text-sm sm:text-base">{photo.name}</li>
              ))}
            </ul>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/photos">
                Manage Photos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/events/create">
            <Plus className="mr-2" />
            Create New Event
          </Link>
        </Button>
      </div>
    </div>
  );
}