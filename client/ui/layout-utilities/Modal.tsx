import React, { ReactElement } from "react";
import styled from "styled-components";
import { colors } from "../useColours";
import { MenuButton } from "../elements/Buttons";
import { Stack } from "./layout-partials";

/**
 * This handles displaying a modal
 * @param param0 
 * @returns 
 */
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

/**
 * This component helps to make all the modals look consistent
 * @param props 
 * @returns 
 */
export const ModalInstance = (props: React.ComponentPropsWithRef<"div"> & {heading: string, actions: {label: string, onClick: () => void}[]}) => {
  return <Stack>
    <ModalHeading>{props.heading}</ModalHeading>
    {props.children}
    {props.actions.map((action, i) => {
      return <MenuButton
        key={`modal-action-${i}`}
        className='primary'
        onClick={action.onClick}
      >{action.label}</MenuButton>
    })}
  </Stack>
}

const ModalHeading = styled.h2`
  text-align: center;
  color: white;
  background: ${colors.darkBlue};
  margin-bottom: 2rem;
  text-transform: uppercase;
`;
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
