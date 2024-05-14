import { useSelector } from "react-redux";
import { useAppDispatch } from "../../state/app/hooks"
import { ClickActionTypes, setClickAction, setGridHighlightType } from "../../state/features/gameControls/gameControlsSlice";
import { MenuButton } from "../elements/Buttons";
import { ButtonGroupCluster } from "../layout-utilities/layout-partials";
import { selectGameControlsState } from "../../state/app/store";
import { SidePanelSection, SidePanelSectionButtonAction } from "./SidePanelSection";

export const Terrain = () => {
  const dispatch = useAppDispatch();
  const buttons: SidePanelSectionButtonAction[] = [
    {label: "raise", action: () => {
      dispatch(setClickAction("raise"));
      dispatch(setGridHighlightType("corner"));
    }},
    {label: "lower", action: () => {
      dispatch(setClickAction("lower"));
      dispatch(setGridHighlightType("corner"));
    }},
    {label: "build", action: () => {
      dispatch(setClickAction("build"));
      dispatch(setGridHighlightType("cell"));
    }},
  ]
  return (<>
    <SidePanelSection
      actions={buttons}
      heading="terrain"
    ></SidePanelSection>
  </>)
}