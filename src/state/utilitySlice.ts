import { createSlice } from "@reduxjs/toolkit";

export interface UtilityState {
    bannerDismissed: boolean;
}

const initialState: UtilityState = {
    bannerDismissed: false,
};

const utilitySlice = createSlice({
    name: "utility",
    initialState,
    reducers: {
        dismissBanner: (state) => {
            state.bannerDismissed = true;
        },
    },
});

export const { dismissBanner } = utilitySlice.actions;

export default utilitySlice.reducer;
