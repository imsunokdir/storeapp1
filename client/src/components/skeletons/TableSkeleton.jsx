import React from "react";

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="h-12">
          {["name", "email", "address", "role", "averageStoreRating"].map(
            (field, j) => (
              <td
                key={j}
                className="p-3 border-b border-gray-200 h-12 align-middle text-sm"
              >
                {/* Match the loaded row's structure exactly */}
                <div className="flex items-center" style={{ height: "24px" }}>
                  <div className="bg-gray-200 animate-pulse rounded w-3/4 h-4"></div>
                </div>
              </td>
            )
          )}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
