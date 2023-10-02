import { createSlice } from "@reduxjs/toolkit";

const RootSlice = createSlice({
    name: "root",
    initialState: {Hello:"world"},
    reducers: {},
})
export default RootSlice.reducer;
export const {} = RootSlice.actions;