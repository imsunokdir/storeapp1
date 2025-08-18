import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getStats } from "../../services/admin";
import LoadBalls from "../../components/LoadBalls";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats({
          totalUsers: res.data.totalUsers,
          totalStores: res.data.totalStores,
          totalRatings: res.data.totalRatings,
        });
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="p-8">
        <LoadBalls />
      </div>
    );
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2 ">Total Users</h2>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Stores</h2>
          <p className="text-4xl font-bold">{stats.totalStores}</p>
        </div>
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Ratings</h2>
          <p className="text-4xl font-bold">{stats.totalRatings}</p>
        </div>
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <Link
          to="/admin/add-user"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700 transition"
        >
          Add New User
        </Link>
        <Link
          to="/admin/add-store"
          className="block w-full bg-indigo-600 text-white text-center py-3 rounded hover:bg-indigo-700 transition"
        >
          Add New Store
        </Link>
        <Link
          to="/admin/users"
          className="block w-full bg-green-600 text-white text-center py-3 rounded hover:bg-green-700 transition"
        >
          View Users
        </Link>
        <Link
          to="/admin/stores"
          className="block w-full bg-purple-600 text-white text-center py-3 rounded hover:bg-purple-700 transition"
        >
          View Stores
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
