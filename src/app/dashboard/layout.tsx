// app/dashboard/parent/layout.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Calendar, Image, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Mobile sidebar */}
			<div className="lg:hidden">
				<Button
					variant="ghost"
					className="p-2 m-2"
					onClick={() => setSidebarOpen(true)}>
					<Menu size={24} />
				</Button>
			</div>

			{/* Sidebar for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 lg:hidden"
					role="dialog"
					aria-modal="true">
					<div
						className="fixed inset-0 bg-gray-600 bg-opacity-75"
						aria-hidden="true"
						onClick={() => setSidebarOpen(false)}></div>
					<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
						<div className="absolute top-0 right-0 -mr-12 pt-2">
							<Button variant="ghost" onClick={() => setSidebarOpen(false)}>
								<X size={24} />
							</Button>
						</div>
						<SidebarContent />
					</div>
				</div>
			)}

			{/* Static sidebar for desktop */}
			<div className="hidden lg:flex lg:flex-shrink-0">
				<div className="flex flex-col w-64">
					<div className="flex flex-col h-0 flex-1">
						<SidebarContent />
					</div>
				</div>
			</div>

			{/* Main content area */}
			<main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
		</div>
	);
}

function SidebarContent() {
	return (
		<>
			<div className="flex items-center flex-shrink-0 px-4">
				<h1 className="text-2xl font-bold text-green-800">PandaConnect</h1>
			</div>
			<nav className="mt-8 flex-1 flex flex-col">
				<SidebarLink href="/dashboard/events" icon={<Calendar size={20} />}>
					Events
				</SidebarLink>
				<SidebarLink
					href="/dashboard/schoolcalendar"
					icon={<Calendar size={20} />}>
					School Calendar
				</SidebarLink>
				<SidebarLink href="/dashboard/photos" icon={<Image size={20} />}>
					Photos
				</SidebarLink>
			</nav>
			<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
				<UserButton />
			</div>
		</>
	);
}

function SidebarLink({
	href,
	icon,
	children,
}: {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700">
			{icon}
			<span className="ml-3">{children}</span>
		</Link>
	);
}
