import { useDispatch, useSelector } from "react-redux"
import { selectGameDimensions, setGameDimensions } from "../../state/features/gameState/gameStateSlice"
import { ModalInstance } from "../layout-utilities/Modal"
import { useState } from "react"
import { StyledForm, StyledFormInput, StyledFormLabel, StyledFormRow } from "../elements/Form"
import { closeModal } from "../../state/features/ui/uiSlice"

export const NewGameModal = () => {
  const dispatch = useDispatch();
  const [dimensions, setDimensions] = useState(useSelector(selectGameDimensions));
  return <ModalInstance heading="new game" actions={[
    {label: "new game", onClick: () => {
      dispatch(setGameDimensions(dimensions));
      dispatch(closeModal());
    }}
  ]}>
    <StyledForm>
      <StyledFormRow>
        <StyledFormLabel htmlFor="width">
          width:
        </StyledFormLabel>
        <StyledFormInput
          id="width"
          value={dimensions.width}
          onChange={event => setDimensions({...dimensions, width: Number(event.target.value)})}
        />
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="height">
          height:
        </StyledFormLabel>
        <StyledFormInput
          id="height"
          value={dimensions.height}
          onChange={event => setDimensions({...dimensions, height: Number(event.target.value)})}
        />
      </StyledFormRow>
    </StyledForm>
  </ModalInstance>
}