import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";
import { ModalKeys } from "../../../ui/modals/useModalSelector";


interface UiState {
  value: {
    isModalOpen: boolean,
    modal: ModalKeys
  }
}
const initialState: UiState = {
  value: {
    isModalOpen: false,
    modal: "saveModal",
  }
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state) => {
      state.value = {...state.value, isModalOpen: true};
    },
    closeModal: (state) => {
      state.value = {...state.value, isModalOpen: false};
    },
    setModal: (state, action: PayloadAction<ModalKeys>) => {
      state.value = {...state.value, modal: action.payload};
    }
  }
});

export const {
  openModal, closeModal, setModal
} = uiSlice.actions;
export const selectUiState = (state: RootState) => state.ui.value;
export const uiReducer = uiSlice.reducer;