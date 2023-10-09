import { createSlice } from '@reduxjs/toolkit';
import { itemAdded } from '../items/itemsSlice';
import { userLoggedOut } from '../auth/authSlice';

const initialState = {
  item: {},
};

const scraperSlice = createSlice({
  name: 'scraper',
  initialState,
  reducers: {
    itemScraped(state, action) {
      state.item = action.payload;
    },
    scraperCleared(state) {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(itemAdded, () => {
      return initialState;
    });
    builder.addCase(userLoggedOut, () => {
      return initialState;
    });
  },
});

export const { itemScraped, scraperCleared } = scraperSlice.actions;

export default scraperSlice.reducer;
