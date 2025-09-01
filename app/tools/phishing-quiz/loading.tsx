export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs skeleton */}
        <div className="flex items-center space-x-2 text-sm mb-8">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
        </div>

        {/* Tool Header skeleton */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-muted animate-pulse rounded-2xl" />
            <div className="w-20 h-6 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="h-12 w-80 bg-muted animate-pulse rounded mx-auto mb-4" />
          <div className="h-6 w-[500px] bg-muted animate-pulse rounded mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-8">
          {/* Quiz mode card */}
          <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-12 bg-muted animate-pulse rounded-xl" />
              <div className="h-12 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>

          {/* Progress card */}
          <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-2 w-full bg-muted animate-pulse rounded-full mb-2" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Email card */}
          <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="h-6 w-24 bg-muted animate-pulse rounded mb-6" />
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-xl space-y-2">
                <div className="h-4 w-full bg-background animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-background animate-pulse rounded" />
              </div>
              <div className="bg-card p-4 rounded-xl border-2 border-border">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex-1 h-12 bg-muted animate-pulse rounded-xl" />
                <div className="flex-1 h-12 bg-muted animate-pulse rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
