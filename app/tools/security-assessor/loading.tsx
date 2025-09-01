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
          <div className="h-4 w-36 bg-muted animate-pulse rounded" />
        </div>

        {/* Tool Header skeleton */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-muted animate-pulse rounded-2xl" />
            <div className="w-20 h-6 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="h-12 w-96 bg-muted animate-pulse rounded mx-auto mb-4" />
          <div className="h-6 w-[600px] bg-muted animate-pulse rounded mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-8">
          {/* Assessment Configuration */}
          <div className="bg-card/50 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 h-12 bg-muted animate-pulse rounded-xl" />
                <div className="h-12 bg-muted animate-pulse rounded-xl" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
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
