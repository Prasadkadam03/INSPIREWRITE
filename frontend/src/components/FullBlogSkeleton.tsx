export const FullBlogSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-50 min-h-screen flex justify-center">
                <div className="grid grid-cols-12 w-full max-w-screen-xl pt-12 px-4 lg:px-10">
                    {/* Blog Content Skeleton */}
                    <div className="col-span-12 lg:col-span-8 bg-white shadow-md rounded-lg p-6">
                        {/* Title Skeleton */}
                        <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>

                        {/* Metadata Skeleton */}
                        <div className="flex flex-wrap items-center pt-4 text-sm text-gray-400 space-y-2 lg:space-y-0">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="px-2 hidden lg:block" />
                            <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6 ml-2"></div>
                            <div className="h-4 w-4 bg-gray-300 rounded-full ml-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6 ml-2"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="pt-6 space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                        </div>

                        {/* Like Button Skeleton */}
                        <div className="pt-6 flex items-center space-x-4">
                            <div className="h-10 bg-gray-300 rounded w-24"></div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                        </div>
                    </div>

                    {/* Author Section Skeleton */}
                    <div className="col-span-12 lg:col-span-4 lg:pl-10 pt-10 lg:pt-0">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {/* Author Title Skeleton */}
                            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>

                            {/* Author Info Skeleton */}
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};