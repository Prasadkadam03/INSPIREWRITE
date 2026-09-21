import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type { SignupInput } from "@_prasadk_/inspirewrite-common";
import { BACKEND_URL } from "../config";
import { Brand, SkipLink } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({ name: "", email: "", password: "", occupation: "", bio: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isSignup = type === "signup";

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPostInputs((current) => ({ ...current, [name]: value }));
    };

    const sendRequest = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${isSignup ? "signup" : "signin"}`, postInputs);
            localStorage.setItem("token", `Bearer ${response.data.jwt}`);
            navigate("/blogs");
        } catch (requestError) {
            setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || "Your details could not be verified." : "The request could not be completed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="main-content" className="flex min-h-screen min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-14">
            <SkipLink />
            <div className="flex items-center justify-between">
                <Brand to="/" />
                <ThemeToggle />
            </div>

            <div key={type} className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
                <p className="eyebrow rise">{isSignup ? "Start writing" : "Welcome back"}</p>
                <h1 className="headline rise d-1 mt-4 text-4xl">
                    {isSignup ? <>Make room for your ideas.</> : <>Continue where you left off.</>}
                </h1>

                {error && <p role="alert" className="notice-error drop mt-8">{error}</p>}
                <form onSubmit={sendRequest} className="rise d-2 mt-8 space-y-4">
                    {isSignup && <Field label="Name" name="name" value={postInputs.name} onChange={handleChange} placeholder="Your name" autoComplete="name" minLength={3} />}
                    <Field label="Email" name="email" type="email" value={postInputs.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                    {isSignup && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Occupation" name="occupation" value={postInputs.occupation} onChange={handleChange} placeholder="Writer, student…" autoComplete="organization-title" minLength={3} />
                            <Field label="Short bio" name="bio" value={postInputs.bio} onChange={handleChange} placeholder="What you write about" autoComplete="off" minLength={3} />
                        </div>
                    )}
                    <Field label="Password" name="password" type="password" value={postInputs.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} />
                    <button type="submit" disabled={loading || !postInputs.email || !postInputs.password || (isSignup && !postInputs.name)} className="button-primary group/submit !mt-7 w-full !min-h-12">
                        {loading && <LoaderCircle size={17} className="animate-spin" />}
                        {loading ? (isSignup ? "Creating account…" : "Signing in…") : isSignup ? "Create account" : "Sign in"}
                        {!loading && <ArrowRight size={16} className="transition-transform duration-200 group-hover/submit:translate-x-0.5" />}
                    </button>
                </form>
                <p className="rise d-3 mt-6 text-sm text-muted">
                    {isSignup ? "Already have an account?" : "New to InspireWrite?"}{" "}
                    <Link className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent" to={isSignup ? "/signin" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link>
                </p>
            </div>
        </main>
    );
};

interface FieldProps { label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; placeholder: string; type?: string; autoComplete: string; minLength?: number; }
const Field = ({ label, name, value, onChange, placeholder, type = "text", autoComplete, minLength }: FieldProps) => (
    <div>
        <label htmlFor={name} className="field-label">{label}</label>
        <input id={name} name={name} value={value} onChange={onChange} type={type} className="text-field" placeholder={placeholder} autoComplete={autoComplete} minLength={minLength} required />
    </div>
);
