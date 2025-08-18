import React from "react";

const StoreCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        {/* Placeholder for rating dropdown (hidden in skeleton) */}
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Rating Information */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="flex items-center space-x-1">
            <div className="h-5 bg-gray-200 rounded w-10"></div>
            <div className="h-5 bg-gray-200 rounded w-4"></div>
          </div>
        </div>

        <div className="text-right">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="flex items-center justify-end space-x-1">
            <div className="h-5 bg-gray-200 rounded w-10"></div>
            <div className="h-5 bg-gray-200 rounded w-4"></div>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-28 mx-auto"></div>
      </div>
    </div>
  );
};

export default StoreCardSkeleton;
