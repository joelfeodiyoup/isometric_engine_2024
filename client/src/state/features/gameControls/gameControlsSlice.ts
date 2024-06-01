import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * The different things that the render should do when the user clicks into it
 * For example, it could be modifying terrain, or building something (a building/road/etc)
 */
export type ClickActionTypes = "raise" | "lower" | "build" | "debug";
/**
 * when highlight an area of the grid, we could be trying to highlight the entire cell, or just a corner (or, later, an edge)
 * These different types could have different actions.
 * E.g. highlighting a corner of a cell could allow you to raise/lower just that corner
 * highlighting the entire cell could allow you to raise lower the entire cell
 * highlighting an edge might allow you to add a wall along that edge.
 * These are just examples. It could also be something much scarier.
 */
type HighlightTypes = "cell" | "corner";
interface GameControlState {
  value: {
    clickAction: ClickActionTypes;
    highlightType: HighlightTypes;
    zoomLevel: number;
    rotation: number;
  };
}
const initialState: GameControlState = {
  value: {
    clickAction: "raise",
    highlightType: "corner",
    zoomLevel: 0,
    rotation: 0,
  },
};

export const clickActionSlice = createSlice({
  name: "clickAction",
  initialState,
  reducers: {
    setClickAction: (state, action: PayloadAction<ClickActionTypes>) => {
      state.value = { ...state.value, clickAction: action.payload };
    },
    setGridHighlightType: (state, action: PayloadAction<HighlightTypes>) => {
      state.value = { ...state.value, highlightType: action.payload };
    },
    toggleGridHighlightType: (state) => {
      if (state.value.highlightType === "cell") {
        state.value = { ...state.value, highlightType: "corner" };
      } else {
        state.value = { ...state.value, highlightType: "cell" };
      }
    },
    increaseZoom: (state) => {
      state.value = { ...state.value, zoomLevel: state.value.zoomLevel + 1 };
    },
    decreaseZoom: (state) => {
      state.value = { ...state.value, zoomLevel: state.value.zoomLevel - 1 };
    },
    rotate: (state, action: PayloadAction<{direction: "clockwise" | "counterclockwise"}>) => {
      state.value = {...state.value, rotation: (state.value.rotation + (action.payload.direction === "clockwise" ? 1 : -1) + 4) % 4}
    }
  },
});

export const {
  setClickAction,
  setGridHighlightType,
  toggleGridHighlightType,
  increaseZoom,
  decreaseZoom,
  rotate
} = clickActionSlice.actions;

export const gameControls = clickActionSlice.reducer;
