export default function Loading() {
  return (
    <div className="container mx-auto min-h-[70vh] max-w-4xl px-6 py-8">
      <div className="animate-pulse">
        <div className="mb-6">
          <div className="mb-3 flex gap-2">
            <div className="h-4 w-12 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-100" />
          </div>
          <div className="mb-2 h-8 w-48 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="mt-1 h-4 w-3/4 rounded bg-slate-100" />
        </div>
        <div className="rounded-xl border border-slate-200 p-6">
          <div className="h-40 w-full rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
