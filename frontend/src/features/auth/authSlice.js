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
  },
  // extraReducers: (builder) => {
  //   builder.addCase(PURGE, () => {
  //     return initialState;
  //   });
  // },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;
