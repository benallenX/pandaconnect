// app/admin/sign-in/page.tsx
'use client';

import { useState } from 'react';
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// List of allowed admin email addresses or domains
const ALLOWED_EMAILS = ['benjaminaallenjr@gmail.com', 'admin2@pandaconnect.com', 'benjamin.allen@apsk12.org'];
const ALLOWED_DOMAINS = ['apsk12.org'];

function isAllowedEmail(email: string): boolean {
  if (ALLOWED_EMAILS.includes(email)) return true;
  return ALLOWED_DOMAINS.some(domain => email.endsWith(`@${domain}`));
}

export default function AdminSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAllowedEmail(email)) {
      setError('You are not authorized to access the admin area.');
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/admin");
      }
      else {
        console.error("Sign in result", result);
        setError("Sign in failed. Please check your credentials and try again.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.errors[0].message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Admin Sign In</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
          Sign In
        </Button>
      </form>
    </div>
  );
}