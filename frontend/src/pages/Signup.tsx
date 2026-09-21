import { Auth } from "../components/Auth"
import { Quote } from "../components/Quotes"

export const AuthLayout = ({ type }: { type: "signup" | "signin" }) => (
    <div className="grid min-h-screen min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(30rem,1.05fr)]">
        <div className="relative z-10 min-w-0">
            <Auth type={type} />
        </div>
        <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
            <Quote />
        </div>
    </div>
)

export const Signup = () => <AuthLayout type="signup" />
