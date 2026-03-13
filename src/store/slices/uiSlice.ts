import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isPremiumModalOpen: boolean;
}

const initialState: UiState = {
  isPremiumModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openPremiumModal: (state) => {
      state.isPremiumModalOpen = true;
    },
    closePremiumModal: (state) => {
      state.isPremiumModalOpen = false;
    },
  },
});

export const { openPremiumModal, closePremiumModal } = uiSlice.actions;
export default uiSlice.reducer;