import { type JSX, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, PenLine, X } from "lucide-react";
import { useUserName } from "../hooks";
import { Avatar } from "./BlogCard";
import { Brand, SkipLink } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
        isActive ? "text-ink after:w-full" : "text-muted after:w-0 hover:text-ink hover:after:w-full"
    }`;

export const Appbar = ({ button }: { button?: JSX.Element }) => {
    const { loading, name } = useUserName();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setMenuOpen(false), [location.pathname]);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/signin", { replace: true });
    };

    const displayName = loading ? "…" : name || "Guest";

    return (
        <>
            <SkipLink />
            <header className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || menuOpen ? "border-line bg-canvas/80 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
                <div className="page-shell flex h-[4.5rem] items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3 lg:gap-10">
                        {button && (
                            <button onClick={() => navigate(-1)} className="icon-button -ml-2 shrink-0" aria-label="Go back">
                                {button}
                            </button>
                        )}
                        <Brand />
                        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
                            <NavLink to="/blogs" className={navClass}>Read</NavLink>
                            <NavLink to="/publish" className={navClass}>Write</NavLink>
                        </nav>
                    </div>

                    <div className="hidden items-center gap-1.5 md:flex">
                        <Link to="/publish" className="button-primary mr-2 !min-h-10"><PenLine size={15} />Write</Link>
                        <ThemeToggle />
                        <Link to="/updateUser" className="rounded-full p-1" aria-label="Open profile settings">
                            <Avatar name={displayName} />
                        </Link>
                        <button type="button" onClick={handleLogout} className="icon-button" aria-label="Log out" title="Log out">
                            <LogOut size={17} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 md:hidden">
                        <ThemeToggle />
                        <button className="icon-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav id="mobile-navigation" className="drop border-t border-line px-5 pb-5 md:hidden" aria-label="Mobile navigation">
                        <div className="mx-auto flex max-w-6xl flex-col">
                            <Link to="/blogs" className="border-b border-line py-3 text-base font-medium">Read</Link>
                            <Link to="/publish" className="border-b border-line py-3 text-base font-medium">Write</Link>
                            <Link to="/updateUser" className="flex items-center gap-3 border-b border-line py-4 text-sm font-semibold"><Avatar name={displayName} />Profile settings</Link>
                            <button type="button" onClick={handleLogout} className="flex items-center gap-3 py-4 text-left text-sm font-semibold text-accent"><LogOut size={17} />Log out</button>
                        </div>
                    </nav>
                )}
            </header>
        </>
    );
};
