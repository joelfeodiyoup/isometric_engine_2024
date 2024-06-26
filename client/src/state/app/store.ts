import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { userReducer } from '../features/user/userSlice';
import { decreaseZoom, gameControls, increaseZoom, rotate } from '../features/gameControls/gameControlsSlice';
import { uiReducer } from '../features/ui/uiSlice';
import { gameState } from '../features/gameState/gameStateSlice';

// not sure yet what the best pattern for this will be.
// basically, as a redux side effect, I want to call some function.
// But, I want to be able to programmatically set this function,
// because I'm not sure which order the code will be run.
export const stateListenerActions = {
  onZoom: () => {},
  onRotate: () => {},
}

// not sure yet where is best to put this (side effects)
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: increaseZoom,
  effect: () => stateListenerActions.onZoom()
});
listenerMiddleware.startListening({
  actionCreator: decreaseZoom,
  effect: () => stateListenerActions.onZoom()
});
listenerMiddleware.startListening({
  actionCreator: rotate,
  effect: () => stateListenerActions.onRotate()
});

export const store = configureStore({
  reducer: {
    gameControls,
    gameState,
    user: userReducer,
    ui: uiReducer
  },
  middleware: (getDefaultValues) => {
    return getDefaultValues().prepend(listenerMiddleware.middleware)
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectGameControlsState = (state: RootState) => state.gameControls.value;