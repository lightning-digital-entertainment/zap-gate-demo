import { configureStore } from "@reduxjs/toolkit";
import nostrReducer from "./state/nostrSlice";
import listenerMiddleware from "./middleware";
import utilityReducer from "./state/utilitySlice";

export const store = configureStore({
    reducer: {
        nostr: nostrReducer,
        utility: utilityReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
