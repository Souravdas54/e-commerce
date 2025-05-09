// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
// import profileSlice from "./profileSlice";

export const store = configureStore({
  reducer: {
    authKey: authSlice.reducer,
    // profileKey: profileSlice,
  },
});

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
