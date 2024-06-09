import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

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
    zoomLevel: {prev: number, curr: number};
    rotation: number;
  };
}

/**
 * A simple class to abstract going forwards / backwards in zoom, blocking problems with out of bounds
 */
class ZoomIterator {
  constructor(private array: number[], private index: number) {
      if (index < 0 || index >= array.length) {
          throw new Error ("index out of bounds");
      }
  }
  get value() {
      return this.array[this.index];
  }
  get next() {
      this.index = Math.min(this.index + 1, this.array.length - 1);
      return this.array[this.index];
  }
  get prev() {
      this.index = Math.max(0, this.index - 1);
      return this.array[this.index];
  }
}

const iterator = new ZoomIterator([0.015625, 0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64], 6);
const initialState: GameControlState = {
  value: {
    clickAction: "raise",
    highlightType: "corner",
    zoomLevel: {prev: iterator.value, curr: iterator.value},
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
      state.value = { ...state.value, zoomLevel: {prev: iterator.value, curr: iterator.next}};
    },
    decreaseZoom: (state) => {
      state.value = { ...state.value, zoomLevel: {prev: iterator.value, curr: iterator.prev}};
    },
    rotate: (state, action: PayloadAction<{direction: "clockwise" | "counterclockwise"}>) => {
      state.value = {...state.value, rotation: (state.value.rotation + (action.payload.direction === "clockwise" ? -1 : 1) + 4) % 4}
    },
    resetGameControls: (state) => {
      state.value = initialState.value;
    }
  },
});

export const {
  setClickAction,
  setGridHighlightType,
  toggleGridHighlightType,
  increaseZoom,
  decreaseZoom,
  rotate,
  resetGameControls
} = clickActionSlice.actions;

export const gameControls = clickActionSlice.reducer;
export const selectZoom = (state: RootState) => state.gameControls.value.zoomLevel;