import api from "./api";

export const getUserRatings = async () =>
  await api.get("/user/rating", { withCredentials: true });

export const submitRating = async (storeId, rating) =>
  await api.post(
    `/user/stores/${storeId}/rate`,
    { rating },
    {
      withCredentials: true,
    }
  );
