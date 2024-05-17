import { Terrain } from "../panel-groups/Terrain"
import { Cluster, Stack } from "../layout-utilities/layout-partials"

import admin from "../../images/icons/admin.png";
import agriculture from "../../images/icons/agriculture.png";
import civic from "../../images/icons/civic.png";
import entertainment from "../../images/icons/entertainment.png";
import house from "../../images/icons/house.png";
import industry from "../../images/icons/industry.png";
import storage from "../../images/icons/storage.png";
import { useState } from "react";
import { SideMenuCategoryButtons } from "../elements/Buttons";
import styled from "styled-components";
import { colors } from "../useColours";
import { AgriculturePanel } from "../panel-groups/AgriculturePanel";
import { HousingPanel } from "../panel-groups/HousingPanel";
import { DebugPanel } from "../panel-groups/DebugPanel";

/**
 * The side panel section in the layout.
 * @returns 
 */
export const SideNav = () => {
  const [icons, setIcons] = useState([
    {image: admin, display: <DebugPanel/>, active: true},
    {image: civic, display: <Terrain/>, active: false},
    {image: agriculture, display: <AgriculturePanel/>, active: false},
    {image: entertainment, display: <AgriculturePanel/>, active: false},
    {image: house, display: <HousingPanel />, active: false},
    {image: industry, display: <Terrain />, active: false},
    {image: storage, display: <AgriculturePanel />, active: false},
  ]);
  return (<StyledSidePanel>
    <IconStack>
      {icons.map((icon, i) => {
        return <SideMenuCategoryButtons
          className={`${icon.active ? 'isActive' : ''}`}
          key={`side-menu-button-${i}`}
          imagesrc={icon.image}
          onClick={() => {
            const newIcons = icons.map((icon, j) => ({...icon, active: j === i}))
            setIcons(newIcons);
          }}
          ></SideMenuCategoryButtons>
      })}
    </IconStack>
      <StyledSidePanelBox>
        {icons.find(icon => icon.active)?.display}
      </StyledSidePanelBox>
    </StyledSidePanel>
  )
}

const StyledSidePanelBox = styled.section`
  flex-grow: 1;
  background: ${colors.darkBlue};
  padding: 0.5rem;
`;

const StyledSidePanel = styled(Cluster)`
  width: 14rem;
  flex-wrap: nowrap;
  background-image: ${colors.texturedBackground};
  column-gap: 0;
`;

const IconStack = styled(Stack)`
  flex-shrink: 0;
`