import { ReactElement } from "react";
import styled from "styled-components";
import { colors } from "../useColours";

export const Modal = ({
  children,
  isOpen,
  onClose
}: {
  children: ReactElement | null,
  isOpen: boolean,
  onClose: () => void
}) => {
  return <>{(children && isOpen) && <StyledModal
  ><button onClick={onClose}>close</button>{isOpen && children}
  </StyledModal>}</>;
};

const StyledModal = styled.section`
  background-image: ${colors.texturedBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  pointer-events: initial;
  margin-inline: auto;
  height: fit-content;
  padding: 5rem;
  margin-top: 3rem;
  border: ${colors.borderWidth} solid ${colors.border};
`
