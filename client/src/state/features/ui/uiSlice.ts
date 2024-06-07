import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";
import { ModalKeys } from "../../../ui/modals/useModalSelector";
import { Modal } from "../../../ui/layout-utilities/Modal";


interface UiState {
  value: {
    isModalOpen: boolean,
    modal: ModalKeys[]
  }
}
const initialState: UiState = {
  value: {
    isModalOpen: false,
    modal: [],
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state) => {
      state.value = {...state.value, isModalOpen: true};
    },
    closeModal: (state, action: PayloadAction<ModalKeys>) => {
      // state.value = {...state.value, isModalOpen: false};
      state.value = {...state.value, modal: state.value.modal.filter(x => x !== action.payload)};
    },
    closeAllModals: (state) => {
      state.value = {...state.value, modal: []}
    },
    setModal: (state, action: PayloadAction<ModalKeys>) => {
      const modals = [...state.value.modal];
      if (modals.indexOf(action.payload) === -1)  {
        modals.push(action.payload);
      }
      state.value = {...state.value, modal: modals};
    }
  }
});

export const {
  openModal, closeModal, setModal, closeAllModals
} = uiSlice.actions;
export const selectUiState = (state: RootState) => state.ui.value;
export const uiReducer = uiSlice.reducer;