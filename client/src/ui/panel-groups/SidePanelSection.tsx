import React from "react"
import { ButtonGroupCluster, Stack } from "../layout-utilities/layout-partials"
import { selectGameControlsState } from "../../state/app/store";
import { useSelector } from "react-redux";
import { MenuButton } from "../elements/Buttons";
import { ModalHeading } from "../elements/Headings";

export type SidePanelSectionButtonAction = {label: string, action: () => void};
export const SidePanelSection = (props: React.ComponentPropsWithoutRef<"div"> & {heading: string, actions: SidePanelSectionButtonAction[]}) => {
  const currentAction = useSelector(selectGameControlsState).clickAction;

  return <Stack>
    <ModalHeading>{props.heading}</ModalHeading>
    <ButtonGroupCluster>
    {props.actions.map((action, i) => {
      return <MenuButton
        key={`side-panel-${props.heading}-{i}-${Math.floor(Math.random() * 1000)}`}
        className={`inverted ${action.label === currentAction ? 'isActive' : ''}`}
        onClick={action.action}
        >{action.label}
      </MenuButton>
    })}
    </ButtonGroupCluster>
  </Stack>
}