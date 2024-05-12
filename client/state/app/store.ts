import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../features/user/userSlice';
import { gameControls } from '../features/gameControls/gameControlsSlice';

export const store = configureStore({
  reducer: {
    gameControls,
    user: userReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;