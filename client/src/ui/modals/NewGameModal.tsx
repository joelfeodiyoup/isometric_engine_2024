import { useDispatch, useSelector } from "react-redux"
import { selectGameDimensions, selectGameState, setGameDimensions, setGameState } from "../../state/features/gameState/gameStateSlice"
import { ModalInstance } from "../layout-utilities/Modal"
import { useState } from "react"
import { StyledForm, StyledFormInput, StyledFormLabel, StyledFormRow } from "../elements/Form"
import { closeModal } from "../../state/features/ui/uiSlice"
import { resetGameControls } from "../../state/features/gameControls/gameControlsSlice"

export const NewGameModal = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const [tempGameState, setTempGameState] = useState(gameState);
  return <ModalInstance heading="new game" actions={[
    {label: "new game", onClick: () => {
      dispatch(setGameState(tempGameState));
      dispatch(resetGameControls());
      dispatch(closeModal("newGame"));
    }}
  ]}>
    <StyledForm>
      <StyledFormRow>
        <StyledFormLabel htmlFor="width">
          width:
        </StyledFormLabel>
        <StyledFormInput
          id="width"
          value={tempGameState.dimensions.width}
          onChange={event => setTempGameState({
            ...tempGameState,
            dimensions: {
              ...tempGameState.dimensions,
              width: Number(event.target.value)
            }
          })}
        />
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="height">
          height:
        </StyledFormLabel>
        <StyledFormInput
          id="height"
          value={tempGameState.dimensions.height}
          onChange={event => setTempGameState({
            ...tempGameState,
            dimensions: {
              ...tempGameState.dimensions,
              height: Number(event.target.value)
            }
          })}
        />
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="isometricX">
          x-width:
        </StyledFormLabel>
        <StyledFormInput
          id="isometricX"
          value={tempGameState.isometric.xStep}
          onChange={event => setTempGameState({
            ...tempGameState,
            isometric: {...tempGameState.isometric, xStep: Number(event.target.value)}})}
        />
      </StyledFormRow>
      <StyledFormRow>
        <StyledFormLabel htmlFor="isometricY">
          y-width:
        </StyledFormLabel>
        <StyledFormInput
          id="isometricY"
          value={tempGameState.isometric.yStep}
          onChange={event => setTempGameState({
            ...tempGameState,
            isometric: {...tempGameState.isometric, yStep: Number(event.target.value)}})}
        />
      </StyledFormRow>
    </StyledForm>
  </ModalInstance>
}