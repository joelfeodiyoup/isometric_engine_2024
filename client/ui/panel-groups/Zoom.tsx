import { useAppDispatch } from "../../state/app/hooks"
import { increaseZoom } from "../../state/features/gameControls/gameControlsSlice";

/**
 * This ui component would dispatch events to control the zoom of the game render
 * Since the game render is sort of "outside" of react, to implement this I would have probably had some kind of redux side effect, that calls the game render.
 * I think this approach might have worked: https://redux.js.org/usage/side-effects-approaches#listeners 
 * @returns 
 */
export const Zoom = () => {
  const dispatch = useAppDispatch();
  return (<>
    <button onClick={() => dispatch(increaseZoom())}>zoom in</button>
  </>)
}