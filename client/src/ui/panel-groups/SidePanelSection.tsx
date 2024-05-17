import React, { useState } from "react"
import { ButtonGroupCluster, Stack } from "../layout-utilities/layout-partials"
import { selectGameControlsState } from "../../state/app/store";
import { useSelector } from "react-redux";
import { MenuButton } from "../elements/Buttons";
import { ModalHeading } from "../elements/Headings";

export type SidePanelSectionButtonAction = {label: string, action: () => void};
export const SidePanelSection = (props: React.ComponentPropsWithoutRef<"div"> & {heading: string, actions: SidePanelSectionButtonAction[]}) => {
  const [elementId] = useState(`${Math.random() * 1000}`);
  const currentAction = useSelector(selectGameControlsState).clickAction;
  const [activeButton, setActiveButton] = useState('');

  return <Stack>
    <ModalHeading>{props.heading}</ModalHeading>
    <ButtonGroupCluster>
    {props.actions.map((action, i) => {
      const key = `side-panel-${props.heading}-${i}-${elementId}`;
      return <MenuButton
        key={key}
        className={`inverted ${key === activeButton ? 'isActive' : ''}`}
        onClick={() => {
          action.action();
          setActiveButton(key);
        }}
        >{action.label}
      </MenuButton>
    })}
    </ButtonGroupCluster>
  </Stack>
}