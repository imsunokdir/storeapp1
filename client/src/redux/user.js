import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersThunk } from "./thunk/userThunk";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: "",
    page: 1,
    totalPages: 1,
    sortField: "name",
    sortOrder: "asc",
    search: "",
    roleFilter: "all",
  },
  reducers: {
    setSortField: (state, action) => {
      if (state.sortField === action.payload) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.sortField = action.payload;
        state.sortOrder = "asc";
      }
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setSortOrder:(state, action)=>{
        state.sortOrder=action.payload;
        state.page=1
    },
    setRoleFilter: (state, action) => {
      console.log("role filter change:", action.payload);
      state.roleFilter = action.payload;
      state.page = 1;
    },
    clearUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.totalPages = 1;
      state.search = "";
      state.roleFilter = "all";
      state.sortField = "name";
      state.sortOrder = "asc";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        // state.user=action.payload
        console.log("fetch users thunk:", action.payload);
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.page += 1;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
