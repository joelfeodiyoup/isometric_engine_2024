import { useSelector } from "react-redux"
import { SaveModal } from "./SaveModal"
import { selectUiState } from "../../state/features/ui/uiSlice";
import { LoginModal } from "./LoginModal";
import { useEffect, useState } from "react";

const modals = {
  saveModal: () => SaveModal,
  logIn: () => LoginModal
}
export type ModalKeys = keyof typeof modals;

export const getModal = (key: ModalKeys) => modals[key];

// export const useModalSelector = (modalKey: ModalKeys) => {
//   // const selectedModal = useSelector(selectUiState).modal;
//   const [modalElement, setModalElement] = useState<() => JSX.Element>(modals.saveModal);
//   useEffect(() => {
//     setModalElement(modals[modalKey]);
//   }, [modalKey])
//   return modalElement;
// }