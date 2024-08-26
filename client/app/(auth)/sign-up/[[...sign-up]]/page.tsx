import { SignUp } from "@clerk/nextjs";
import SignUpForm from '@/app/(auth)/sign-up/SignUpForm';

export default function Page() {
    return (
        <div className="flex items-center justify-center h-screen -">
            <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
            />
        </div>
    )
}