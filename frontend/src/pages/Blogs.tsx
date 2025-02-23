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

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          <SearchBar onSearch={handleSearch} />
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
      </div>
    </div>
  );
};
