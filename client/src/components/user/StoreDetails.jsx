import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { getUserRatings, submitRating } from "../../services/user";
import { AuthContext } from "../../context/AuthContext";
import LoadBalls from "../../components/LoadBalls";
import { getStoreById, getStoreRatingDetails } from "../../services/store";
import { getUserRatings, submitRating } from "../../services/user";
import useScrollToTop from "../../utility/useScrollToTop";
import RatingBreakdown from "../RatingBreakdown";

const StoreDetail = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [distribution, setDistribution] = useState([]);

  const fetchStoreDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStoreById(id);
      console.log("store data:", res.data.data);
      setStore(res.data.data);
    } catch (err) {
      setError("Failed to load store details");
      console.error("Error fetching store details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    try {
      const res = await getUserRatings();
      const rating = res.data.find((r) => r.store.id == id);
      setUserRating(rating ? parseFloat(rating.rating) : null);
    } catch (err) {
      console.error("Error fetching user rating:", err);
    }
  };

  const fetchStoreRatingDetails = async () => {
    try {
      const res = await getStoreRatingDetails(id);
      if (res.status === 200) {
        setDistribution(res.data.data.distribution);
      }
    } catch (err) {
      console.error("Error fetching rating breakdown:", err);
    }
  };

  const handleRating = async (newRating) => {
    setRatingLoading(true);
    try {
      const res = await submitRating(id, newRating);
      if (res.status === 200) {
        const { avgRating } = res.data;
        setUserRating(parseFloat(newRating));
        setStore((prev) => ({
          ...prev,
          averageRating: avgRating,
        }));
        fetchStoreRatingDetails();
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setRatingLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth && id) {
      fetchStoreDetail();
      fetchUserRating();
      fetchStoreRatingDetails();
    }
  }, [isAuth, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadBalls />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Store not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Stores
          </button>
          <h1 className="text-4xl font-bold text-gray-800">{store.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Store Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Store Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    📍 Address
                  </h3>
                  <p className="text-gray-800 text-lg">{store.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Rating
              </h2>
              {/* rating breakdonw */}
              <div className="mt-6 flex flex-col items-center justify-center">
                {/* <h3 className="font-semibold mb-3 text-gray-800">
                  Rating Breakdown
                </h3> */}
                <RatingBreakdown storeId={id} distribution={distribution} />
              </div>

              {/* Average Rating Display */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {store.averageRating
                    ? Number(store.averageRating).toFixed(1)
                    : "N/A"}
                </div>
                <div className="text-yellow-500 text-1xl mb-2">
                  {store.averageRating
                    ? "⭐".repeat(Math.round(store.averageRating))
                    : "☆☆☆☆☆"}
                </div>
                <p className="text-gray-600">Average Rating</p>
                {store.totalRatings && (
                  <p className="text-sm text-gray-500">
                    Based on {store.totalRatings} review
                    {store.totalRatings !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* User Rating Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Your Rating
                </h3>

                {userRating !== null ? (
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {userRating.toFixed(1)}
                    </div>
                    <div className="text-blue-500 text-xl mb-2">
                      {"⭐".repeat(Math.round(userRating))}
                    </div>
                    <p className="text-sm text-gray-600">
                      You rated this store
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center mb-4">
                    You haven't rated this store yet
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {userRating !== null
                      ? "Change your rating:"
                      : "Rate this store:"}
                  </label>
                  <select
                    value={userRating !== null ? userRating.toString() : ""}
                    onChange={(e) => handleRating(parseFloat(e.target.value))}
                    disabled={ratingLoading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num.toString()}>
                        {num}.0 ⭐ -{" "}
                        {num === 1
                          ? "Poor"
                          : num === 2
                          ? "Fair"
                          : num === 3
                          ? "Good"
                          : num === 4
                          ? "Very Good"
                          : "Excellent"}
                      </option>
                    ))}
                  </select>

                  {ratingLoading && (
                    <p className="text-sm text-blue-600 text-center">
                      Updating rating...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
