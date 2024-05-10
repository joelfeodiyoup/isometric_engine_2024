import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const initialState = {
  value: 0
}

export const zoomSlice = createSlice({
  name: 'highlightType',
  initialState,
  reducers: {
    increaseZoom: (state) => {
      state.value = state.value + 1;
    },
    decreaseZoom: (state) => {
      state.value = state.value - 1;
    }
  }
});

export const { increaseZoom, decreaseZoom } = zoomSlice.actions;
export const selectZoom = (state: RootState) => state.zoom;
export const zoomReducer =  zoomSlice.reducer;