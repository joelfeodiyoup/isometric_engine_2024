import React, { PropsWithChildren, ReactElement, ReactNode, useState } from "react"
import { BaseProps } from "./App";
import styled from "styled-components";
import { Panel } from "./layout-utilities/Cluster";
import { colors } from "./useColours";

export const DropdownMenu = (props: BaseProps & {
  top: JSX.Element,
  subMenu: JSX.Element
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (<>
      <StyledDropDownTriggerElement className="relative" onClick={() => setIsOpen(!isOpen)}>
        {props.top}
        <StyledDropDownPanel as={"ul"}>
            {props.subMenu}
        </StyledDropDownPanel>
      </StyledDropDownTriggerElement>
  </>)
}


const StyledDropDownPanel = styled(Panel)`
position: absolute;
width: max-content;
border: ${colors.borderWidth} solid ${colors.border};
border-top: none;
  display: none;
`;
const StyledDropDownTriggerElement = styled.span`
  &:hover {
    ${StyledDropDownPanel} {
      display: block;
    }
  }
`;