import { cn } from "@/lib/utils" 

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-muted/60 rounded-md motion-safe:animate-pulse", className)}
    />
  )
}

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10"
    >
      <span className="sr-only">Loading URL Checker…</span>

      <div className="container mx-auto px-4 py-8">
        {/* breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          <Skeleton className="h-12 w-72 mx-auto mb-4 rounded" />
          <Skeleton className="h-6 w-[min(550px,90%)] mx-auto rounded" />
        </div>

        {/* content */}
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1 rounded-xl" />
                  <Skeleton className="h-12 w-24 rounded-xl" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-32 rounded" />
                  <Skeleton className="h-8 w-36 rounded" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* optional second card placeholder */}
          {/* <div className="max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
