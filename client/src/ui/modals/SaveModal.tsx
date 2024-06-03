import { useDispatch } from "react-redux"
import { closeModal } from "../../state/features/ui/uiSlice"
import { ModalInstance } from "../layout-utilities/Modal";

export const SaveModal = () => {
  const dispatch = useDispatch();
  return (<>
    <ModalInstance heading="save" actions={[
      {label: "save", onClick: () => console.log('saved (to be implemented')},
      {label: "cancel", onClick: () => dispatch(closeModal())}
    ]}>
    </ModalInstance>
  </>)
}
