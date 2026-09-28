import { type ReactNode, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Eye, LoaderCircle, Send } from "lucide-react";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [area, setArea] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const navigate = useNavigate();
    const missing = [
        area.trim().length < 3 && { id: "story-topic", label: "a topic (3+ characters)" },
        title.trim().length < 3 && { id: "story-title", label: "a title (3+ characters)" },
        content.trim().length < 10 && { id: "story-content", label: "at least 10 characters of story" },
    ].filter((item): item is { id: string; label: string } => Boolean(item));
    const canPreview = missing.length === 0;

    const openPreview = () => {
        if (!canPreview) {
            setError(`Add ${missing.map((item) => item.label).join(", ")} to preview.`);
            document.getElementById(missing[0].id)?.focus();
            return;
        }
        setError(null);
        setPreviewMode(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    const handlePublish = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, { title, content, area }, { headers: { Authorization: localStorage.getItem("token") || "" } });
            navigate(`/blog/${response.data.id}`);
        } catch (requestError) {
            setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || "Your story could not be published." : "Your story could not be published.");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen">
            <Appbar button={<ArrowLeft size={18} />} />
            <main id="main-content" className="page-shell pb-28 pt-10 sm:pt-10">
                <div className="mx-auto max-w-3xl">
                    <div className="rise flex items-center justify-between gap-4 border-b border-line pb-5">
                        <div className="inline-flex rounded-lg border border-line p-1 text-sm" aria-label="Editor mode">
                            <ModeTab active={!previewMode} onClick={() => { setPreviewMode(false); setError(null); }}><Edit3 size={14} />Write</ModeTab>
                            <ModeTab active={previewMode} onClick={openPreview}><Eye size={14} />Preview</ModeTab>
                        </div>
                        <p className="text-xs tabular-nums text-muted">{words} {words === 1 ? "word" : "words"} · {Math.max(1, Math.ceil(content.length / 1000))} min</p>
                    </div>

                    {error && <p role="alert" className="notice-error drop mt-6">{error}</p>}

                    {previewMode ? (
                        <article key="preview" className="rise pt-10">
                            <p className="eyebrow">{area}</p>
                            <h1 className="headline mt-3 text-balance text-4xl sm:text-5xl">{title}</h1>
                            <div className="reading-copy mt-8 whitespace-pre-wrap border-t border-line pt-8">{content}</div>
                            <div className="mt-14 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
                                <button onClick={() => { setPreviewMode(false); setError(null); }} className="button-secondary"><Edit3 size={15} />Keep editing</button>
                                <button onClick={handlePublish} type="button" disabled={loading} className="button-accent">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}{loading ? "Publishing…" : "Publish story"}</button>
                            </div>
                        </article>
                    ) : (
                        <div key="write" className="fade pt-10">
                            <label htmlFor="story-topic" className="field-label">Topic</label>
                            <input id="story-topic" type="text" value={area} onChange={(event) => { setArea(event.target.value); setError(null); }} placeholder="e.g. Technology" className="text-field max-w-xs" required />
                            <label htmlFor="story-title" className="sr-only">Title</label>
                            <textarea id="story-title" rows={2} value={title} onChange={(event) => { setTitle(event.target.value); setError(null); }} placeholder="A title readers will remember" className="headline mt-6 w-full resize-none bg-transparent text-4xl sm:text-5xl placeholder:text-muted/40 focus:outline-none focus-visible:ring-0" required />
                            <div aria-hidden="true" className="my-5 h-px bg-line" />
                            <label htmlFor="story-content" className="sr-only">Your story</label>
                            <textarea id="story-content" value={content} onChange={(event) => { setContent(event.target.value); setError(null); }} rows={16} className="reading-copy min-h-[26rem] w-full !max-w-none resize-y bg-transparent placeholder:text-muted/50 focus:outline-none focus-visible:ring-0" placeholder="Begin with the thought you keep returning to…" required />

                            <div className="sticky bottom-5 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface/90 py-2 pl-4 pr-2 backdrop-blur">
                                <p className="text-xs text-muted">{canPreview ? "Ready for a final read." : `Still needed: ${missing.map((item) => item.label.split(" (")[0]).join(", ")}`}</p>
                                <button onClick={openPreview} type="button" className="button-primary !min-h-10"><Eye size={15} />Preview</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button type="button" aria-pressed={active} onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors duration-200 ${active ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`}>
            {children}
        </button>
    );
}
