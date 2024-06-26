import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type GameDimensions = {
  width: number,
  height: number
}
export type GameState = {
  dimensions: GameDimensions,
  isometric: {xStep: number, yStep: number}
}
const initialState: {value: GameState} = {
  value: {
    dimensions: {
      width: 40,
      height: 40,
    },
    isometric: {
      xStep: 3,
      yStep: 3,
    }
  }
}

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    setGameDimensions: (state, action: PayloadAction<GameDimensions>) => {
      state.value.dimensions = {...action.payload};
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.value = {...state.value, ...action.payload};
    }
  }
});

export const {setGameDimensions, setGameState} = gameStateSlice.actions;
export const gameState = gameStateSlice.reducer;
export const selectGameDimensions = (state: RootState) => state.gameState.value.dimensions;
export const selectGameState = (state: RootState) => state.gameState.value;