import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-100 to-green-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
			<div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
				<div className="p-6 sm:p-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-center text-green-800 mb-4 sm:mb-6">
						PandaConnect
					</h1>
					<p className="text-center text-green-700 text-sm sm:text-base mb-6">
						Connecting teachers and parents for better education
					</p>
					<div className="space-y-3 sm:space-y-4">
						<Button
							asChild
							className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3">
							<Link href="/sign-in">Sign In</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="w-full border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base py-2 sm:py-3">
							<Link href="/sign-up">Sign Up</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
