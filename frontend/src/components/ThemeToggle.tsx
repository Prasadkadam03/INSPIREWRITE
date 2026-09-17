import { type MouseEvent, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const readTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#09090B" : "#FAFAFA");
    localStorage.setItem("theme", theme);
};

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
    const [theme, setTheme] = useState<Theme>(readTheme);

    // Follow the OS setting until the reader picks a theme explicitly.
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (event: MediaQueryListEvent) => {
            if (localStorage.getItem("theme")) return;
            const next = event.matches ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            setTheme(next);
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const toggle = (event: MouseEvent<HTMLButtonElement>) => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        const commit = () => flushSync(() => { applyTheme(next); setTheme(next); });
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!document.startViewTransition || reduceMotion) return commit();

        // Spread the new palette outward from the button, like ink into paper.
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

        document.startViewTransition(commit).ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 450, easing: "cubic-bezier(.22,.8,.26,1)", pseudoElement: "::view-transition-new(root)" },
            );
        });
    };

    const isDark = theme === "dark";
    return (
        <button type="button" onClick={toggle} className={`icon-button ${className}`} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"}>
            <span className="relative block h-[18px] w-[18px]">
                <Sun size={18} className={`absolute inset-0 transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
                <Moon size={18} className={`absolute inset-0 transition-all duration-300 ${isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            </span>
        </button>
    );
};
