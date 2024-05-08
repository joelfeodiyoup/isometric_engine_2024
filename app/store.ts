import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { highlightTypeReducer } from '../features/highlightType/highlightTypeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    highlightType: highlightTypeReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;