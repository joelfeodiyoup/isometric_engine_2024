import React, { useState } from "react"
import styled from "styled-components";
import { Panel } from "./layout-partials";
import { colors } from "../useColours";

export const DropdownMenu = (props: React.ComponentPropsWithoutRef<"span"> & {
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