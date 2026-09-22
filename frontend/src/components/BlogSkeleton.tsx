export const BlogSkeleton = ({ featured = false }: { featured?: boolean }) =>
  featured ? (
    <div role="status" className="pt-10 sm:pt-16">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton mt-4 h-9 w-11/12" />
        <div className="skeleton mt-2 h-9 w-3/5" />
        <div className="skeleton mt-8 h-4 w-full max-w-2xl" />
        <div className="skeleton mt-3 h-4 w-3/4 max-w-xl" />
        <div className="mt-10 flex items-center gap-3 border-t border-line pt-6"><div className="skeleton h-12 w-12 !rounded-full" /><div className="space-y-2"><div className="skeleton h-3 w-28" /><div className="skeleton h-3 w-20" /></div></div>
      </div>
      <span className="sr-only">Loading stories…</span>
    </div>
  ) : (
    <div role="status" className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-line py-10 sm:gap-x-10">
      <div className="skeleton h-7 w-8" />
      <div>
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-4 h-9 w-4/5" />
        <div className="skeleton mt-5 h-4 w-full max-w-2xl" />
        <div className="skeleton mt-3 h-4 w-2/3 max-w-xl" />
      </div>
      <span className="sr-only">Loading stories…</span>
    </div>
  );
