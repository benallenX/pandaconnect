// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<SignUp afterSignOutUrl="/"
				appearance={{
					elements: {
						formButtonPrimary: 'border-green-600 text-green-600 hover:bg-green-50',
						card: 'shadow-none',
					},
				}}
			/>
		</div>
  );
}