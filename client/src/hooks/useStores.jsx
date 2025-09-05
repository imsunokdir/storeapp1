import { useInfiniteQuery } from "@tanstack/react-query";
import { getStores } from "../services/admin";

export const useStores = ({ search, sortBy, order, limit = 3 }) => {
  return useInfiniteQuery({
    queryKey: ["stores", search, sortBy, order],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getStores({
        search,
        sortBy,
        order,
        page: pageParam,
        limit,
      });

      // Axios wraps the payload inside `response.data`
      const result = response.data;
      console.log("Fetched stores result:", result); // { stores: [...], pagination: {...} }

      return result;
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, hasMore } = lastPage.pagination;
      return hasMore ? currentPage + 1 : undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
