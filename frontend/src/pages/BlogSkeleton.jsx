function BlogSkeleton() {
    return (
      <div className="w-[65%] lg:w-[60%] midbreakpoint:w-[80%] maxsixhundread:w-full min-h-screen p-5 animate-pulse">
  
        {/* Title */}
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
  
        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
  
        {/* Tags */}
        <div className="flex gap-2 mb-8">
          <div className="w-16 h-6 rounded-full bg-gray-200"></div>
          <div className="w-20 h-6 rounded-full bg-gray-200"></div>
          <div className="w-14 h-6 rounded-full bg-gray-200"></div>
        </div>
  
        {/* Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
  
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
  
          <div className="w-24 h-9 rounded-full bg-gray-200"></div>
        </div>
  
        {/* Like & Comment */}
        <div className="flex gap-8 mb-8">
          <div className="w-12 h-5 bg-gray-200 rounded"></div>
          <div className="w-12 h-5 bg-gray-200 rounded"></div>
        </div>
  
        {/* Image */}
        <div className="w-full h-[420px] rounded-xl bg-gray-200 mb-8"></div>
  
        {/* Content */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-11/12"></div>
          <div className="h-5 bg-gray-200 rounded w-10/12"></div>
  
          <div className="h-48 bg-gray-200 rounded-xl"></div>
  
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-9/12"></div>
        </div>
  
      </div>
    );
  }
  
  export default BlogSkeleton;