export function VideoSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 animate-pulse">
      <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

