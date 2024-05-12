import { useAppDispatch } from "../state/app/hooks"
import { setClickAction, setGridHighlightType } from "../state/features/gameControls/gameControlsSlice";

export const Terrain = () => {
  const dispatch = useAppDispatch();
  const buttons: {text: string, action: () => void}[] = [
    {text: "raise", action: () => {
      dispatch(setClickAction("raise"));
      dispatch(setGridHighlightType("corner"));
    }},
    {text: "lower", action: () => {
      dispatch(setClickAction("lower"));
      dispatch(setGridHighlightType("corner"));
    }},
    {text: "build", action: () => {
      dispatch(setClickAction("build"));
      dispatch(setGridHighlightType("cell"));
    }},
  ]
  return (<>
    {buttons.map(button => <button onClick={button.action}>{button.text}</button>)}
  </>)
}