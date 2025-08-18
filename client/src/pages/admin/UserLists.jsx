import React, { useState, useEffect } from "react";
import { getUsers } from "../../services/admin";
import GoBack from "../../components/GoBack";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const UserLists = () => {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
        page,
        limit: 5,
      };

      if (search.trim()) {
        params.search = search.trim();
      }
      if (roleFilter !== "all") {
        params.role = roleFilter;
      }

      const res = await getUsers(params);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortField, sortOrder, search, roleFilter, page]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="mt-3 ml-4">
        <GoBack />
      </div>

      <div className="p-8 min-h-screen max-w-5xl mx-auto flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Users List</h1>

        {/* Search & filter */}
        <div>
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="mb-4 p-3 w-full max-w-md border border-gray-300 rounded"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="mb-6 p-2 border border-gray-300 rounded max-w-xs"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full bg-white rounded shadow table-fixed">
          {" "}
          <thead>
            <tr>
              <th
                className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                style={{ width: "20%" }}
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                style={{ width: "25%" }}
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortField === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                style={{ width: "25%" }}
                onClick={() => handleSort("address")}
              >
                Address{" "}
                {sortField === "address"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                style={{ width: "15%" }}
                onClick={() => handleSort("role")}
              >
                Role{" "}
                {sortField === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                style={{ width: "15%" }}
                onClick={() => handleSort("averageStoreRating")}
              >
                Avg Store Rating{" "}
                {sortField === "averageStoreRating"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} />
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="h-12">
                    <td className="p-3 border-b border-gray-200 h-12 align-middle text-sm">
                      <div
                        className="flex items-center"
                        style={{ height: "24px" }}
                      >
                        {user.name}
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-200 h-12 align-middle text-sm">
                      <div
                        className="flex items-center"
                        style={{ height: "24px" }}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-200 h-12 align-middle text-sm">
                      <div
                        className="flex items-center"
                        style={{ height: "24px" }}
                      >
                        {user.address}
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-200 h-12 align-middle text-sm">
                      <div
                        className="flex items-center"
                        style={{ height: "24px" }}
                      >
                        {user.role}
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-200 h-12 align-middle text-sm">
                      <div
                        className="flex items-center"
                        style={{ height: "24px" }}
                      >
                        {user.role === "store_owner" && user.averageStoreRating
                          ? Number(user.averageStoreRating).toFixed(2)
                          : "N/A"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-600 h-12">
                  {error}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center h-12">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 h-12">
                    <td
                      className="p-3 border-b border-gray-200 h-12 align-middle truncate"
                      style={{ width: "20%" }}
                    >
                      {user.name}
                    </td>
                    <td
                      className="p-3 border-b border-gray-200 h-12 align-middle truncate"
                      style={{ width: "25%" }}
                    >
                      {user.email}
                    </td>
                    <td
                      className="p-3 border-b border-gray-200 h-12 align-middle truncate"
                      style={{ width: "25%" }}
                    >
                      {user.address}
                    </td>
                    <td
                      className="p-3 border-b border-gray-200 h-12 align-middle truncate"
                      style={{ width: "15%" }}
                    >
                      {user.role}
                    </td>
                    <td
                      className="p-3 border-b border-gray-200 h-12 align-middle truncate"
                      style={{ width: "15%" }}
                    >
                      {user.role === "store_owner" && user.averageStoreRating
                        ? Number(user.averageStoreRating).toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>

        {/* Pagination */}
        <div className="mt-auto mt-4 flex justify-center space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0 || loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLists;
