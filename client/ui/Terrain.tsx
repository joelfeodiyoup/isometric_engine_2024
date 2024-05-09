import { useAppDispatch } from "../state/app/hooks"
import { setClickAction } from "../state/features/clickAction/clickActionSlice";
import { setCellHighlightType } from "../state/features/highlightType/highlightTypeSlice";

export const Terrain = () => {
  const dispatch = useAppDispatch();
  const buttons: {text: string, action: () => void}[] = [
    {text: "raise", action: () => {
      dispatch(setClickAction("raise"));
      dispatch(setCellHighlightType("corner"));
    }},
    {text: "lower", action: () => {
      dispatch(setClickAction("lower"));
      dispatch(setCellHighlightType("corner"));
    }},
    {text: "build", action: () => {
      dispatch(setClickAction("build"));
      dispatch(setCellHighlightType("cell"));
    }},
  ]
  return (<>
    {buttons.map(button => <button onClick={button.action}>{button.text}</button>)}
  </>)
}