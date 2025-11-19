export function ChartSkeleton() {
  return (
    <div className="h-96 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-[#1a1a1a]" />
        <div className="h-5 w-48 rounded bg-[#1a1a1a]" />
      </div>
      <div className="h-full rounded-lg border border-[var(--color-border)] bg-[#050505] p-4">
        <div className="flex h-full flex-col justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-3 w-20 rounded bg-[#1a1a1a]" />
              <div className="flex-1">
                <div className="h-2 rounded bg-[#1a1a1a]" style={{ width: `${60 + Math.random() * 40}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

