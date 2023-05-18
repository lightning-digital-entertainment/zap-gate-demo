import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SerializableZapGateEvent } from "../routes/ZapGateEvent";

export interface NostrState {
    unlocked: string[];
    zgEvents: SerializableZapGateEvent[];
    zgEventIds: string[];
    key: string | undefined;
}

const initialState: NostrState = {
    unlocked: [],
    zgEvents: [],
    zgEventIds: [],
    key: undefined,
};

export const nostrSlice = createSlice({
    name: "nostr",
    initialState,
    reducers: {
        addUnlock: (state, action: PayloadAction<string>) => {
          state.unlocked = [...new Set([...state.unlocked, action.payload])]
        },
        hydrateUnlocks: (state, action: PayloadAction<string[]>) => {
            state.unlocked = action.payload
        },
        addEvent: (state, action: PayloadAction<SerializableZapGateEvent>) => {
            if (state.zgEventIds.includes(action.payload.id)) {
                return;
            }
            state.zgEvents = [...state.zgEvents, action.payload];
            state.zgEventIds = [...state.zgEventIds, action.payload.id];
        },
        setKey: (state, action: PayloadAction<string>) => {
            state.key = action.payload;
        }
    },
});

export const { addUnlock, addEvent, hydrateUnlocks, setKey } = nostrSlice.actions;

export default nostrSlice.reducer;
