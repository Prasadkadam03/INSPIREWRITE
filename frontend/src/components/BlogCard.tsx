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
        <div>
            <Link to={`/blog/${id}`}>
            <div className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white max-w-screen-md mx-auto">
                <div className="flex items-center space-x-3">
                    <Avatar name={authorName} />
                    <div>
                        <div className="text-sm font-medium text-gray-800">{authorName}</div>
                        <div className="text-xs text-gray-500">{occupation}</div>
                    </div>
                </div>

                <div className="mt-4 text-2xl font-bold text-gray-900">{title}</div>

                <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {content.slice(0, 120)}...
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span>{`${Math.ceil(content.length / 100)} min read`}</span>
                        <Circle />
                        <span className="text-red-600">{area}</span>
                    </div>
                    <span>{formatDate(publishedDate)}</span>
                </div>
            </div>
        </Link>
        </div>
    );
};

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-gray-400"></div>;
}

export function Avatar({ name, size = "small" }: { name: string; size?: "small" | "big" }) {
    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
                size === "small" ? "w-8 h-8" : "w-12 h-12"
            }`}
        >
            <span
                className={`${
                    size === "small" ? "text-sm" : "text-lg"
                } font-semibold text-gray-100`}
            >
                {name[0].toUpperCase()}
            </span>
        </div>
    );
}