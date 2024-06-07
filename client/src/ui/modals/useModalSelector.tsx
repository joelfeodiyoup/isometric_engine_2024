import { SaveModal } from "./SaveModal"
import { LoginModal } from "./LoginModal";
import { NewGameModal } from "./NewGameModal";
import { AboutModal } from "./AboutModal";
import { AdvisorsModal } from "./AdvisorsModal";
import { FinancesModal } from "./FinancesModal";

const modals = {
  saveModal: () => SaveModal,
  newGame: () => NewGameModal,
  logIn: () => LoginModal,
  about: () => AboutModal,
  advisors: () => AdvisorsModal,
  finances: () => FinancesModal
}
export type ModalKeys = keyof typeof modals;

export const getModal = (key: ModalKeys) => modals[key];