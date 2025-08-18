import React from "react";
import { useNavigate } from "react-router-dom";
import { saveScrollPosition } from "../../utility/useScrollRestoration";

const StoreCard = ({ store, userRating }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the rating dropdown
    if (e.target.tagName === "SELECT" || e.target.tagName === "OPTION") {
      return;
    }
    saveScrollPosition();
    navigate(`/user/store/${store.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate pr-4 flex-1">
          {store.name}
        </h3>
        {/* <div
          className="ml-4 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={
              userRating !== undefined && userRating !== null
                ? userRating.toString()
                : ""
            }
            onChange={(e) =>
              onRatingChange(store.id, parseFloat(e.target.value))
            }
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">
              {userRating !== undefined && userRating !== null
                ? "Change Rating"
                : "Rate Store"}
            </option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num.toString()}>
                {num}.0 ⭐
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Address */}
      <div className="mb-4">
        <span className="text-gray-600 text-sm mb-2 block">📍 Address:</span>
        <span className="text-gray-800 block truncate" title={store.address}>
          {store.address}
        </span>
      </div>

      {/* Rating Information */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm mb-1 block">
            Average Rating:
          </span>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-yellow-600">
              {store.averageRating
                ? Number(store.averageRating).toFixed(1)
                : "N/A"}
            </span>
            {store.averageRating && (
              <span className="ml-1 text-yellow-500">⭐</span>
            )}
          </div>
        </div>

        {userRating !== undefined && userRating !== null && (
          <div className="text-right">
            <span className="text-gray-600 text-sm mb-1 block">
              Your Rating:
            </span>
            <div className="flex items-center justify-end">
              <span className="text-lg font-semibold text-blue-600">
                {Number(userRating).toFixed(1)}
              </span>
              <span className="ml-1 text-blue-500">⭐</span>
            </div>
          </div>
        )}
      </div>

      {/* Click hint */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Click to view details
        </p>
      </div>
    </div>
  );
};

export default StoreCard;
