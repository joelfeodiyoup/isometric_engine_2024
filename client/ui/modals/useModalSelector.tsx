import { SaveModal } from "./SaveModal"
import { LoginModal } from "./LoginModal";
import { NewGameModal } from "./NewGameModal";

const modals = {
  saveModal: () => SaveModal,
  newGame: () => NewGameModal,
  logIn: () => LoginModal
}
export type ModalKeys = keyof typeof modals;

export const getModal = (key: ModalKeys) => modals[key];