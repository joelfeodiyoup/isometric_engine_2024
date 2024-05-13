import { ReactElement } from "react";
import styled from "styled-components";
import { Panel } from "./Cluster";
import { colors } from "../useColours";

export const Layout = ({children}: {children: {
  top: ReactElement,
  side: ReactElement,
  gameRender: ReactElement,
  modal: ReactElement | null
}}) => {
  return (<>
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <TopPanel as={"header"} style={{zIndex: 10}}>
        {children.top}
      </TopPanel>
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        height: '100%',
      }}>
        <div style={{
          flexGrow: 1,
          height: '100%',
          position: "relative"
        }}>
          {children.gameRender}
          {children.modal && <div style={{
            position: 'absolute',
            display: "flex",
            top: 0,right: 0, left: 0, bottom: 0,
            pointerEvents: "none",
            padding: "5rem"
            }}>
            {children.modal}
          </div> }
        </div>
        <SidePanel>
          {children.side}
        </SidePanel>
      </section>
    </section>
  </>)
}

const TopPanel = styled(Panel)`
  border-bottom: ${colors.borderWidth} solid ${colors.border};
  padding-inline: 1rem;
`;

const SidePanel = styled(Panel)`
  margin-left: auto;
  padding-inline: 0.5rem;
  padding-top: 0.5rem;
  border-left: ${colors.borderWidth} solid ${colors.border};
`;