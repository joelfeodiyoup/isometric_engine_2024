import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store";

interface UiState {
  value: {
    isModalOpen: boolean,
  }
}
const initialState: UiState = {
  value: {
    isModalOpen: false,
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
    }
  }
});

export const {
  openModal, closeModal
} = uiSlice.actions;
export const selectUiState = (state: RootState) => state.ui.value;
export const uiReducer = uiSlice.reducer;