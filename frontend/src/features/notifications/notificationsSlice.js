import { createSlice } from '@reduxjs/toolkit';
import { userLoggedOut } from '../auth/authSlice';

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationShowed(state, action) {
      state.notifications.push(action.payload);
    },
    notificationsCleared() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoggedOut, () => {
      return initialState;
    });
  },
});

export const { notificationShowed, notificationsCleared } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
