import { useDispatch } from "react-redux"
import { closeModal } from "../../state/features/ui/uiSlice"

export const SaveModal = () => {
  const dispatch = useDispatch();
  return (<>
    <button onClick={() => console.log('saved (to be implemented)')}>Save</button>
    <button onClick={() => dispatch(closeModal())}>Cancel</button>
  </>)
}
