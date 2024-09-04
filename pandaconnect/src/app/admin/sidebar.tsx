// app/admin/AdminSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { Calendar, Image, LayoutDashboard, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transition-transform duration-200 ease-in-out md:relative md:translate-x-0
    `}>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-green-800">Admin Panel</h1>
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </Button>
      </div>
      <nav className="mt-8">
        <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />}>Dashboard</SidebarLink>
        <SidebarLink href="/admin/events/create" icon={<Calendar size={20} />}>Manage Events</SidebarLink>
        <SidebarLink href="/admin/photos" icon={<Image size={20} />}>Manage Photos</SidebarLink>
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />}>ParentDashboard</SidebarLink>
      </nav>
      <div className="absolute bottom-4 left-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700">
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
}