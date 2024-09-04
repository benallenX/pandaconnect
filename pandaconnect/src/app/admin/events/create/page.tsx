'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon, Plus, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  date: z.date({ required_error: "A date is required" }),
  time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 'Invalid time format'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
});

type FormValues = z.infer<typeof formSchema>;

interface Event extends Omit<FormValues, 'date'> {
  id: string;
  date: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: new Date(),
      time: '',
      description: '',
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({ title: "Error", description: "Failed to fetch events", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/events/${data.id}` : '/api/events';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: format(data.date, "yyyy-MM-dd"),
          time: format(parse(data.time, 'h:mm a', new Date()), 'HH:mm')
        }),
      });

      if (!response.ok) throw new Error('Failed to save event');
      
      await fetchEvents();
      form.reset();
      setEditingEvent(null);
      toast({ title: "Success", description: `Event ${data.id ? 'updated' : 'created'} successfully` });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({ title: "Error", description: "Failed to save event", variant: "destructive" });
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event');
      
      await fetchEvents();
      toast({ title: "Success", description: "Event deleted successfully" });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      ...event,
      date: new Date(event.date),
      time: format(parse(event.time, 'HH:mm', new Date()), 'h:mm a')
    });
  };

  if (isLoading) return <div>Loading events...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Events Management</h1>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 2:30 PM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Date:</strong> {format(new Date(event.date), 'MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(parse(event.time, 'HH:mm', new Date()), 'h:mm a')}</p>
              <p>{event.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => editEvent(event)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}