import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface NostrState {
    unlocked: string[];
}

const initialState: NostrState = {
    unlocked: [],
};

export const nostrSlice = createSlice({
    name: "nostr",
    initialState,
    reducers: {
        addUnlock: (state, action: PayloadAction<string>) => {
          state.unlocked = [...new Set([...state.unlocked, action.payload])]
        },
    },
});

export const { addUnlock } = nostrSlice.actions;

export default nostrSlice.reducer;
