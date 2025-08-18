import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../services/admin";

export const fetchUsersThunk = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    const { sortField, sortOrder, search, roleFilter, page } = getState().user;

    try {
      const params = {
        sortBy: sortField,
        order: sortOrder.toUpperCase(),
        page,
        limit: 5,
      };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== "all") params.role = roleFilter;

      const res = await getUsers(params);
      console.log("res:", res);
      return res.data;
    } catch (error) {
      return rejectWithValue(err.response?.data || "Failed to fetch users");
    }
  }
);
