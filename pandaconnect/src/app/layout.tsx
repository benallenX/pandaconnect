// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'PandaConnect',
	description: 'Connecting teachers and parents for better education',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</head>
				<body
					className={`${inter.className} min-h-screen h-screen overflow-hidden flex flex-col`}>
					<ClerkLoading>
						<div className="flex items-center justify-center w-full h-full">
							<div className="flex flex-col items-center justify-center p-4 text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
								<p className="mt-4 text-base sm:text-lg font-semibold">
									Loading your panda-tastic content...
								</p>
							</div>
						</div>
					</ClerkLoading>
					<ClerkLoaded>
						<div className="flex flex-col h-full overflow-hidden">
							{children}
						</div>
					</ClerkLoaded>
				</body>
			</html>
		</ClerkProvider>
	);
}
