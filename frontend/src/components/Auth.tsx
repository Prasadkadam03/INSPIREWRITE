import { ChangeEvent, JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { SignupInput } from "@_prasadk_/inspirewrite-common";
import { Mail, Lock, User, Briefcase, Info } from "lucide-react";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
        occupation: "",
        bio: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPostInputs((prev) => ({ ...prev, [name]: value }));
    };

    const sendRequest = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const jwt = response.data.jwt;
            localStorage.setItem("token", "Bearer " + jwt);
            navigate("/blogs");
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.error || "Something went wrong");
            } else {
                setError("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-4">
                        {type === "signup" ? "Create an Account" : "Sign in to Your Account"}
                    </h1>
                </div>
                {error && (
                    <p className="text-red-500 text-center mt-4 bg-red-100 p-2 rounded">
                        {error}
                    </p>
                )}
                <div>
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            name="name"
                            placeholder="Prasad Kadam"
                            value={postInputs.name}
                            onChange={handleChange}
                            icon={<User size={18} />}
                        />
                    )}
                    <LabelledInput
                        label="Email"
                        name="email"
                        placeholder="prasad@gmail.com"
                        value={postInputs.email}
                        onChange={handleChange}
                        icon={<Mail size={18} />}
                    />
                    {type === "signup" && (
                        <>
                            <LabelledInput
                                label="Occupation"
                                name="occupation"
                                placeholder="Student"
                                value={postInputs.occupation}
                                onChange={handleChange}
                                icon={<Briefcase size={18} />}
                            />
                            <LabelledInput
                                label="Bio"
                                name="bio"
                                placeholder="Write about yourself..."
                                value={postInputs.bio}
                                onChange={handleChange}
                                icon={<Info size={18} />}
                            />
                        </>
                    )}
                    <LabelledInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="******"
                        value={postInputs.password}
                        onChange={handleChange}
                        icon={<Lock size={18} />}
                    />
                    <p className="text-slate-500 flex justify-center items-center pt-4 text-sm">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link
                            className="pl-2 underline text-blue-600 hover:text-blue-800"
                            to={type === "signin" ? "/signup" : "/signin"}
                        >
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                    <button
                        onClick={sendRequest}
                        type="button"
                        disabled={loading}
                        className="mt-6 w-full text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {loading ? "Processing..." : type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputProps {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon?: JSX.Element;
}

const LabelledInput = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    type = "text",
    icon,
}: LabelledInputProps) => {
    return (
        <div className="mt-4">
            <label className="block mb-2 text-sm text-gray-700 font-semibold">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        icon ? "pl-10" : ""
                    }`}
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
};

