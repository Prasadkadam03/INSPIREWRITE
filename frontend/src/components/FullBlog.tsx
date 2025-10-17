import { useBlog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar, Circle } from "./BlogCard";
import { formatDate } from "./FormatDate";
import { ThumbsUp } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { FullBlogSkeleton } from "./FullBlogSkeleton";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export const FullBlog = ({ blogId }: { blogId: string }) => {
    const { loading, blog, likes, liked, handleLike } = useBlog({ id: blogId });
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                alert("Blog deleted successfully.");
                navigate("/blogs");
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Failed to delete the blog.");
            }
        }
    };

    if (loading)
        return (
            <div>
                <Appbar />
                <FullBlogSkeleton />
            </div>
        );

    const isAuthor = blog?.author?.id === localStorage.getItem("userId");

    return (
        <div>
            <Appbar button={<ArrowLeft />} />

            <div className="flex justify-center min-h-screen">
                <div className="grid grid-cols-12 w-full max-w-screen-xl pt-12 px-4 lg:px-10">
                    <div className="col-span-12 lg:col-span-8 bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800">
                            {blog?.title}
                        </h1>
                        <div className="flex items-center pt-4 text-sm text-slate-500">
                            <span>{formatDate(blog?.publishedAt || "")}</span>
                            <div className="px-2" />
                            <Circle />
                            <span className="text-blue-500 px-2">{blog?.author.occupation}</span>
                            <Circle />
                            <span className="text-red-500 px-2">{blog?.area}</span>
                        </div>
                        <div className="pt-6 text-base md:text-lg text-gray-700 leading-relaxed">
                            {blog?.content}
                        </div>
                        <div className="pt-6 flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    liked
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                <ThumbsUp
                                    className={`w-5 h-5 mr-2 ${
                                        liked ? "text-white" : "text-gray-800"
                                    }`}
                                />
                                {liked ? "Liked" : "Like"}
                            </button>
                            <span className="text-gray-600 text-sm">
                                {likes} {likes === 1 ? "Like" : "Likes"}
                            </span>
                        </div>
                        {isAuthor && (
                            <div className="pt-6">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Delete Blog
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:pl-10 pt-10 lg:pt-0">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <div className="text-slate-600 text-lg font-semibold mb-4">Author</div>
                            <div className="flex items-center">
                                <Avatar size="big" name={blog?.author?.name || "Anonymous"} />
                                <div className="ml-4">
                                    <div className="text-xl font-bold">
                                        {blog?.author?.name || "Anonymous"}
                                    </div>
                                    <div className="pt-2 text-slate-500">
                                        {blog?.author?.bio || "No Bio"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};