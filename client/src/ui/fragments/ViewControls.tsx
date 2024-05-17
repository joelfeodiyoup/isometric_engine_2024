import { useDispatch } from "react-redux"
import { MenuButton } from "../elements/Buttons";
import { rotate } from "../../state/features/gameControls/gameControlsSlice";

/**
 * This ui component would dispatch events to control the zoom of the game render
 * Since the game render is sort of "outside" of react, to implement this I would have probably had some kind of redux side effect, that calls the game render.
 * I think this approach might have worked: https://redux.js.org/usage/side-effects-approaches#listeners 
 * @returns 
 */
export const ViewControls = () => {
  const dispatch = useDispatch();
  return <section>
    <MenuButton className="inverted" onClick={() => dispatch(rotate({direction: "clockwise"}))}>&lt;-</MenuButton>
    <MenuButton className="inverted" onClick={() => dispatch(rotate({direction: "counterclockwise"}))}>-&gt;</MenuButton>
  </section>
}