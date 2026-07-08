import React from 'react';
import { Search, ArrowRight, BookOpen } from 'lucide-react'; // clear icons ke liye

const NoResultsFound = ({  onClearSearch ,val}) => {
  return (
    <div className="max-w-xl mx-auto my-16 px-4 text-center">
      {/* Icon Container */}
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gray-50 maxsixhundread:p-2 rounded-full text-gray-400">
          <Search size={32} className='maxsixhundread:w-6 maxsixhundread:h-6' strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl font-serif font-medium text-gray-900 mb-3 maxsixhundread:text-xl">
        No results found for  "{val}"
      </h2>

      {/* Subtext */}
      <p className="text-gray-500 font-sans text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
        We couldn’t find any matches for your search. Try checking your spelling or using more general keywords.
      </p>

      {/* Action Button */}
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200 mb-12"
        >
          Clear search
        </button>
      )}

      {/* Divider */}
      <hr className="border-gray-100 my-8" />

      {/* Medium-style Recommended Topics / Next Steps */}
      <div className="text-left">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
          <BookOpen size={14} /> Explore popular topics
        </h3>
        
        <div className="flex flex-wrap gap-2.5">
          {['Technology', 'Design', 'Writing', 'Programming', 'Productivity'].map((topic) => (
            <button
              key={topic}
              className="bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs md:text-sm px-4 py-2 rounded-full border border-gray-200/60 transition-colors duration-150"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoResultsFound;