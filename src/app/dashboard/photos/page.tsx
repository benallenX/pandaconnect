// app/(dashboard)/parent/photos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  name: string;
  description?: string;
}

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        // Replace this with your actual API call
        const mockPhotos: Photo[] = [
          { id: '1', url: '/api/placeholder/400/320', name: 'School Play', description: 'Annual school play performance' },
          { id: '2', url: '/api/placeholder/400/320', name: 'Science Fair', description: 'Students showcasing their projects' },
          { id: '3', url: '/api/placeholder/400/320', name: 'Sports Day', description: 'Annual sports event' },
          { id: '4', url: '/api/placeholder/400/320', name: 'Art Exhibition', description: 'Student artwork display' },
          { id: '5', url: '/api/placeholder/400/320', name: 'Graduation Day', description: 'Celebration of our graduates' },
          { id: '6', url: '/api/placeholder/400/320', name: 'Field Trip', description: 'Students exploring the museum' },
        ];
        setPhotos(mockPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  if (isLoading) {
    return <div>Loading photos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">School Photos</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
      {photos.length === 0 ? (
        <p>No photos available at this time.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={photo.url}
                  alt={photo.name}
                  width={400}
                  height={320}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{photo.name}</h3>
                  {photo.description && (
                    <p className="text-sm text-gray-600">{photo.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}