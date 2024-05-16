import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type GameDimensions = {
  width: number,
  height: number
}
type GameState = {
  dimensions: GameDimensions,
}
const initialState: {value: GameState} = {
  value: {
    dimensions: {
      width: 10,
      height: 10,
    }
  }
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    setGameDimensions: (state, action: PayloadAction<GameDimensions>) => {
      state.value.dimensions = {...action.payload};
    }
  }
});

export const {setGameDimensions} = gameStateSlice.actions;
export const gameState = gameStateSlice.reducer;
export const selectGameDimensions = (state: RootState) => state.gameState.value.dimensions;