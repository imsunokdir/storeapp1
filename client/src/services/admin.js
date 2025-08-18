import api from "./api";

export const getStats = async () =>
  await api.get("/admin/dashboard", { withCredentials: true });

export const createNewUser = async (data) =>
  await api.post("/admin/create-user", data, { withCredentials: true });
export const createNewStore = async (data) =>
  await api.post("/admin/create-store", data, { withCredentials: true });

export const getUsers = async ({
  search = "",
  role = "",
  sortBy = "name",
  order = "ASC",
  page = 1,
  limit = 5,
} = {}) => {
  const params = {};

  if (search && search.trim()) {
    params.search = search.trim();
  }
  if (role) params.role = role;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  params.page = page;
  params.limit = limit;

  return await api.get("/admin/users", {
    params,
    withCredentials: true,
  });
};

// In your services/admin.js file
export const getStores = async ({
  search = "",
  sortBy = "name",
  order = "ASC",
  page = 1,
  limit = 2,
} = {}) => {
  const params = { sortBy, order, page, limit };

  if (search && typeof search === "string" && search.trim()) {
    params.search = search.trim();
  }

  return await api.get("/admin/stores", {
    params,
    withCredentials: true,
  });
};
