import api from "./api";

export const getMyStores = async () =>
  await api.get("/store/my-stores", { withCredentials: true });

export const getStoreDashbboardData = async () =>
  await api.get("/store/dashboard", { withCredentials: true });

export const getStoreRaters = async (storeId) =>
  await api.get(`/store/${storeId}/raters`, { withCredentials: true });

export const updatePassword = async (passwordData) =>
  await api.put("/store/update-password", passwordData, {
    withCredentials: true,
  });

export const getStoreById = async (storeId) =>
  await api.get(`/store/store-details/${storeId}`, { withCredentials: true });

export const getStoreRatingDetails = async (storeId) =>
  await api.get(`/store/rating-details/${storeId}`, { withCredentials: true });
