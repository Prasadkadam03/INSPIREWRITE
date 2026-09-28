export const FullBlogSkeleton = () => (
  <div role="status" id="main-content" className="page-shell pb-24 pt-14 sm:pt-20">
    <div className="mx-auto max-w-3xl">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-4 h-11 w-11/12" />
      <div className="skeleton mt-2 h-11 w-2/3" />
      <div className="mt-10 flex items-center gap-3"><div className="skeleton h-10 w-10 !rounded-full" /><div className="space-y-2"><div className="skeleton h-3 w-28" /><div className="skeleton h-3 w-40" /></div></div>
      <div className="mt-14 space-y-4 border-t border-line pt-12">{[100, 96, 91, 100, 84, 95, 72].map((width) => <div key={width} className="skeleton h-4" style={{ width: `${width}%` }} />)}</div>
    </div>
    <span className="sr-only">Loading article…</span>
  </div>
);
