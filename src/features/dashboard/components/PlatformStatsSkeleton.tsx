export function PlatformStatsSkeleton() {
  return (
    <div className="w-full bg-[#11231b] py-10 text-white animate-pulse">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="size-10 rounded-full bg-white/10 mb-3" />
              <div className="h-8 w-16 rounded bg-white/20 mb-2" />
              <div className="h-4 w-28 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
