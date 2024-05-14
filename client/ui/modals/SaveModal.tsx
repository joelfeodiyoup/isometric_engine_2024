import { useDispatch } from "react-redux"
import { closeModal } from "../../state/features/ui/uiSlice"
import { MenuButton } from "../elements/Buttons";

export const SaveModal = () => {
  const dispatch = useDispatch();
  return (<>
    <MenuButton className='primary' onClick={() => console.log('saved (to be implemented)')}>Save</MenuButton>
    <MenuButton className='primary' onClick={() => dispatch(closeModal())}>Cancel</MenuButton>
  </>)
}
