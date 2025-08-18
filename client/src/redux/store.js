import { createSlice } from "@reduxjs/toolkit";
import { getUserRatings } from "../services/user";
import { fetchStoresThunk } from "./thunk/storeThunks";

const storeSlice = createSlice({
  name: "store",
  initialState: {
    stores: [],
    userRatings: {},
    loading: false,
    error: "",
    page: 1,
    hasMore: true,
    sortField: "name",
    sortOrder: "asc",
    search: "",
  },
  reducers: {
    resetStores(state) {
      state.stores = [];
      state.page = 1;
      state.hasMore = true;
    },
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      // state.page;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      // state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoresThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoresThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = [...state.stores, ...action.payload.stores];
        state.page += 1;
        state.hasMore = action.payload.pagination.hasMore;
        console.log("action.payload fetch stores:", action.payload);
      })
      .addCase(fetchStoresThunk.rejected, (state, action) => {
        state.loading = false;
        console.log("fetch store error");
      });
  },
});

export const storeActions = storeSlice.actions;
export default storeSlice.reducer;
