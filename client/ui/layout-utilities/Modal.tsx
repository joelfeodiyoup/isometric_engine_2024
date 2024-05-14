import { ReactElement } from "react";
import styled from "styled-components";
import { colors } from "../useColours";
import { MenuButton } from "../elements/Buttons";
import { Stack } from "./Cluster";

export const Modal = ({
  children,
  isOpen,
  onClose,
}: {
  children: ReactElement | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      {children && isOpen && (
        <StyledModal>
          <ModalContentStack>
          <MenuButton className='inverted' onClick={onClose}>close</MenuButton>
          {isOpen && children}
          </ModalContentStack>
        </StyledModal>
      )}
    </>
  );
};

const ModalContentStack = styled(Stack)`
  min-width: 20rem;
  > *:nth-child(1) {
    margin-bottom:2rem;
  }
`;

const StyledModal = styled.section`
  background-image: ${colors.texturedBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  pointer-events: initial;
  margin-inline: auto;
  height: fit-content;
  padding: 2rem;
  border: ${colors.borderWidth} solid ${colors.border};
`;
