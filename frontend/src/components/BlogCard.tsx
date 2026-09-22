import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatDate } from "./FormatDate";

interface BlogCardProps {
    authorName: string;
    title: string;
    occupation: string;
    content: string;
    publishedDate: string;
    id: string;
    area: string;
    likes?: number;
    variant?: "featured" | "standard";
    index?: number;
}

export const BlogCard = ({ id, authorName, occupation, title, content, publishedDate, area, likes = 0, variant = "standard", index = 0 }: BlogCardProps) => {
    const featured = variant === "featured";
    const excerptLength = featured ? 240 : 160;
    const excerpt = content.length > excerptLength ? `${content.slice(0, excerptLength).trim()}…` : content;
    const readingTime = Math.max(1, Math.ceil(content.length / 1000));

    return (
        <article className={`rise ${featured ? "pt-10" : "border-b border-line"}`} style={featured ? undefined : { animationDelay: `${Math.min(index, 8) * 50}ms` }}>
            <Link
                to={`/blog/${id}`}
                className={featured
                    ? "group block rounded-2xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-ink/20 sm:p-10"
                    : "group block py-8"}
            >
                <p className="eyebrow">{featured ? `Featured · ${area || "General"}` : area || "General"}</p>
                <h2 className={`headline mt-2 transition-colors duration-200 group-hover:text-accent ${featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>{title}</h2>
                <p className={`mt-3 max-w-2xl text-muted ${featured ? "leading-7" : "text-[0.95rem] leading-6"}`}>{excerpt || "Open this story to start reading."}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                    <span className="flex items-center gap-2 text-ink">
                        <Avatar name={authorName} />
                        <span className="font-medium">{authorName}</span>
                        <span className="hidden text-muted sm:inline">· {occupation || "Writer"}</span>
                    </span>
                    <span>{formatDate(publishedDate)}</span>
                    <span>{readingTime} min read</span>
                    <span className="inline-flex items-center gap-1"><Heart size={13} />{likes}</span>
                </div>
            </Link>
        </article>
    );
};

export function Avatar({ name, size = "small" }: { name: string; size?: "small" | "big" }) {
    return (
        <span className={`inline-grid shrink-0 place-items-center rounded-full bg-ink/10 font-semibold text-ink ${size === "small" ? "h-7 w-7 text-xs" : "h-11 w-11 text-base"}`}>
            {(name[0] || "?").toUpperCase()}
        </span>
    );
}
