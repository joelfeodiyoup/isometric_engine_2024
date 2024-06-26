import { useDispatch } from "react-redux"
import { SidePanelSection, SidePanelSectionButtonAction } from "./SidePanelSection"
import { useAppDispatch } from "../../state/app/hooks"
import { setClickAction, setGridHighlightType } from "../../state/features/gameControls/gameControlsSlice";

export const DebugPanel = () => {
  const dispatch = useAppDispatch();
  const buttons: SidePanelSectionButtonAction[] = [
    {label: "point", action: () => {
      dispatch(setClickAction({type: "debug", value: "tree"}));
      dispatch(setGridHighlightType("corner"));
    }},
    {label: "cell", action: () => {
      dispatch(setClickAction({type: "debug", value: "tree"}));
      dispatch(setGridHighlightType("cell"));
    }},
  ];
  return (<SidePanelSection
    actions={buttons}
    heading="debug"></SidePanelSection>
  )
}