import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SearchBar } from "../components/SearchBar";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const [query, setQuery] = useState("");
  const { loading, blogs } = useBlogs({ query });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-6">
        <div className="w-full max-w-screen-lg px-4">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Blog List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={blog.publishedAt || "--/--/----"}
                  occupation={blog.author.occupation}
                  area={blog.area}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No blogs found. Try searching for something else.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
