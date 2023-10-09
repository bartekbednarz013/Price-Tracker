import { createSlice } from '@reduxjs/toolkit';
import { userLoggedOut } from '../auth/authSlice';

const initialState = {
  items: [],
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    itemsFetched(state, action) {
      state.items = action.payload;
    },
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemDeleted(state, action) {
      const item = action.payload;
      const index = state.items.findIndex((object) => {
        return object.id === item.id;
      });
      state.items.splice(index, 1);
    },
    itemUpdated(state, action) {
      const item = action.payload;
      const index = state.items.findIndex((object) => {
        return object.id === item.id;
      });
      state.items[index] = item;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoggedOut, () => {
      return initialState;
    });
  },
});

export const {
  itemsFetched,
  itemAdded,
  itemDeleted,
  itemUpdated,
  itemsCleared,
} = itemsSlice.actions;

export default itemsSlice.reducer;
