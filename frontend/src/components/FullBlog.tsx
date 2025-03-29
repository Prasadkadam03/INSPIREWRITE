import { useBlog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar, Circle } from "./BlogCard";
import { formatDate } from "./FormatDate";
import { ThumbsUp } from "lucide-react"; // Import the ThumbsUp icon

export const FullBlog = ({ blogId }: { blogId: string }) => {
    const { loading, blog, likes, liked, handleLike } = useBlog({ id: blogId });

    if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

    return (
        <div>
            <Appbar />
            <div className="flex justify-center bg-gray-50 min-h-screen">
                <div className="grid grid-cols-12 w-full max-w-screen-xl pt-12 px-4 lg:px-10">
                    {/* Blog Content Section */}
                    <div className="col-span-12 lg:col-span-8 bg-white shadow-md rounded-lg p-6">
                        {blog && <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">{blog.title}</h1>}
                        <div className="flex items-center pt-4 text-sm text-slate-500">
                            <span>{formatDate(blog?.publishedAt || "")}</span>
                            <div className="px-2" />
                            <Circle />
                            <span className="text-blue-500 px-2">{blog?.author.occupation}</span>
                            <Circle />
                            <span className="text-red-500 px-2">{blog?.area}</span>
                        </div>
                        <div className="pt-6 text-lg text-gray-700 leading-relaxed">
                            {blog?.content}
                        </div>
                        {/* Like Button */}
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
                    </div>

                    {/* Author Section */}
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