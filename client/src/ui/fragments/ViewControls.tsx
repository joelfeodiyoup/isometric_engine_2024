import { useDispatch, useSelector } from "react-redux"
import { MenuButton } from "../elements/Buttons";
import { decreaseZoom, gameControls, increaseZoom, rotate } from "../../state/features/gameControls/gameControlsSlice";
import { selectGameControlsState } from "../../state/app/store";

/**
 * This ui component would dispatch events to control the zoom of the game render
 * Since the game render is sort of "outside" of react, to implement this I would have probably had some kind of redux side effect, that calls the game render.
 * I think this approach might have worked: https://redux.js.org/usage/side-effects-approaches#listeners 
 * @returns 
 */
export const ViewControls = () => {
  const rotation = useSelector(selectGameControlsState).rotation;
  const direction = ["north", "east", "south", "west"][rotation];
  const dispatch = useDispatch();
  return <section>
    <pre>{direction}</pre>
    <MenuButton className="inverted" onClick={() => dispatch(rotate({direction: "counterclockwise"}))}>&lt;-</MenuButton>
    <MenuButton className="inverted" onClick={() => dispatch(rotate({direction: "clockwise"}))}>-&gt;</MenuButton>
    <MenuButton className="inverted" onClick={() => dispatch(decreaseZoom())}>-</MenuButton>
    <MenuButton className="inverted" onClick={() => dispatch(increaseZoom())}>+</MenuButton>
  </section>
}