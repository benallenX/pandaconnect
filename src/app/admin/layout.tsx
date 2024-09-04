// app/admin/layout.tsx
import { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './sidebar';
import MobileMenuToggle from './mobilemenu';

// List of allowed admin email addresses or domains
const ALLOWED_EMAILS = ['benjaminaallenjr@gmail.com', 'admin2@pandaconnect.com', 'benjamin.allen@apsk12.org'];
const ALLOWED_DOMAINS = ['apsk12.org'];

function isAllowedEmail(email: string): boolean {
  if (ALLOWED_EMAILS.includes(email)) return true;
  return ALLOWED_DOMAINS.some(domain => email.endsWith(`@${domain}`));
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  if (!userEmail || !isAllowedEmail(userEmail)) {
    redirect('/dashboard/parent'); // Redirect to parent dashboard if not an admin
  }

  // If we reach here, the user is an authorized admin
  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <MobileMenuToggle />
      <AdminSidebar />
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}