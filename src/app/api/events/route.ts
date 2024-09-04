// app/api/events/route.ts
// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Define the schema
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
});

// TODO: Replace with your actual database logic
let events: any[] = [];

export async function POST(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // TODO: Check if user has admin rights

  try {
    const body = await request.json();
    const data = eventSchema.parse(body);

    const newEvent = {
      id: Date.now().toString(),
      ...data,
      createdBy: userId,
    };

    // TODO: Replace with actual database insertion
    events.push(newEvent);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  // TODO: In a real app, you'd fetch from a database and possibly implement pagination
  return NextResponse.json(events);
}