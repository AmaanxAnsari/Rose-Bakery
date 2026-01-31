import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "../api/baseApiSlice";
import { seoApiSlice } from "../api/seoApiSlice";
import authReducer from "../api/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    [seoApiSlice.reducerPath]: seoApiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApiSlice.middleware),
});
