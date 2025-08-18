import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./store";
import userReducer from "./user";

const rootStore = configureStore({
  reducer: {
    store: storeReducer,
    user: userReducer,
  },
});

export default rootStore;
