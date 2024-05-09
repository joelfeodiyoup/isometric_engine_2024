import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

/**
 * The different things that the render should do when the user clicks into it
 * For example, it could be modifying terrain, or building something (a building/road/etc)
 */
type ClickActionTypes = "raise" | "lower" | "build";
interface ClickActionState {
  value: ClickActionTypes
}
const initialState: ClickActionState = {
  value: "raise",
}

export const clickActionSlice = createSlice({
  name: 'clickAction',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<ClickActionTypes>) => {
      state.value = action.payload
    }
  }
});

export const setClickAction = clickActionSlice.actions.setValue;
export const clickActionReducer = clickActionSlice.reducer;