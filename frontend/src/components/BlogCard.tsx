import { Link } from "react-router-dom";
import { formatDate } from "./FormatDate";
import { ThumbsUp } from "lucide-react";

interface BlogCardProps {
    authorName: string;
    title: string;
    occupation: string;
    content: string;
    publishedDate: string;
    id: string;
    area: string;
    likes?: number;
}

export const BlogCard = ({
    id,
    authorName,
    occupation,
    title,
    content,
    publishedDate,
    area,
    likes,
}: BlogCardProps) => {
    return (
        <div className="p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white max-w-screen-md mx-auto">
            <Link to={`/blog/${id}`}>
                {/* Author Info */}
                <div className="flex items-center space-x-3">
                    <Avatar name={authorName} />
                    <div>
                        <div className="text-sm font-medium text-gray-800">{authorName}</div>
                        <div className="text-xs text-gray-500">{occupation}</div>
                    </div>
                </div>

                {/* Blog Title */}
                <div className="mt-4 text-lg sm:text-xl font-bold text-gray-900">{title}</div>

                {/* Blog Content Preview */}
                <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {content.slice(0, 120)}...
                </div>

                {/* Blog Metadata */}
                <div className="flex flex-wrap items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span>{`${Math.ceil(content.length / 200)} min read`}</span>
                        <Circle />
                        <div className="flex items-center space-x-1">
                            <ThumbsUp size={16} className="text-gray-500" />
                            <span>{likes || 0}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className="text-red-600">{area}</span>
                        <span className="ml-2">{formatDate(publishedDate)}</span>
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
                size === "small" ? "w-6 h-6 sm:w-8 sm:h-8" : "w-10 h-10 sm:w-12 sm:h-12"
            }`}
        >
            <span
                className={`${
                    size === "small" ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                } font-semibold text-gray-100`}
            >
                {name[0].toUpperCase()}
            </span>
        </div>
    );
}