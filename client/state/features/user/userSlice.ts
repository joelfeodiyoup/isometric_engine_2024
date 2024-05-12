import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type User = {
  isLoggedIn: boolean,
    name: string,
    token: string,
    color: string,
};
interface UserState {
  value: User
}
const initialState: UserState = {
  value: {
    isLoggedIn: false,
    name: '',
    token: '',
    color: 'grey',
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      state.value = {...state.value, ...action.payload}
    },
    logOut: (state) => {
      state = initialState
    }
  }
});

export const {setUser, logOut} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.value;
export const userReducer = userSlice.reducer;