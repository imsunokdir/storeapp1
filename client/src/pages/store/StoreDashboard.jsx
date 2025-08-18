import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreDashbboardData, getStoreRaters } from "../../services/store";

const StoreDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeRaters, setStoreRaters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratersLoading, setRatersLoading] = useState(false);
  const [error, setError] = useState("");

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getStoreDashbboardData();
        setDashboardData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewRaters = async (storeId, storeName) => {
    setRatersLoading(true);
    setSelectedStore({ id: storeId, name: storeName });
    try {
      const res = await getStoreRaters(storeId);
      setStoreRaters(res.data.data);
    } catch (err) {
      console.error("Failed to load store raters:", err);
      setStoreRaters(null);
    } finally {
      setRatersLoading(false);
    }
  };

  const closeRatersModal = () => {
    setSelectedStore(null);
    setStoreRaters(null);
  };

  // Close user menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p className="text-center mt-8">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  const { stores, totalStores, overallStats } = dashboardData.data;

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      {/* Header with user menu */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>

        {/* User Menu Button */}
        {/* <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg focus:outline-none"
            aria-label="User menu"
          >
            U
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
              <button
                onClick={() => {
                  navigate("/store/update-password");
                  setShowUserMenu(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Change Password
              </button>
            </div>
          )}
        </div> */}
      </div>

      {/* Overall Statistics */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Stores</h3>
            <p className="text-3xl font-bold text-blue-600">{totalStores}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Ratings</h3>
            <p className="text-3xl font-bold text-green-600">
              {overallStats.totalRatingsReceived}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">
              Average Rating
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {overallStats.averageRatingAcrossAllStores}⭐
            </p>
          </div>
        </div>
      </div>

      {/* Stores List */}
      <h2 className="text-2xl font-semibold mb-4">My Stores</h2>
      {stores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No stores found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white p-6 border rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{store.name}</h3>
                  <p className="text-gray-600 mb-1">{store.address}</p>
                  <p className="text-sm text-gray-500">{store.email}</p>
                </div>
                <button
                  onClick={() => handleViewRaters(store.id, store.name)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Ratings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700">Average Rating</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {store.averageRating}⭐
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-gray-700">Total Ratings</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {store.totalRatings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raters Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Ratings for "{selectedStore.name}"
              </h3>
              <button
                onClick={closeRatersModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {ratersLoading ? (
              <p className="text-center py-4">Loading ratings...</p>
            ) : storeRaters ? (
              <div>
                {/* Store Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">Rating Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">
                        {storeRaters.statistics.totalRatings}
                      </p>
                      <p className="text-sm text-gray-600">Total Ratings</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {storeRaters.statistics.averageRating}⭐
                      </p>
                      <p className="text-sm text-gray-600">Average</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {storeRaters.statistics.ratingDistribution[5]}
                      </p>
                      <p className="text-sm text-gray-600">5-Star</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {storeRaters.statistics.ratingDistribution[1]}
                      </p>
                      <p className="text-sm text-gray-600">1-Star</p>
                    </div>
                  </div>
                </div>

                {/* Ratings Table */}
                {storeRaters.ratings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">
                            User
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            Email
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            Rating
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeRaters.ratings.map((rating) => (
                          <tr key={rating.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-3">
                              {rating.user.name}
                            </td>
                            <td className="border border-gray-300 p-3">
                              {rating.user.email}
                            </td>
                            <td className="border border-gray-300 p-3">
                              <span className="inline-flex items-center">
                                {rating.rating}⭐
                              </span>
                            </td>
                            <td className="border border-gray-300 p-3">
                              {new Date(
                                rating.submittedAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-600">
                    No ratings yet for this store.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center py-4 text-red-600">
                Failed to load ratings.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;
