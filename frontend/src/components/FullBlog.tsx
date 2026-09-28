import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, LoaderCircle, Trash2 } from "lucide-react";
import { BACKEND_URL } from "../config";
import { useBlog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { formatDate } from "./FormatDate";
import { FullBlogSkeleton } from "./FullBlogSkeleton";

const useReadingProgress = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return progress;
};

export const FullBlog = ({ blogId }: { blogId: string }) => {
    const { loading, blog, likes, liked, handleLike, actionError } = useBlog({ id: blogId });
    const navigate = useNavigate();
    const progress = useReadingProgress();
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError(null);
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blogId}`, { headers: { Authorization: localStorage.getItem("token") } });
            navigate("/blogs", { replace: true });
        } catch {
            setDeleteError("This story could not be deleted. Check your connection and try again.");
            setDeleting(false);
        }
    };

    if (loading) return <div><Appbar /><FullBlogSkeleton /></div>;
    if (!blog) return null;

    const isAuthor = blog.author.id === localStorage.getItem("userId");
    const readingTime = Math.max(1, Math.ceil(blog.content.length / 1000));
    const authorName = blog.author.name || "Anonymous";

    return (
        <div className="min-h-screen">
            <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent transition-transform duration-100" style={{ transform: `scaleX(${progress})` }} />
            <Appbar button={<ArrowLeft size={18} />} />
            <main id="main-content" className="page-shell pb-28 pt-12 sm:pt-20">
                <article className="mx-auto max-w-3xl">
                    <header className="border-b border-line pb-8">
                        <p className="eyebrow rise">{blog.area || "General"}</p>
                        <h1 className="headline rise d-1 mt-3 text-balance text-4xl sm:text-5xl">{blog.title}</h1>
                        <div className="rise d-2 mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
                            <Avatar name={authorName} />
                            <span className="font-medium text-ink">{authorName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatDate(blog.publishedAt || "")}</span>
                            <span aria-hidden="true">·</span>
                            <span>{readingTime} min read</span>
                        </div>
                    </header>

                    <div className="reading-copy rise d-3 mt-10 whitespace-pre-wrap">
                        {blog.content}
                    </div>

                    <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
                        <div className="flex items-center gap-4">
                            <button onClick={handleLike} aria-pressed={liked} className={liked ? "button-accent" : "button-secondary"}>
                                <Heart size={16} fill={liked ? "currentColor" : "none"} className={`transition-transform duration-200 ${liked ? "scale-110" : ""}`} />
                                {liked ? "Liked" : "Like this story"}
                            </button>
                            <span className="text-sm text-muted">{likes} {likes === 1 ? "like" : "likes"}</span>
                        </div>
                        {actionError && <p role="alert" className="notice-error w-full">{actionError}</p>}
                    </div>

                    <aside className="mt-10 rounded-2xl border border-line bg-surface p-6" aria-label="About the author">
                        <div className="flex items-start gap-4">
                            <Avatar name={authorName} size="big" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted">Written by</p>
                                <h2 className="mt-0.5 text-lg font-semibold">{authorName}</h2>
                                <p className="text-sm text-muted">{blog.author.occupation || "Writer"}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-[0.95rem] leading-7 text-muted">{blog.author.bio || "A member of the InspireWrite community."}</p>

                        {isAuthor && (
                            <div className="mt-7 border-t border-line pt-6">
                                {!confirmingDelete ? (
                                    <button onClick={() => setConfirmingDelete(true)} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-red-600 transition-opacity dark:text-red-400 hover:opacity-75"><Trash2 size={15} />Delete story</button>
                                ) : (
                                    <div className="drop">
                                        <h3 className="font-semibold">Delete this story?</h3>
                                        <p className="mt-1 text-sm text-muted">This cannot be undone.</p>
                                        {deleteError && <p role="alert" className="notice-error mt-4">{deleteError}</p>}
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <button onClick={handleDelete} disabled={deleting} className="button-accent">{deleting ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}{deleting ? "Deleting…" : "Delete story"}</button>
                                            <button onClick={() => { setConfirmingDelete(false); setDeleteError(null); }} disabled={deleting} className="button-secondary">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>
                </article>
            </main>
        </div>
    );
};
