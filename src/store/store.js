import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./homeSlice";
import sessionReducer from "./sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    home: homeSlice,
  },
});
