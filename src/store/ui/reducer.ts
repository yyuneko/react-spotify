import { createSlice } from "@reduxjs/toolkit";

export interface UIState {
  colcount: number;
  documentTitle: string;
}

const defaultState: UIState = {
  colcount: 0,
  documentTitle: "Spotify"
};
const slice = createSlice({
  name: "ui",
  initialState: defaultState,
  reducers: {
    setColcount: (state, action) => {
      state.colcount = action.payload;
    },
    setTitle: (state, action) => {
      state.documentTitle = action.payload;
    },
  },
});
export const { setColcount,setTitle } = slice.actions;

export default slice.reducer;
