import { useSelector } from "react-redux";
import { useAppDispatch } from "../../state/app/hooks"
import { ClickActionTypes, setClickAction, setGridHighlightType } from "../../state/features/gameControls/gameControlsSlice";
import { MenuButton } from "../elements/Buttons";
import { ButtonGroupCluster } from "../layout-utilities/layout-partials";
import { selectGameControlsState } from "../../state/app/store";
import { SidePanelSection, SidePanelSectionButtonAction } from "./SidePanelSection";

export const TerrainPanel = () => {
  const dispatch = useAppDispatch();
  const buttons: SidePanelSectionButtonAction[] = [
    {label: "raise", action: () => {
      dispatch(setClickAction({type: "raise", value: "tree"}));
      dispatch(setGridHighlightType("corner"));
    }},
    {label: "lower", action: () => {
      dispatch(setClickAction({type: "lower", value: "tree"}));
      dispatch(setGridHighlightType("corner"));
    }},
    {label: "build", action: () => {
      dispatch(setClickAction({type: "build", value: "tree"}));
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