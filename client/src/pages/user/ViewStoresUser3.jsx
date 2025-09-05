import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import StoreCard from "../../components/user/StoreCard";
import RenderSkeletonCards from "../../components/RenderSkeletonCards";
// import { useStores } from "../../hooks/useStores";

import { motion, AnimatePresence } from "framer-motion";
import { useRestoreScroll } from "../../utility/useScrollRestoration";
import { useLocation } from "react-router-dom";
import { getUserRatings, submitRating } from "../../services/user";
import { useStores } from "../../hooks/useStores";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "address", label: "Address" },
];

const ViewStoresUser3 = () => {
  useRestoreScroll();
  const { isAuth } = useContext(AuthContext);
  const location = useLocation();

  const [userRatings, setUserRatings] = useState({});
  const [localSearch, setLocalSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const skeletonCardCount = 3;

  useEffect(() => {
    if (location.state?.fromLogin) {
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  // Fetch stores with TanStack
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useStores({
      search: localSearch,
      sortBy: sortField,
      order: sortOrder,
    });

  // Flatten stores across all pages
  const stores = data?.pages.flatMap((page) => page.stores) || [];

  // Debounce search input
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setLocalSearch(value);
      refetch();
    }, 500),
    [refetch]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const fetchUserRatings = async () => {
    try {
      const res = await getUserRatings();
      const ratingsMap = {};
      res.data.forEach((r) => {
        ratingsMap[r.store.id] = parseFloat(r.rating);
      });
      setUserRatings(ratingsMap);
    } catch (err) {
      console.error("Error fetching user ratings", err);
    }
  };

  const handleRating = async (storeId, newRating) => {
    try {
      const res = await submitRating(storeId, newRating);
      if (res.status === 200) {
        const { avgRating } = res.data;
        setUserRatings((prev) => ({
          ...prev,
          [storeId]: parseFloat(newRating),
        }));
      }
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchUserRatings();
    }
  }, [isAuth]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">All Stores</h2>

        {/* Search + Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or address..."
                defaultValue={localSearch}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isFetching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort by {label}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleSortOrder}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div> */}
          </div>
        </div>

        {/* Stores Grid */}
        <div>
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{stores.length}</span>{" "}
              store
              {stores.length !== 1 ? "s" : ""}
              {localSearch && (
                <span>
                  {" "}
                  for "<span className="font-semibold">{localSearch}</span>"
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stores.length > 0 ? (
              <>
                {stores.map((store) => (
                  <AnimatePresence key={store.id}>
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StoreCard
                        store={store}
                        // userRating={userRatings[store.id]}
                        onRatingChange={handleRating}
                      />
                    </motion.div>
                  </AnimatePresence>
                ))}
                {isFetching && (
                  <RenderSkeletonCards count={skeletonCardCount} />
                )}
              </>
            ) : isLoading ? (
              <RenderSkeletonCards count={skeletonCardCount} />
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No stores found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasNextPage && (
        <div className="flex items-center justify-center mt-2">
          <button
            className="bg-blue-400 p-2 rounded text-white mt-2"
            onClick={() => fetchNextPage()}
          >
            Load More
          </button>
        </div>
      )}

      <div className="h-[400px]"></div>
    </div>
  );
};

export default ViewStoresUser3;
