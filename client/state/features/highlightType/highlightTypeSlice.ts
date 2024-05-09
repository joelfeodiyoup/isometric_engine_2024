import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

/**
 * when highlight an area of the grid, we could be trying to highlight the entire cell, or just a corner (or, later, an edge)
 * These different types could have different actions.
 * E.g. highlighting a corner of a cell could allow you to raise/lower just that corner
 * highlighting the entire cell could allow you to raise lower the entire cell
 * highlighting an edge might allow you to add a wall along that edge.
 * These are just examples. It could also be something much scarier.
 */
type HighlightTypes = "cell" | "corner";
interface HighlightTypeState {
  value: HighlightTypes,
}
const initialState: HighlightTypeState = {
  value: "cell"
}

export const highlightTypeSlice = createSlice({
  name: 'highlightType',
  initialState,
  reducers: {
    toggle: (state) => {
      if (state.value === "cell") {
        state.value = "corner";
      } else {
        state.value = "cell";
      }
    },
    setCellHighlightType: (state, action: PayloadAction<HighlightTypes>) => {
      state.value = action.payload;
    }
  }
});

export const { toggle, setCellHighlightType } = highlightTypeSlice.actions;
export const selectHighlightType = (state: RootState) => state.highlightType.value;
export const highlightTypeReducer =  highlightTypeSlice.reducer;