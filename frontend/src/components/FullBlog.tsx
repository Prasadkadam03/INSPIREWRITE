import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar, Circle } from "./BlogCard"
import { formatDate } from "./FormatDate"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 pl-10 w-full  max-w-screen-xl pt-12">
                <div className="col-span-8">
                    <div className="text-5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="flex pt-4">
                        <div className="text-slate-500 pt-2">
                            {formatDate(blog.publishedAt)}
                        </div>
                        <div className="flex justify-center flex-col pl-2 flex justify-center flex-col">
                            <Circle />
                        </div>
                        <div className="p-2 text-blue-500">
                            {blog.author.occupation}
                        </div>
                        <div className="flex justify-center flex-col pl-2 flex justify-center flex-col">
                            <Circle />
                        </div>
                        <div className="p-2 text-red-500">
                            {blog.area}
                        </div>
                    </div>
                    <div className="pt-4">
                        {blog.content}
                    </div>
                    <div className="flex pt-4">
                        <div>o</div>
                    </div>
                </div>
                <div className="col-span-4 lg:col-span-8 col-span-8 order-last lg:order-none pr-2 p-10">
                    <div className="text-slate-600 pr-20 text-lg">
                        Author
                    </div>
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                        </div>
                        <div>
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
}