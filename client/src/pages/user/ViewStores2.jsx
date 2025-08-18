import React, { useContext, useEffect, useState, useCallback } from "react";
import { getUserRatings, submitRating } from "../../services/user";
import { AuthContext } from "../../context/AuthContext";
import StoreCard from "../../components/user/StoreCard";
import { useRestoreScroll } from "../../utility/useScrollRestoration";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoresThunk } from "../../redux/thunk/storeThunks";
import { storeActions } from "../../redux/store";
import RenderSkeletonCards from "../../components/RenderSkeletonCards";
import { useLocation } from "react-router-dom";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "address", label: "Address" },
  // { value: "averageRating", label: "Rating" },
];

const ViewStoresUser2 = () => {
  useRestoreScroll();
  const [userRatings, setUserRatings] = useState({});
  const { isAuth } = useContext(AuthContext);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [fetchTrigger, setFetchTrigger] = useState(false);

  // Local search state for immediate UI updates
  const [localSearch, setLocalSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromLogin) {
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  const { stores, page, hasMore, loading, sortField, sortOrder, search } =
    useSelector((state) => state.store);

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      dispatch(storeActions.setSearch(searchValue));
      setFetchTrigger(true);
    }, 500), // 500ms delay
    [dispatch]
  );

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

  const fetchStores = (pageOverride) => {
    dispatch(
      fetchStoresThunk({
        search,
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
        page: pageOverride ?? page,
      })
    );
  };

  const handleLoadMore = () => {
    if (hasMore) fetchStores();
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
        dispatch(storeActions.updateStoreRating({ storeId, avgRating }));
      } else {
        console.warn(`Rating submission failed: ${res.status}`);
      }
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  const toggleSortOrder = () => {
    dispatch(storeActions.setSortOrder(sortOrder === "asc" ? "desc" : "asc"));
  };

  const toggleTrigger = () => {
    setFetchTrigger(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value); // Update local state immediately for responsive UI
    debouncedSearch(value); // Debounced API call
  };

  // Initialize local search from Redux state
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Initial fetch
  // useEffect(() => {
  //   if (!isAuth) return;
  //   console.log("#########");
  //   console.log("#       #");
  //   console.log("#       #");
  //   console.log("#       #");
  //   console.log("#########");
  //   fetchStores(1);
  //   fetchUserRatings();
  // }, [isAuth]);

  // Fetch on search/sort changes, or sort locally if no more data
  useEffect(() => {
    if (!isAuth || !hasMore) return;
    dispatch(storeActions.resetStores());
    fetchStores();
  }, [sortField, sortOrder, search, isAuth]);

  useEffect(() => {
    if (fetchTrigger && (search || search === "")) {
      console.log("bottom bottom bottom");
      dispatch(storeActions.resetStores());
      fetchStores();
      setFetchTrigger(false); // Reset trigger after fetch
    }
  }, [search, fetchTrigger]);

  // Client-side sorting if all data is loaded
  const sortedStores = React.useMemo(() => {
    if (!stores) return [];
    if (hasMore) return stores; // still fetching from server, rely on server order

    // Local sort
    const sorted = [...stores].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (typeof fieldA === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      return 0;
    });

    return sorted;
  }, [stores, sortField, sortOrder, hasMore]);

  useEffect(() => {
    console.log("fetch trigger:", fetchTrigger);
  }, [fetchTrigger]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">All Stores</h2>

        {/* Search and Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or address..."
                value={localSearch}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Loading indicator for search */}
              {localSearch !== search && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <select
                value={sortField}
                onChange={(e) => {
                  // toggleTrigger();
                  dispatch(storeActions.setSortField(e.target.value));
                }}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort by {label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  toggleSortOrder();
                  // toggleTrigger();
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                aria-label="Toggle sort order"
                title={`Sort order: ${
                  sortOrder === "asc" ? "Ascending" : "Descending"
                }`}
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        <div>
          <div className="mb-6">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{sortedStores.length}</span> store
              {sortedStores.length !== 1 ? "s" : ""}
              {search && (
                <span>
                  {" "}
                  for "<span className="font-semibold">{search}</span>"
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedStores.length > 0 ? (
              <>
                {sortedStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    userRating={userRatings[store.id]}
                    onRatingChange={handleRating}
                  />
                ))}
                {loading && <RenderSkeletonCards count={2} />}
              </>
            ) : loading ? (
              <RenderSkeletonCards count={2} />
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
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

      {hasMore && (
        <div className="flex items-center justify-center mt-2">
          <button
            className="bg-blue-400 p-2 rounded text-white mt-2"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}

      <div className="h-[400px]"></div>
    </div>
  );
};

export default ViewStoresUser2;
