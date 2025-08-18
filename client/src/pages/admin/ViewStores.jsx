import React, { useState, useEffect } from "react";
import { getStores } from "../../services/admin";
import GoBack from "../../components/GoBack";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "address", label: "Address" },
  { value: "averageRating", label: "Rating" },
];

const ViewStores = () => {
  const [stores, setStores] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStores({
        search: search.trim(),
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
        page,
        limit: 2,
      });
      setStores(res.data.stores);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("store load error:", err);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortField, sortOrder, search, page]);

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
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* GoBack */}
      <div className="lg:w-auto lg:flex-shrink-0 p-2">
        <GoBack />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-5xl lg:mx-0 mx-auto flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Stores List</h1>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="p-3 border border-gray-300 rounded mb-3 sm:mb-0 w-full max-w-md"
          />
          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
            className="p-3 border border-gray-300 rounded w-full max-w-xs"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                Sort by {label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              setPage(1);
            }}
            className="mt-2 sm:mt-0 px-4 py-3 bg-gray-200 rounded hover:bg-gray-300"
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>

        {/* Table */}
        <div className="flex flex-col justify-between flex-1 min-h-[300px]">
          <table className="w-full bg-white rounded shadow table-fixed">
            <thead className="h-12">
              <tr className="h-12">
                <th
                  className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                  style={{ width: "25%" }}
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  className="cursor-pointer p-3 border-b border-gray-300 text-left h-12 align-middle truncate"
                  style={{ width: "25%" }}
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortField === "email"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
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
                  style={{ width: "25%" }}
                  onClick={() => handleSort("averageRating")}
                >
                  Rating{" "}
                  {sortField === "averageRating"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
              </tr>
            </thead>

            {/* Multiple tbody for consistent height like UserLists */}
            {loading ? (
              <tbody>
                <TableSkeleton rows={5} />
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="p-4 text-center text-red-600 h-12">
                    {error}
                  </td>
                </tr>
              </tbody>
            ) : stores.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={4} className="p-4 text-center h-12">
                    No stores found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 h-12">
                    <td className="p-3 border-b border-gray-200 truncate">
                      {store.name}
                    </td>
                    <td className="p-3 border-b border-gray-200 truncate">
                      {store.email}
                    </td>
                    <td className="p-3 border-b border-gray-200 truncate">
                      {store.address}
                    </td>
                    <td className="p-3 border-b border-gray-200 truncate">
                      {store.averageRating
                        ? Number(store.averageRating).toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {/* Pagination always at bottom */}

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStores;
