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

export const fetchStoresWithTanStack = async ({ pageParam = 1, queryKey }) => {
  const [_key, { search, sortField, sortOrder }] = queryKey;
  const res = await fetch(
    `/api/stores?search=${search}&sortBy=${sortField}&order=${sortOrder}&page=${pageParam}`
  );
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
};
