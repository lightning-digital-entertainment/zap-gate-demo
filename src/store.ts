import { configureStore } from "@reduxjs/toolkit";
import nostrReducer from "./state/nostrSlice";

export const store = configureStore({
  reducer: {
    nostr: nostrReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch