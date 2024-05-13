import { SaveModal } from "./SaveModal"
import { LoginModal } from "./LoginModal";

const modals = {
  saveModal: () => SaveModal,
  logIn: () => LoginModal
}
export type ModalKeys = keyof typeof modals;

export const getModal = (key: ModalKeys) => modals[key];