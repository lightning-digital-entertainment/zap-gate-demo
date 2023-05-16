import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SerializableZapGateEvent } from "../routes/ZapGateEvent";

export interface NostrState {
    unlocked: string[];
    zgEvents: SerializableZapGateEvent[];
    zgEventIds: string[];
}

const initialState: NostrState = {
    unlocked: [],
    zgEvents: [],
    zgEventIds: [],
};

export const nostrSlice = createSlice({
    name: "nostr",
    initialState,
    reducers: {
        addUnlock: (state, action: PayloadAction<string>) => {
          state.unlocked = [...new Set([...state.unlocked, action.payload])]
        },
        addEvent: (state, action: PayloadAction<SerializableZapGateEvent>) => {
            if (state.zgEventIds.includes(action.payload.id)) {
                return;
            }
            state.zgEvents = [...state.zgEvents, action.payload];
            state.zgEventIds = [...state.zgEventIds, action.payload.id];
        }
    },
});

export const { addUnlock, addEvent } = nostrSlice.actions;

export default nostrSlice.reducer;
