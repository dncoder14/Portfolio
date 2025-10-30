import React from 'react'

function SkeletonLoader({ className = "", height = "h-4", width = "w-full" }) {
  return (
    <div className={`${height} ${width} bg-gray-800 rounded animate-pulse ${className}`} />
  )
}

function FullPageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <SkeletonLoader height="h-8" width="w-32" />
            <div className="hidden md:flex space-x-8">
              {[...Array(5)].map((_, i) => (
                <SkeletonLoader key={i} height="h-4" width="w-16" />
              ))}
            </div>
            <SkeletonLoader height="h-8" width="w-8" className="md:hidden" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-4xl mx-auto">
          <SkeletonLoader height="h-16" width="w-96" className="mx-auto mb-6" />
          <SkeletonLoader height="h-8" width="w-64" className="mx-auto mb-8" />
          <SkeletonLoader height="h-6" width="w-full" className="mb-4" />
          <SkeletonLoader height="h-6" width="w-3/4" className="mx-auto mb-8" />
          <div className="flex justify-center space-x-4">
            <SkeletonLoader height="h-12" width="w-32" />
            <SkeletonLoader height="h-12" width="w-32" />
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="min-h-screen flex items-center py-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <SkeletonLoader height="h-12" width="w-48" />
              <div className="space-y-4">
                <SkeletonLoader height="h-6" width="w-full" />
                <SkeletonLoader height="h-6" width="w-full" />
                <SkeletonLoader height="h-6" width="w-3/4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonLoader key={i} height="h-4" width="w-full" />
                ))}
              </div>
              <div className="flex space-x-4">
                <SkeletonLoader height="h-12" width="w-32" />
                <SkeletonLoader height="h-12" width="w-32" />
              </div>
            </div>
            <div className="flex justify-center">
              <SkeletonLoader height="h-80" width="w-80" className="rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section Skeleton */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <SkeletonLoader height="h-12" width="w-64" className="mx-auto mb-6" />
            <SkeletonLoader height="h-6" width="w-96" className="mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="text-center bg-gray-800 rounded-lg p-6">
                <SkeletonLoader height="h-16" width="w-16" className="mx-auto mb-4 rounded-full" />
                <SkeletonLoader height="h-4" width="w-20" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Skeleton */}
      <section className="min-h-screen flex items-center py-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <SkeletonLoader height="h-12" width="w-64" className="mx-auto mb-6" />
            <SkeletonLoader height="h-6" width="w-96" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                <SkeletonLoader height="h-48" className="rounded-none" />
                <div className="p-6">
                  <SkeletonLoader height="h-6" width="w-3/4" className="mb-3" />
                  <SkeletonLoader height="h-4" className="mb-2" />
                  <SkeletonLoader height="h-4" width="w-2/3" className="mb-4" />
                  <div className="flex gap-2 mb-4">
                    <SkeletonLoader height="h-6" width="w-16" />
                    <SkeletonLoader height="h-6" width="w-20" />
                    <SkeletonLoader height="h-6" width="w-14" />
                  </div>
                  <div className="flex space-x-3">
                    <SkeletonLoader height="h-10" width="w-20" />
                    <SkeletonLoader height="h-10" width="w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section Skeleton */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <SkeletonLoader height="h-12" width="w-64" className="mx-auto mb-6" />
            <SkeletonLoader height="h-6" width="w-96" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <SkeletonLoader height="h-32" className="mb-6 rounded-lg" />
                <SkeletonLoader height="h-6" width="w-3/4" className="mb-4" />
                <SkeletonLoader height="h-4" width="w-1/2" className="mb-2" />
                <SkeletonLoader height="h-4" width="w-1/3" className="mb-4" />
                <SkeletonLoader height="h-10" width="w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="min-h-screen flex items-center py-20 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <SkeletonLoader height="h-12" width="w-48" className="mx-auto mb-6" />
            <SkeletonLoader height="h-6" width="w-80" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <SkeletonLoader height="h-8" width="w-48" className="mb-4" />
              <SkeletonLoader height="h-6" width="w-full" />
              <SkeletonLoader height="h-6" width="w-3/4" />
              <div className="space-y-4 pt-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <SkeletonLoader height="h-6" width="w-6" className="rounded-full" />
                    <SkeletonLoader height="h-4" width="w-48" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <SkeletonLoader height="h-12" width="w-full" />
              <SkeletonLoader height="h-12" width="w-full" />
              <SkeletonLoader height="h-32" width="w-full" />
              <SkeletonLoader height="h-12" width="w-32" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FullPageSkeleton