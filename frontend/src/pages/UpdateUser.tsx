import { useState, useEffect } from "react";
import axios from "axios";
import { updateUserInput } from "@_prasadk_/inspirewrite-common";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/Appbar";

export const UpdateUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        occupation: "",
        bio: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${BACKEND_URL}/api/v1/user`, {
                    headers: {
                        Authorization: token || "",
                    },
                });
                setFormData({
                    name: response.data.name || "",
                    occupation: response.data.occupation || "",
                    bio: response.data.bio || "",
                });
            } catch (err) {
                setError("Failed to fetch user data. Please try again.");
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validation = updateUserInput.safeParse(formData);
        if (!validation.success) {
            setError("Invalid input. Please check your details.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${BACKEND_URL}/api/v1/user/updateUser`,
                validation.data,
                {
                    headers: {
                        Authorization: token || "",
                    },
                }
            );
            alert("Profile updated successfully!");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Failed to update profile.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Appbar />
            <div className="h-screen flex justify-center items-center bg-gray-100">
                <div className="w-full max-w-md pb-100">
                    <h1 className="text-3xl font-extrabold text-center mb-6">Update Your Profile</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <LabelledInput
                            label="Name"
                            name="name"
                            value={formData.name}
                            placeholder="Your Name"
                            onChange={handleChange}
                        />
                        <LabelledInput
                            label="Occupation"
                            name="occupation"
                            value={formData.occupation}
                            placeholder="Your Occupation"
                            onChange={handleChange}
                        />
                        <LabelledInput
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            placeholder="Write about yourself..."
                            onChange={handleChange}
                            type="textarea"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;

// Reusable LabelledInput Component
interface LabelledInputProps {
    label: string;
    name: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
}

const LabelledInput = ({
    label,
    name,
    value,
    placeholder,
    onChange,
    type = "text",
}: LabelledInputProps) => {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={placeholder}
                    rows={4}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};