import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [area, setArea] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePublish = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                { title, content, area },
                {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );
            navigate(`/blog/${response.data.id}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Failed to publish the blog.");
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
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <h1 className="text-3xl font-extrabold mb-6 text-center">Publish a Blog</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <LabelledInput
                        label="Title"
                        value={title}
                        placeholder="Enter the title of your blog"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <LabelledInput
                        label="Area of Blog"
                        value={area}
                        placeholder="Enter the area of your blog (e.g., Technology, Health)"
                        onChange={(e) => setArea(e.target.value)}
                    />
                    <TextEditor
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        onClick={handlePublish}
                        type="button"
                        disabled={loading}
                        className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

function LabelledInput({
    label,
    value,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}

function TextEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={8}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                placeholder="Write your blog content here..."
                required
            />
        </div>
    );
}