import React, { ReactElement, useRef, useState } from "react";
import styled from "styled-components";
import { colors } from "../useColours";
import { MenuButton } from "../elements/Buttons";
import { Stack } from "./layout-partials";
import { ModalHeading } from "../elements/Headings";
import { closeAllModals } from "../../state/features/ui/uiSlice";
import { useDispatch } from "react-redux";


const img = document.createElement("img");   
img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * This handles displaying a modal
 * @param param0 
 * @returns 
 */
export const Modal = ({
  children,
  onClose,
}: {
  children: ReactElement | null;
  onClose: () => void;
}) => {
  const modalContainerRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startOffset, setStartOffset] = useState({left: 0, top: 0});
  const [relativePosition, setRelativePosition] = useState({left: 0, top: 0});
  const [mouseDownPosition, setMouseDownPosition] = useState<{x: number, y: number} | null>(null);
  const handleDrag = (event: React.DragEvent<HTMLElement>) => {
    if (!mouseDownPosition) { return; }

    // get the parent dimensions so that I can not allow moving the modal outside this.
    // TODO: get a better element ref for this, rather than using parent, as this makes it susceptible to bugs when moving these around.
    const parentWidth = modalContainerRef?.current?.parentElement?.offsetWidth ?? 0;
    const parentHeight = modalContainerRef?.current?.parentElement?.offsetHeight ?? 0;

    // get the dimensions of the modal
    const elHeight = modalContainerRef.current?.offsetHeight ?? 0;
    const elWidth = modalContainerRef.current?.offsetWidth ?? 0;

    const leftOffset = startOffset.left + event.clientX - mouseDownPosition.x;
    const topOffset = startOffset.top + event.clientY - mouseDownPosition.y;

    const movedAmount = {
      // don't allow left/top to put the modal outside the window
      left: Math.max(0, Math.min(leftOffset, parentWidth - elWidth)),
      top: Math.max(0, Math.min(topOffset, parentHeight - elHeight)),
    };

    setRelativePosition(movedAmount);
  }
  const dispatch = useDispatch();

  return (
    <>
      {/* {children && isOpen && ( */}
      {(
        /** I think this is actually not the intended use of the draggable attribute
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable
         * It seems to me that this is more about dragging some **data** to somewhere else.
         * E.g. it transfers something.
         * What I'm doing here is clicking and dragging the element, to move its visual position.
         */
        <StyledModal
          ref={modalContainerRef}
          style={{
            left: relativePosition.left,
            top: relativePosition.top,
            position: 'absolute'
          }}
          >
          <TopPanel>
            <DraggableArea
              draggable={true}
              onDragStart={event => {
                // disable the drag "ghost" image. i.e. just draw the actual element.
                event.dataTransfer.setDragImage(img, 0, 0);
                // when starting to drag, record the original offset.
                setStartOffset(relativePosition);
                // record the initial mouse down, so calculate difference between this and intermediate values
                setMouseDownPosition({x: event.clientX, y: event.clientY});
                setIsDragging(true);
              }}
              onDragEnd={event => {
                handleDrag(event);
                setIsDragging(false);
              }}
              onDrag={handleDrag}
            />
            {/* <CloseButton onClick={() => {}}>X</CloseButton> */}
            <CloseButton onClick={() => dispatch(closeAllModals())}>All</CloseButton>
            <CloseButton onClick={onClose}>X</CloseButton>
          </TopPanel>
          <ModalContentStack style={{pointerEvents: isDragging ? 'none' : 'initial'}}>
            {children}
          </ModalContentStack>
        </StyledModal>
      )}
    </>
  );
};

const Modals = () => {

}

const DraggableArea = styled.div`
  background: ${colors.darkBlue};
  flex-grow: 1;
  cursor: pointer;
  margin: 4.2px;
  border: 4px inset grey;
  cursor: crosshair;
`;
const CloseButton = styled.button`
  padding: 0.1rem 1rem;
  font-weight: bold;
  &:hover {
    color: white;
  }
`;
const TopPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

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

const ModalContentStack = styled(Stack)`
  padding: 2rem;
  padding-block: 1rem;
  padding-block-end: 3rem;
`;

const StyledModal = styled.section`
  background-image: ${colors.texturedBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  pointer-events: initial;
  box-sizing: border-box;
  height: fit-content;
  border: ${colors.borderWidth} solid ${colors.border};
`;
