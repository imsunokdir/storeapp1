import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStores } from "../../services/admin";

// export const fetchStoresThunk = createAsyncThunk(
//   "store/fetchStores",
//   async ({
//     search = "",
//     sortBy = "name",
//     order = "ASC",
//     page = 1,
//     limit = 2,
//   }) => {
//     try {
//       const res = await getStores({ search, sortBy, order, page, limit });
//       console.log("payyyy:", res.data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Error fetching stores");
//     }
//   }
// );
export const fetchStoresThunk = createAsyncThunk(
  "store/fetchStores1",
  async (_, { getState, rejectWithValue }) => {
    const { search, sortField, sortOrder, page, limit = 2 } = getState().store;
    try {
      const res = await getStores({
        search,
        sortBy: sortField,
        order: sortOrder,
        page,
        limit,
      });
      console.log("stores and pagination payload thunk:", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching stores");
    }
  }
);
