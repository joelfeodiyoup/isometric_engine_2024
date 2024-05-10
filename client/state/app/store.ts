import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { highlightTypeReducer } from '../features/highlightType/highlightTypeSlice';
import { clickActionReducer } from '../features/clickAction/clickActionSlice';
import { zoomReducer, zoomSlice } from '../features/zoom/zoomSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    highlightType: highlightTypeReducer,
    clickAction: clickActionReducer,
    zoom: zoomReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;