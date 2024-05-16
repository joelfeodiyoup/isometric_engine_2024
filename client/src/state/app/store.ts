import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../features/user/userSlice';
import { gameControls } from '../features/gameControls/gameControlsSlice';
import { uiReducer } from '../features/ui/uiSlice';
import { gameState } from '../features/gameState/gameStateSlice';

export const store = configureStore({
  reducer: {
    gameControls,
    gameState,
    user: userReducer,
    ui: uiReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectGameControlsState = (state: RootState) => state.gameControls.value;