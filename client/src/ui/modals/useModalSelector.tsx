import { SaveModal } from "./SaveModal"
import { LoginModal } from "./LoginModal";
import { NewGameModal } from "./NewGameModal";
import { AboutModal } from "./AboutModal";

const modals = {
  saveModal: () => SaveModal,
  newGame: () => NewGameModal,
  logIn: () => LoginModal,
  about: () => AboutModal,
}
export type ModalKeys = keyof typeof modals;

export const getModal = (key: ModalKeys) => modals[key];