// components/Sidebar.tsx
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Calendar, Image, LayoutDashboard } from 'lucide-react';

const sidebarItems = [
	{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
	{ icon: Calendar, label: 'Events', href: '/dashboard/events' },
	{ icon: Image, label: 'Photos', href: '/dashboard/photos' },
];

export function Sidebar() {
	return (
		<aside className="w-64 bg-background border-r h-full fixed left-0 top-0 z-10 lg:relative">
			<div className="p-4">
				<h1 className="text-2xl font-bold text-foreground">PandaConnect</h1>
			</div>
			<nav className="mt-8">
				{sidebarItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="flex items-center px-4 py-2 text-foreground hover:bg-accent">
						<item.icon className="w-5 h-5 mr-3" />
						{item.label}
					</Link>
				))}
			</nav>
			<div className="absolute bottom-4 left-4 flex items-center space-x-2">
				
				<UserButton afterSignOutUrl="/" />
			</div>
		</aside>
	);
}
