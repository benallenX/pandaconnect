'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, MessageSquare, Camera } from 'lucide-react';

interface Event {
	id: string;
	title: string;
	date: string;
	time: string;
	description: string;
}

export default function ParentDashboard() {
	const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchEvents() {
			try {
				const response = await fetch('/api/events');
				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}
				const events: Event[] = await response.json();

				const sortedEvents = events.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
				);
				const upcomingEvent = sortedEvents.find(
					(event) => new Date(`${event.date}T${event.time}`) >= new Date(),
				);

				setCurrentEvent(upcomingEvent || null);
			} catch (error) {
				console.error('Error fetching events:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchEvents();
	}, []);

	if (isLoading) {
		return <div className="text-center py-10">Loading dashboard...</div>;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl md:text-3xl font-bold text-green-800">
				Welcome to Your Parent Dashboard
			</h1>

			<Card className="bg-green-50 border-green-200">
				<CardHeader>
					<CardTitle className="flex items-center text-green-800 text-lg md:text-xl">
						<CalendarDays className="mr-2" />
						Current/Upcoming Event
					</CardTitle>
				</CardHeader>
				<CardContent>
					{currentEvent ? (
						<div>
							<h3 className="font-semibold text-lg md:text-xl mb-2">
								{currentEvent.title}
							</h3>
							<p className="text-green-700 text-sm md:text-base">
								<strong>Date:</strong> {currentEvent.date}
							</p>
							<p className="text-green-700 text-sm md:text-base">
								<strong>Time:</strong> {currentEvent.time}
							</p>
							<p className="mt-2 text-sm md:text-base">
								{currentEvent.description}
							</p>
						</div>
					) : (
						<p className="text-sm md:text-base">
							No upcoming events at this time.
						</p>
					)}
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg md:text-xl">
							<MessageSquare className="mr-2 text-green-600" />
							Recent Announcements
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm md:text-base">No recent announcements.</p>
						<Button
							asChild
							variant="link"
							className="mt-4 text-green-600 text-sm md:text-base">
							<Link href="/dashboard/parent/announcements">
								View All Announcements
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center text-lg md:text-xl">
							<Camera className="mr-2 text-green-600" />
							Latest Photos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm md:text-base">No recent photos.</p>
						<Button
							asChild
							variant="link"
							className="mt-4 text-green-600 text-sm md:text-base">
							<Link href="/dashboard/photos">View All Photos</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
