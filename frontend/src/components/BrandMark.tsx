import { Link } from "react-router-dom";

export function BrandMark() {
    return (
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-sm font-bold tracking-tight text-canvas">
            iw
        </span>
    );
}

export function Brand({ to = "/blogs" }: { to?: string }) {
    return (
        <Link to={to} className="flex min-w-0 items-center gap-2.5" aria-label="InspireWrite home">
            <BrandMark />
            <span className="truncate text-base font-semibold tracking-tight">InspireWrite</span>
        </Link>
    );
}

export function SkipLink() {
    return (
        <a href="#main-content" className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-canvas transition-transform focus:translate-y-0">
            Skip to content
        </a>
    );
}
