export default function ProjectsLoading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
