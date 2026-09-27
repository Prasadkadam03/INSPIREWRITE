import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, PenLine, Users } from "lucide-react";
import { Brand, SkipLink } from "../components/BrandMark";
import { ThemeToggle } from "../components/ThemeToggle";

const features = [
    { icon: BookOpen, title: "Read without interruption", body: "A clean reading page keeps the story and its author in view — nothing else." },
    { icon: Eye, title: "Draft, then preview", body: "Write in a focused editor and review the finished page before publishing." },
    { icon: Users, title: "People, not metrics", body: "Find writers through what they notice and how they think." },
];

export const Landing = () => {
    const signedIn = Boolean(localStorage.getItem("token"));
    const primaryPath = signedIn ? "/publish" : "/signup";
    const readingPath = signedIn ? "/blogs" : "/signin";

    return (
        <div className="min-h-screen">
            <SkipLink />
            <header className="page-shell flex h-16 items-center justify-between gap-4">
                <Brand to="/" />
                <nav className="flex items-center gap-1 sm:gap-2" aria-label="Landing navigation">
                    <a href="#about" className="hidden px-3 text-sm text-muted transition-colors hover:text-ink sm:block">About</a>
                    <ThemeToggle />
                    {signedIn ? (
                        <Link to="/blogs" className="button-primary">Reading room</Link>
                    ) : (
                        <>
                            <Link to="/signin" className="hidden px-3 text-sm text-muted transition-colors hover:text-ink sm:block">Sign in</Link>
                            <Link to="/signup" className="button-primary">Get started</Link>
                        </>
                    )}
                </nav>
            </header>

            <main id="main-content">
                <section className="page-shell py-24 text-center sm:py-32">
                    <p className="eyebrow rise">For writers and careful readers</p>
                    <h1 className="headline rise d-1 mx-auto mt-4 max-w-3xl text-5xl sm:text-6xl">Keep the thought. Shape the story.</h1>
                    <p className="rise d-2 mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">A quiet publishing community for writing that deserves attention — and a reader who stays.</p>
                    <div className="rise d-3 mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link to={primaryPath} className="button-primary group !min-h-11 !px-5">
                            <PenLine size={16} />{signedIn ? "Write a story" : "Start writing"}
                            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                        <Link to={readingPath} className="button-secondary !min-h-11 !px-5">{signedIn ? "Read stories" : "Sign in to read"}</Link>
                    </div>
                </section>

                <section id="about" className="page-shell scroll-mt-6 pb-24">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {features.map(({ icon: Icon, title, body }, index) => (
                            <div key={title} className="rise rounded-2xl border border-line bg-surface p-6" style={{ animationDelay: `${240 + index * 60}ms` }}>
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink/5 text-ink"><Icon size={17} /></span>
                                <h2 className="mt-4 font-semibold">{title}</h2>
                                <p className="mt-1.5 text-sm leading-6 text-muted">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-shell pb-24">
                    <div className="flex flex-col items-start gap-6 rounded-2xl bg-ink p-8 text-canvas sm:flex-row sm:items-center sm:justify-between sm:p-12">
                        <h2 className="headline text-2xl sm:text-3xl">Your next sentence already has a reader.</h2>
                        <Link to={primaryPath} className="btn shrink-0 bg-canvas text-ink hover:bg-canvas/90">
                            {signedIn ? "Open the editor" : "Create your account"}<ArrowRight size={15} />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="page-shell flex flex-col gap-3 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                <Brand to="/" />
                <p>A quiet place for words with somewhere to go.</p>
            </footer>
        </div>
    );
};
