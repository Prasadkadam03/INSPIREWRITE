import { Link } from "react-router-dom";
import { formatDate } from "./FormatDate";

interface BlogCardProps {
    authorName: string;
    title: string;
    occupation: string;
    content: string;
    publishedDate: string;
    id: string;
    area: string;
}

export const BlogCard = ({
    id,
    authorName,
    occupation,
    title,
    content,
    publishedDate,
    area,
}: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`}>
            <div className="p-4 border-b border-slate-200 w-screen max-w-screen-md cursor-pointer hover:bg-gray-50 transition">
                {/* Header Section */}
                <div className="flex items-center space-x-2">
                    <Avatar name={authorName} />
                    <span className="font-light text-sm">{authorName}</span>
                    <Circle />
                    <span className="font-thin text-blue-900 text-sm">{occupation}</span>
                    <Circle />
                    <span className="font-thin text-slate-500 text-sm">{formatDate(publishedDate)}</span>
                </div>

                {/* Title Section */}
                <div className="text-xl font-semibold pt-2">{title}</div>

                {/* Content Preview */}
                <div className="text-md font-thin text-gray-700 pt-2">
                    {content.slice(0, 100) + "..."}
                </div>

                {/* Footer Section */}
                <div className="flex items-center space-x-2 pt-4 text-sm text-slate-500">
                    <span>{`${Math.ceil(content.length / 100)} minute(s) read`}</span>
                    <Circle />
                    <span className="font-thin text-red-900">{area}</span>
                </div>
            </div>
        </Link>
    );
};

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({ name, size = "small" }: { name: string; size?: "small" | "big" }) {
    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
                size === "small" ? "w-6 h-6" : "w-10 h-10"
            }`}
        >
            <span
                className={`${
                    size === "small" ? "text-xs" : "text-md"
                } font-extralight text-gray-100`}
            >
                {name[0].toUpperCase()}
            </span>
        </div>
    );
}