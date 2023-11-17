import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: '',
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { access_token, user } = action.payload;
      state.isAuthenticated = true;
      state.accessToken = access_token;
      state.user = user;
    },
    userLoggedOut() {
      return initialState;
    },
    userChangedMailingStatus(state, action) {
      state.user.email_notifications = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(PURGE, () => {
  //     return initialState;
  //   });
  // },
});

export const { userLoggedIn, userLoggedOut, userChangedMailingStatus } =
  authSlice.actions;

export default authSlice.reducer;
