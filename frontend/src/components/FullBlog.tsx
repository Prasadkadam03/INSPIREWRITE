import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar, Circle } from "./BlogCard";
import { formatDate } from "./FormatDate";

export const FullBlog = ({ blog }: { blog: Blog }) => {
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 w-full max-w-screen-xl pt-12 px-4 lg:px-10">
                    {/* Blog Content Section */}
                    <div className="col-span-12 lg:col-span-8">
                        <h1 className="text-5xl font-extrabold">{blog.title}</h1>
                        <div className="flex items-center pt-4 px-2 text-sm text-slate-500">
                            <span>{formatDate(blog.publishedAt)}</span>
                            <div className="px-2"/>
                            <Circle />
                            <span className="text-blue-500 px-2">{blog.author.occupation}</span>
                            <Circle />
                            <span className="text-red-500 px-2">{blog.area}</span>
                        </div>
                        <div className="pt-6 text-lg px-2 text-gray-700 leading-relaxed">
                            {blog.content}
                        </div>
                    </div>

                    {/* Author Section */}
                    <div className="col-span-12 lg:col-span-4 lg:pl-10 pt-10 lg:pt-0">
                        <div className="text-slate-600 text-lg font-semibold mb-4">Author</div>
                        <div className="flex items-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            <div className="ml-4">
                                <div className="text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500">
                                    {blog.author.bio || "No Bio"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};