import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, RotateCcw } from "lucide-react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { SearchBar } from "../components/SearchBar";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const [query, setQuery] = useState("");
  const { loading, blogs, error, retry } = useBlogs({ query });
  const handleSearch = useCallback((newQuery: string) => setQuery(newQuery), []);
  const searching = Boolean(query.trim());
  const featured = searching ? undefined : blogs[0];
  const remaining = featured ? blogs.slice(1) : blogs;

  const heading = searching ? "Search results" : featured ? "More from the community" : "Community stories";
  const subheading = searching ? `${blogs.length} ${blogs.length === 1 ? "story" : "stories"} found` : "Ideas, observations, and stories from writers here.";

  return (
    <div className="min-h-screen">
      <Appbar />
      <main id="main-content" className="page-shell pb-28">
        {error ? (
          <section className="rise mx-auto max-w-xl py-28 text-center" role="alert">
            <p className="eyebrow">Stories could not be loaded</p>
            <h1 className="headline mt-3 text-3xl">The reading room is resting.</h1>
            <p className="mt-4 text-muted">Check your connection, then try loading the community again.</p>
            <button onClick={retry} className="button-primary mt-8"><RotateCcw size={16} />Try again</button>
          </section>
        ) : (
          <>
            {loading && !searching ? <BlogSkeleton featured /> : featured && <BlogCard {...toCardProps(featured)} variant="featured" />}

            <section className="pt-14" aria-live="polite" aria-busy={loading}>
              <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="headline text-2xl">{heading}</h1>
                  <p className="mt-2 text-sm text-muted">{loading ? "Gathering stories…" : subheading}</p>
                </div>
                <div className="w-full md:max-w-sm"><SearchBar onSearch={handleSearch} /></div>
              </div>

              {loading ? (
                [0, 1, 2].map((item) => <BlogSkeleton key={item} />)
              ) : remaining.length > 0 ? (
                remaining.map((blog, index) => <BlogCard key={blog.id} index={index} {...toCardProps(blog)} />)
              ) : !featured || searching ? (
                <div className="rise mx-auto max-w-xl py-24 text-center">
                  <p className="eyebrow">Nothing to read here yet</p>
                  <h2 className="headline mt-3 text-2xl">{searching ? <>No stories match “{query.trim()}”.</> : <>The first page is yours.</>}</h2>
                  <p className="mt-4 leading-7 text-muted">{searching ? "Try a different title, phrase, or writer name." : "Share an idea with the community and begin the collection."}</p>
                  {!searching && <Link to="/publish" className="button-accent mt-8"><PenLine size={16} />Write the first story</Link>}
                </div>
              ) : (
                <p className="fade py-12 text-center text-sm text-muted">One story so far. The next page is open.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

function toCardProps(blog: ReturnType<typeof useBlogs>["blogs"][number]) {
  return { id: blog.id, authorName: blog.author.name || "Anonymous", occupation: blog.author.occupation, title: blog.title, content: blog.content, publishedDate: blog.publishedAt || "", area: blog.area, likes: blog._count.likes };
}
